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
import { Input, ViewChild, Component } from '@angular/core';

import { FormGroup } from '@angular/forms';
import { DataGridOption } from '../api/cmp/data-grid/data-grid.component';
import { DataTabsOption } from '../api/cmp/data-tabs/data-tabs.component';

@Component({
  template: ''
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

    location = `"${location.replace(',', '","')}"`;

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
        this._gridSourceRows = data.processed.data[0];
        this._gridSourceLookups = data.processed.lookups[0];
        if (this.mainGrid) this.mainGrid.Refresh();

        // reset current row
        let row: any = null;
        if (this._gridSourceRows.length) row = this._gridSourceRows[0];

        // console.log('RETURN DATA:', data, 'ROW:', row);

        this.ResetCurrentRow(row);
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

    const tbl: any = row.parentTable;
    let tableCode: string = tbl.tableCode;
    let includedFields: string = '';

    const keyName = tbl.keyName;
    const key = row[keyName];

    if (this.assetField) {
      includedFields = tableCode + '.*`NODE_ID`NODE_DESC';
      tableCode += `|-node,${this.assetField},REC_TAG`;
    }

    //console.log('GridRowClick', event, this.ds, this.sourceTable);
    this.suppressPendingRequestFlag = true;

    // set all isDataLoading flag to true
    this._loadingTimeoutHandle = setTimeout(() => {
      this.mainFormCollection.forEach((f) => (f.isDataLoading = true));
    }, this._loadingTimeout);

    this.ds.Get(
      [
        {
          code: tableCode,
          key: key,
          includedFields: includedFields,
          snapshot: true,
        },
      ],
      {
        onSuccess: (e) => {
          if (e.processed.data[0].length)
            this._currentRow = e.processed.data[0].length
              ? e.processed.data[0][0]
              : null;

          // triggers form scatter
          this._sourceRow = this._currentRow;

          // call module's local override function
          this.GridRowClickLocal(e);

          // if timeout for loading mask is not reached before data is received,
          // cancel timeout set!
          if (this._loadingTimeoutHandle)
            clearTimeout(this._loadingTimeoutHandle);

          // set all isDataLoading flag to false
          this.mainFormCollection.forEach((f) => (f.isDataLoading = false));

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

  // GridRowClickX(event) {
  //   //console.log("ROW EVENT", event);

  //   const row: any = event.row;
  //   if (!row) return;
  //   const tbl: any = row.parentTable;
  //   const keyName = tbl.keyName;

  //   this.suppressPendingRequestFlag = true;
  //   tbl.GetRowById(
  //     row[keyName],
  //     (data) => {
  //       tbl.currentKey = row[keyName];

  //       //this._sourceRow = tbl.currentRow;

  //       this.suppressPendingRequestFlag = false;
  //       console.log('Requested data:', data);
  //     },
  //     null,
  //     (data) => {
  //       if (data) {
  //         tbl.currentKey = row[keyName];
  //         //this._sourceRow = tbl.currentRow;

  //         this.suppressPendingRequestFlag = false;
  //         console.log('Cached data:', data);
  //       }
  //     }
  //   );
  // }
}
