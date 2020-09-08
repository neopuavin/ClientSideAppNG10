import { ColumnInfo } from './../api/mod/app-column.model';
import { AppFormAComponent } from './../api/cmp/app-form-a/app-form-a.component';
import { AppDataset, IAccessRights } from './../svc/app-dataset.service';
import { AppMainServiceService } from './../svc/app-main-service.service';
import { RequestParams } from './../api/mod/app-params.model';

import { DataTab } from './../api/cmp/data-tabs/data-tabs.component';
import { DataGridComponent } from './../api/cmp/data-grid/data-grid.component';

import {
  TreeViewNode,
  TreeViewComponent,
} from './../api/cmp/tree-view/tree-view.component';
import {
  Input,
  ViewChild,
  Component,
  ComponentFactoryResolver,
} from '@angular/core';

import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { DataGridOption } from '../api/cmp/data-grid/data-grid.component';
import { DataTabsOption } from '../api/cmp/data-tabs/data-tabs.component';
import { JsonPipe } from '@angular/common';

@Component({
  template: '',
})
export class FormCommon {
  constructor(public dataSource: AppMainServiceService) {}

  @ViewChild('mainGrid') mainGrid: DataGridComponent;

  @Input() public moduleId: number = -1;
  @Input() public formTitle: string = '';
  @Input() public sourceTable: any = null;
  @Input() public assetField: any = null;
  @Input() public treeView: TreeViewComponent;

  @Input() public detailsHeight: number = 180;

  myForm: FormGroup = null;

  public mainGridOptions = new DataGridOption([]);
  public mainTabsOptions = new DataTabsOption([]);
  public mainFormCollection: Array<AppFormAComponent> = [];
  public mainFormObject: FormGroup = new FormGroup({});
  public mainRecordsBuffer: Array<any> = [];

  public suppressPendingRequestFlag: boolean = false;

  private _moduleTitle: string = '';
  private _moduleItem: any = null;

  CommonFormInit() {
    if (this.sourceTable != null && this.mainGridOptions != null) {
      // set initial join expression and filter parameters
      // *** base where ***
      // place base filter expressions here if applicable
      // *** base order by ***
      //.OrderBy([])
      // SET BASE WHERE AND ORDER BY CLAUSE
      this.mainGridOptions
        // SET FROM CLAUSE
        .From(this.sourceTable.tableCode)
        .InnerJoin({
          code: 'tre',
          localField: this.assetField,
          foreignField: 'TRE_DAT_TAG',
        })
        .InnerJoin({
          code: 'node',
          localField: this.assetField,
          foreignField: 'REC_TAG',
        }).BaseFilterDefineOn.BaseFilterDefineOff;
    } else {
      console.log('from clause not set!', this.sourceTable != null);
    }

    // create all controls in main form object
    this.mainFormObject = this.GetRowFormObject(true);
    console.log('Initial this.mainFormObject:', this.mainFormObject);
  }

  public get ds(): AppDataset {
    //return this.dataSource.DataSources[0];
    return this.dataSource.ActiveSource.appDataset;
  }

  public get activeTab(): DataTab {
    if (!this.mainTabsOptions.activeTab)
      return new DataTab({ id: -1, label: 'unknown' });
    return this.mainTabsOptions.activeTab;
  }

  public get moduleTitle() {
    if (this.formTitle) this._moduleTitle = this.formTitle;

    if (this._moduleTitle == '') {
      const menuList = this.ds.menuList;

      menuList.forEach((m) => {
        if (m.subMenu) {
          const menuItem = m.subMenu.find((sm) => sm.id == this.moduleId);
          if (menuItem) this._moduleTitle = menuItem.label;
        }
      });
    }
    return this._moduleTitle + ' Module';
  }

  public get moduleData(): any {
    return 'data';
  }

  public get currTreeNode(): TreeViewNode {
    return this.ds.currTreeNode;
  }

  public get gridPanelHeight(): string {
    return 'calc(100vh - ' + (this.detailsHeight + 116) + 'px)';
  }

  public get reqInfo(): any {
    return this.sourceTable.lastRequestDataParams;
  }

  public get rootLocation(): string {
    return '$$%';
  }

  public get isLoadingData(): boolean {
    return this.sourceTable.pendingRequest && !this.suppressPendingRequestFlag;
  }

  private _isRowWaiting: boolean = false;
  public get isRowWaiting(): boolean {
    return this._isRowWaiting;
  }

  public get promptLoadingData(): string {
    if (!this.ds.currTreeNode) return 'Loading...';
    return (
      'Loading data from ' +
      this.ds.currTreeNode.text +
      ' branch. Please wait...'
    );
  }

  private _rights: IAccessRights = {};
  public get rights(): IAccessRights {
    // place user specific access permission codes here ..
    if (!this._rights.allowAdd) this._rights.allowAdd = true;
    if (!this._rights.allowEdit) this._rights.allowEdit = true;
    if (!this._rights.allowDelete) this._rights.allowDelete = true;
    if (!this._rights.allowPrint) this._rights.allowPrint = true;

    return this._rights;
  }
  public set rights(value: IAccessRights) {
    if (!value) this._rights = {};
    else {
      for (let key in value) this._rights[key] = value[key];
    }
  }

  private _sourceRow: any = null;
  public get sourceRow(): any {
    //@Input() public sourceRow: any = null;
    //return this._sourceRow;
    if (!this.sourceTable) return null;
    //return this.sourceTable.currentRow;
    return this._sourceRow;
  }

  private _gridSourceRows: Array<any> = [];
  public get gridSourceRows(): Array<any> {
    return this._gridSourceRows;
  }
  private _gridSourceLookups: Array<any> = [];
  public get gridSourceLookups(): Array<any> {
    return this._gridSourceLookups;
  }

  public AddGridAssetLookupItem(key: number, name: string) {
    const lkp = this.gridSourceLookups['ASSETNAME'];
    if (!lkp) return;
    lkp[key] = name;
  }

  public isMainTabActive(id: number): boolean {
    const tab: DataTab = this.activeTab;
    if (tab) return false;
    return this.activeTab.id == id;
  }

  // Placeholder for setting up filter Overidden from
  // specific modules
  public SetFilterParams(): void {}

  SetupData(pageNumber?: number, pageSize?: number) {
    // Get initial table data, get
    //http://ngimsa.ivideolib.com/api/app/svyhdr/-/@tre|TRE_NOD_LOC/-/-/-/1/10000?key=$$$$$;,$$$$$;%25

    const fieldList = this.mainGridOptions.FieldList;

    if (fieldList.length == 0) {
      console.log('DATA FIELD NOT SET');
      return;
    }

    if (pageNumber == undefined || pageSize != undefined) pageNumber = 1;

    if (pageSize == undefined) {
      if (this.reqInfo.pageSize) {
        pageSize = this.reqInfo.pageSize;
      } else {
        pageSize = this.mainGridOptions.pageSize;
      }
    }

    let location: string = !this.ds.currTreeNode
      ? this.rootLocation
      : this.ds.currTreeNode.loc + ',' + this.ds.currTreeNode.loc + '%';

    location = `"${location.replace(/,/gi, '","')}"`;

    let filter: string = `{TRE_NOD_LOC|${location}}`;
    this.SetFilterParams();
    const localFilter = this.mainGridOptions.whereClause;
    filter += (localFilter ? '^' : '') + localFilter;

    let requestParams: RequestParams = {
      code: this.mainGridOptions.fromClauseCode,
      includedFields: fieldList,
      filter: filter,
      pageNumber: pageNumber,
      pageSize: pageSize,
      //clearExisting: true,
      snapshot: true,
      sortFields: this.mainGridOptions.orderByClause,
    };

    // console.log(JSON.stringify(requestParams));

    this.ds.Get([requestParams], {
      onSuccess: (data) => {
        // processed rows for the grid to display
        this._gridSourceRows = data.processed.data[0];

        // inline lookup definitions
        this._gridSourceLookups = data.processed.lookups[0];

        //console.log("this._gridSourceLookups:",this.gridSourceLookups['ASSETNAME']);

        // refresh data grid to display extracted data
        if (this.mainGrid) this.mainGrid.Refresh();

        // reset current row
        let row: any = null;
        if (this._gridSourceRows.length) row = this._gridSourceRows[0];

        // console.log('RETURN DATA:', data, 'ROW:', row);

        this.ResetCurrentRow(row);
        this.mainGridOptions.RecordExtractedDataFieldnames();
      },
    });
  }

  TabClicked(tab: DataTab) {
    // this method will be overridden
    // in the derived form
  }

  public ChangePage(args: any) {
    this.SetupData(args.page);
  }

  public PageSizeChange(args: any) {
    this.SetupData(1, args.pageSize);
  }

  AddRecordEvent(args: any) {
    console.log('AddRecordEvent', args);
  }
  EditRecordEvent(args: any) {
    console.log('EditRecordEvent', args);
  }
  DeleteRecordEvent(args: any) {
    console.log('DeleteRecordEvent', args);
  }
  PrintRecordEvent(args: any) {
    console.log('PrintRecordEvent', args);
  }

  SearchEvent(args: any) {
    console.log('SearchEvent', args);
  }

  public GetRowFormObject(blankForm?: boolean): FormGroup {
    // create form object containing controls based on the entire
    // table field definitions which contains values from the current row.

    if (!blankForm) blankForm = false;

    if (!this.sourceTable || (!this.currentRow && !blankForm)) return null;

    const form: FormGroup = new FormGroup({});
    const cols: Array<ColumnInfo> = this.sourceTable.columns;
    const row = this.currentRow;

    // loop through the table's column definitions
    cols.forEach((c) => {
      const fieldName = c.name;
      const ctrl: AbstractControl = new FormControl(
        blankForm ? null : row[fieldName]
      );
      form.addControl(fieldName, ctrl);
    });

    //this.sourceTable.fields
    // clone
    //this._currentRow
    console.log('\nthis.currentRow:', this.currentRow, '\nform:', form);
    return form;
  }

  DataChanged(form: FormGroup, row: any): any {
    let ret: any = null;

    // get table defintion of the row
    const tbl = row.parentTable;
    if (!tbl) return null;
    const cols = tbl.columns;
    if (!cols) return null;

    for (const field in form.controls) {
      // 'field' is a string
      const ctrl: AbstractControl = form.get(field); // 'control' is a FormControl
      const col = cols.find((c) => c.name == field);
      if (col && ctrl.value != row[field]) {
        // field value changed
        if (!ret) ret = {};
        ret[field] = ctrl.value;
      }
    }

    return ret;
  }

  SaveData(
    form: FormGroup,
    row: any,
    dialogRef?: any,
    extraPostParam?: any,
    userStampFields?: Array<string>,
    dateStampFields?: Array<string>
  ) {
    const changed = this.DataChanged(form, row);
    if (changed) {
      this.dataSource
        .Confirm(
          'Confirm Save',
          'This action will overwite previously saved field values.<br/><br/>Do you want to continue?',
          { width: 500, height: 230, labelYes: 'Yes', labelNo: 'No' }
        )
        .subscribe((result) => {
          if (result.mode == 'yes') {

            // get table specific parameters
            const tbl = this.sourceTable;
            const tableCode = tbl.tableCode;
            const keyName = tbl.keyName;

            // set record's key field value if not yet set,
            // which normally is the case on editing mode.
            // when mode is adding a new record, key value is
            // normally set at the calling component, with integer value
            // less than zero (0) to indicate that a new record is
            // to be created

            if(changed[keyName] == undefined)changed[keyName] = row[keyName];

            // handle stamps
            if(userStampFields){
              // set value of fields to contain the current user's
              // name as enumerated in the calling (add/edit/delete) component
              // eg. CREATED_BY, UPDATED_BY, etc.
              userStampFields.forEach(fieldName=>changed[fieldName] = this.ds.userInfo.name);
            }
            if(dateStampFields){
              // set value of fields to contain the current date
              // name as enumerated in the calling (add/edit/delete) component
              // eg. CREATED_DATE, UPDATED_DATE, etc.
              dateStampFields.forEach(fieldName=>changed[fieldName] =this.ds.dateStampString);
            }

            // initialize form data variable
            const formData = {};

            // populate formData main object
            formData[tableCode] = [changed];

            // handle other post parameters passed through extraPostParam
            if(extraPostParam){
              // this is additional post instruction parameters that will
              // be requested together with the main table row post instruction.
              // parameter value has the following format
              /*
              *  {tableCode1:Array<<record data1>[,record data2][,record data#]>},
              *  {tableCode2:Array<<record data1>[,record data2][,record data#]>},
              *  {tableCode#:Array<<record data1>[,record data2][,record data#]>},
              */
            }

            const obs = this.ds.Post(formData);
            if (obs) {
              const subs = obs.subscribe(
                (data) => {
                  console.log('POST Return Data:', data);
                },
                (err) => {
                  console.log('Error: ', err);
                }
              );
            }

            // call update client
            this.UpdateClient(changed);

            // close dialog after a successful posting
            if (dialogRef) dialogRef.close({ mode: 'saved' });

            this.dataSource.openSnackBar(
              'Start data posting process.',
              'X',
              1500
            );
          } else {
            this.dataSource.openSnackBar('Continue editing record.', 'X', 1500);
          }
        });
      return;
    } else {
      this.dataSource.Confirm(
        'Nothing to change',
        'No modifications made to the current record.',
        { width: 450, height: 180 }
      );
    }
  }

  UpdateClient(data: any) {
    // post changed data taken from the add/edit form object

    for (let field in data) {
      const value = data[field];

      // update main form obj value
      const ctrl = this.mainFormObject.get(field);
      if (ctrl) {
        ctrl.setValue(value);
      } else {
        console.log(`Control ${field} not found.`);
      }

      // update currentRow value
      this.currentRow[field] = value;

      // update grid value
      if (this.mainGrid._currentRow[field] != undefined)
        this.mainGrid._currentRow[field] = value;
    }
    console.log(
      '\nUpdateClient data:',
      data,
      '\nthis.mainFormObject',
      this.mainFormObject,
      '\nthis.mainGrid._currentRow',
      this.mainGrid._currentRow
    );
  }

  ResetData(form: FormGroup, row: any) {
    if (!this.DataChanged(form, row)) return;
    this.dataSource
      .Confirm(
        'Confirm Reset',
        'Resetting will discard all changes made and will restore original values.<br/><br/>Do you want to continue?',
        { width: 550, height: 230, labelYes: 'Yes', labelNo: 'No' }
      )
      .subscribe((result) => {
        if (result.mode == 'yes') {
          for (const field in form.controls) {
            // 'field' is a string
            const ctrl: AbstractControl = form.get(field); // 'control' is a FormControl
            if (ctrl) ctrl.setValue(row[field]);
          }
          this.dataSource.openSnackBar(
            'Restored original field values reset.',
            'Close',
            2000
          );
        }
      });
  }

  public GridRowClickLocal(data: any): void {
    /*interface function*/
  }

  // delay before setting loading mask
  private _loadingTimeout: number = 200;

  // loading mask handle
  private _loadingTimeoutHandle: any = null;

  ResetCurrentRow(row?: any) {
    // sets current row in the gird and retrieves actual record to scatter on data form
    if (!row) {
      this._currentRow = null;
      this._sourceRow = this._currentRow;
    } else if (this.mainGrid) {
      this.mainGrid.currentRow = row;
      this.GridRowClick({ row: row, e: null });
    }
  }

  GridRowClick(event) {
    const row: any = event.row;
    if (!row) return;

    // get table object definition
    const tbl: any = row.parentTable;
    // table code to be used as the primary table alias
    let tableCode: string = tbl.tableCode;
    let includedFields: string = '';

    const keyName = tbl.keyName;
    const key = row[keyName];

    //if row is already in the buffer array,
    // set to buffer record to current row and exit this method
    const buf = this.mainRecordsBuffer.find((br) => br[keyName] == key);

    if (buf) {
      // triggers form scatter
      this._currentRow = buf;
      this._sourceRow = this._currentRow;
      // console.log("Get from buffer! ",this.mainRecordsBuffer.length);
      return;
    }

    let assetKey: number = null;
    if (this.assetField) {
      // if asset fieldname is defined, get asset information infomation
      // from related tables (ie. asset code, desctription)
      assetKey = row[this.assetField];

      // select all fields in the main table, NODE_ID and NODE_DESC from the nodesAttrib table
      includedFields = tableCode + '.*`NODE_ID`NODE_DESC';

      // append table relationship to node attrib
      tableCode += `|-node,${this.assetField},REC_TAG;`;
    }

    this.suppressPendingRequestFlag = true;

    // set all isDataLoading flag to true
    this._loadingTimeoutHandle = setTimeout(() => {
      this.mainFormCollection.forEach((f) => (f.isDataLoading = true));
      this._isRowWaiting = true;
    }, this._loadingTimeout);

    this.ds.Get(
      [
        {
          code: tableCode,
          key: key,
          includedFields: includedFields,
          snapshot: true,
        },
        {
          // get tre_nod_loc on a separate sub request because this is faster than
          // relating the struct table to the current selected data row
          code: 'tre',
          filter: `{TRE_DAT_TAG|${assetKey}}^{TRE_DAT_TYPE|${this.ds.currentTreeId}}`, // `{TRE_DAT_TAG|${+assetKey}}`,
          includedFields: 'TRE_NOD_LOC',
          snapshot: true,
        },
      ],
      {
        onSuccess: (e) => {
          if (e.processed.data[0].length) {
            // set details current row data
            this._currentRow = e.processed.data[0].length
              ? e.processed.data[0][0]
              : null;

            // set current row's tree location position data
            this._currentRow.XTRA = {
              TRE_NOD_LOC: e.processed.data[1].length
                ? e.processed.data[1][0]['TRE_NOD_LOC']
                : null,
            };

            this._currentRow.XTRA = {
              assetLookup: [
                {
                  key: this._currentRow[this.assetField],
                  code: this._currentRow.XTRA.NODE_ID,
                  text: this._currentRow.XTRA.NODE_DESC,
                  location: this._currentRow.XTRA.TRE_NOD_LOC,
                },
              ],
            };

            // set current row asset lookup
          }

          // add currentRow to buffer
          this.mainRecordsBuffer.push(this._currentRow);

          // triggers form scatter
          this._sourceRow = this._currentRow;

          // call module's local override function
          this.GridRowClickLocal(e);
          // console.log("this.mainRecordsBuffer.length: ",this.mainRecordsBuffer.length);

          // if timeout for loading mask is not reached before data is received,
          // cancel timeout set!
          if (this._loadingTimeoutHandle)
            clearTimeout(this._loadingTimeoutHandle);

          // set all isDataLoading flag to false
          this.mainFormCollection.forEach((f) => (f.isDataLoading = false));

          this._isRowWaiting = false;
          this.suppressPendingRequestFlag = false;
        },
        onError: (err) => {
          console.log('Error getting single row data...');
        },
      }
    );
  }

  private _currentRow: any = null;
  public get currentRow(): any {
    return this._currentRow;
  }

  public isCurrentRow(row: any): boolean {
    if (!this.currentRow) return false;
    //return ITS_JUST_ANGU
  }

  // onChanges(): void {
  //   this.mainFormObject.valueChanges.subscribe((val) => {
  //     console.log('ON CHANGES!', val);
  //   });
  // }

  SaveRecord(result: any) {
    console.log('Save updates:', result);

    return;

    const formVal = this.mainFormObject.value;
    let postValues = {};
    let willPOST: boolean = false;
    for (let field in formVal) {
      if (formVal[field] != this.currentRow[field]) {
        postValues[field] = formVal[field];
        this.currentRow[field] = postValues[field];
        willPOST = true;
      }
    }

    // refresh display, call scatter method for each form/subform
    // with recordChanged flag to reset fieldsInitialized parameter set to true
    if (willPOST) {
      // call POST method to save postValues
      console.log('POST Values: ', postValues);

      // scatter values on successful posting
      this.mainFormCollection.forEach((f) => f.Scatter(true));
    }
  }

  CancelUpdate() {
    console.log('CancelUpdate:', this._currentRow);
    return;
    console.log('CancelUpdate:', this._currentRow, this.mainFormObject);
    const formVal = this.mainFormObject.value;

    let patchValues = {};
    for (let field in formVal) {
      if (formVal[field] != this.currentRow[field])
        patchValues[field] = this.currentRow[field];
    }

    this.mainFormObject.patchValue(patchValues);
  }
}
