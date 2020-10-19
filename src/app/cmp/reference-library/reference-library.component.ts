import { FilterDataType } from './../../api/mod/app-common.classes';
import { AppMainServiceService } from './../../svc/app-main-service.service';
import { CellTextAlign } from './../../api/cmp/data-grid/data-grid.component';
import { FormCommon } from './../form.common';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-reference-library',
  templateUrl: './reference-library.component.html',
  styleUrls: ['./reference-library.component.scss', '../form.common.scss'],
})
export class ReferenceLibraryComponent
  extends FormCommon
  implements OnInit, AfterViewInit {
  // Oreder of execution of component lifecyle events:
  // 1. constructor()
  // 2. ngOnInit()
  // 3. ngAfterViewInit()
  constructor(public dataSource: AppMainServiceService) {
    super(dataSource);
  }

  ngOnInit(): void {
    this.ds.SetLookupData(
      [
        { filterValue: 142 }, // Anomaly Status
        { filterValue: 139 }, // Anomaly Status
        // { filterValue: 156 }, // Survey Data Class
        // { filterValue: 157 }, // Chem Data Class
        // { filterValue: 253 }, // Compliance Module Status Color
      ],
      () => {
        // call all Anomaly Lookup formating methods
        console.log('this.RefLookup(142):', this.RefLookup(142));
        console.log('this.RefLookup(139):', this.RefLookup(139));
      }
    );

    // bypass setup tab because is was already called when the component was loaded once
    if (!this.moduleParamsInitialized) {
      // Set Common Data Settings
      this.CommonFormInit();

      // Call data grid option setup on success of getting all lookup dependencies
      this.SetupGridColumns();

      // Setup details tab
      this.SetupDetailsTab();
    }
  }

  SetupGridColumns() {
    const {
      center,
      minShort,
      minLong,
      minMemo,
      wd1,
      wd2,
      wd3,
      wd4,
      wd5,
      wd6,
    } = this.ds.constUISettings;

    // Setup main grid configuration
    this.mainGridOptions
      .RowHeight(22)

      // Set key column name
      .SetKeyColumnName('RF_ID')

      .AddColumn({ fieldName: 'RF_ID', width: 50, align: CellTextAlign.CENTER })
      .AddColumn({
        fieldName: 'RF_TYPE',
        width: 80,
        align: CellTextAlign.CENTER,
        lookupParams: {
          inlineLookupTableAlias: 'tlkp',
          inlineLookupTableField: 'LKP_DESC_B',
          inlineLookupFieldAlias: 'RTYPE',
        },
      })

      .AddColumn({
        fieldName: 'RF_DESC',
        minWidth: 250,
      })

      .AddColumn({
        fieldName: 'RF_ASSET',
        minWidth: minLong,
        filterType: FilterDataType.ASSET,
        lookupParams: {
          inlineLookupTableAlias: 'alkp',
          inlineLookupTableField: 'NODE_DESC',
          inlineLookupFieldAlias: 'ASSETNAME',
        },
      })

      .AddColumn({ fieldName: 'RF_FILENAME', minWidth: 150 })

      .AddRequiredDataFields(["RF_ID","RF_ASSET","ASSETNAME","RTYPE"])

      // module-specific join statement *****************************************
      .LeftJoin({
        code: 'node',
        alias: 'alkp',
        localField: 'RF_ASSET',
      })

      .LeftJoin({
        code: 'lkp',
        alias: 'tlkp',
        localField: 'RF_TYPE',
      })

  }

  SetupDetailsTab() {
    // Setup main tab configuration
    this.mainTabsOptions
      .AddTab({
        id: 1,
        label: 'General Information',
        icon: 'fa fa-info-circle',
        active: true,
      })
      .AddTab({ id: 2, label: 'Links', icon: '', active: false });
  }

  private _RefLookup: any = {};
  RefLookup(key: any): Array<any> {
    let lkpKey: string = key;
    const isCommonLookup = !isNaN(+key);

    if (isCommonLookup) lkpKey = 'lkp' + key;

    if (this._RefLookup[lkpKey])
      // formatted lookup is already set in _AnomalyLookup object
      return this._RefLookup[lkpKey];

    // anomaly lookup not yet available
    let ret: Array<any> = [];
    if (isCommonLookup)
      // get formatted lookup common lookup type where field mapping info is
      // embedded in the GetLookupItems function
      ret = this.ds.GetLookupItems(key);

    if (ret.length)
      // only create entry of the lookup in the this._AnomalyLookup object
      // if elements are exiting, otherwise, subsequent call will
      // return empty array and will cause issues on UI rendering.
      this._RefLookup[lkpKey] = ret;

    return [];
  }

  /********************************* action button events ******************************************/
  AddRecordEvent(args: any) {
    if (!this.treeView.currNode) {
      // prompt to select a record if currentRow is null
      this.dataSource.Confirm(
        'No asset selected',
        'Please select an asset where new anomaly will be raised.',
        { height: 170 }
      );

      return;
    }

    const row = this.ds.tblRefFiles.Add();

    const form: FormGroup = this.GetRowFormObject(true);
    const node = this.treeView.currNode;

    // initialize blank form with default values
    form.get('RF_ID').setValue(-1);
    form.get('RF_ASSET').setValue(node.did);

    for (const fieldName in form.controls)
      row[fieldName] = form.get(fieldName).value;

    this.dataSource
      .OpenPopup('addEditReffile', 870, 455, true, {
        row: row,

        // Define a blank form object
        formObject: form,
        // set AnomalyComponent as the parent component reference
        parent: this,
        // Dialog title
        title: 'Add New Reference File',
        // dialog title icon
        icon: 'far fa-file-alt',
        // dialog action buttons
        buttons: [
          {
            label: 'Cancel',
            value: 'cancel',
            class: 'btn btn-sm btn-secondary',
          },
          {
            label: 'Reset',
            value: 'reset',
            class: 'btn btn-sm btn-secondary',
          },
          {
            label: 'Save',
            value: 'save',
            class: 'btn btn-sm btn-warning',
          },
        ],
      })
      .subscribe((result) => {
        // if (result) {
        //   if (result.mode == 'accept') this.SaveRecord(result);
        // } else this.CancelUpdate();
      });
  }

  ngAfterViewInit() {
    //
  }
}
