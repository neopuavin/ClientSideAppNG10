import { FilterDataType } from './../../api/mod/app-common.classes';
import { AppMainServiceService } from './../../svc/app-main-service.service';
import { CellTextAlign } from './../../api/cmp/data-grid/data-grid.component';
import { FormCommon } from './../form.common';
import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-reference-library',
  templateUrl: './reference-library.component.html',
  styleUrls: ['./reference-library.component.scss', '../form.common.scss'],
})
export class ReferenceLibraryComponent extends FormCommon
  implements OnInit, AfterViewInit {
  // Oreder of execution of component lifecyle events:
  // 1. constructor()
  // 2. ngOnInit()
  // 3. ngAfterViewInit()
  constructor(public dataSource:AppMainServiceService) {
    super(dataSource);
  }

  ngOnInit(): void {

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

  SetupGridColumns(){

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

  SetupDetailsTab(){
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

  private _AnomalyLookup: any = {};
  RefLookup(key: any): Array<any> {
    let lkpKey: string = key;
    const isCommonLookup = !isNaN(+key);

    if (isCommonLookup) lkpKey = 'lkp' + key;
    if (this._AnomalyLookup[lkpKey])
      // formatted lookup is already set in _AnomalyLookup object
      return this._AnomalyLookup[lkpKey];

    // anomaly lookup not yet available
    let ret: Array<any> = [];
    if (isCommonLookup)
      // get formatted lookup common lookup type where field mapping info is
      // embedded in the GetLookupItems function
      ret = this.ds.GetLookupItems(key);
    else if (lkpKey == 'antype')
      // get formatted lookup for specific type where field mapping info is
      // specified as parameter in the GetLookupItems function
      ret = this.ds.GetLookupItems(key, {
        key: 'ANTYPE_ID',
        text: 'ANTYPE_NAME',
        code: 'ANTYPE_CODE',
        group: 'ANTYPE_GROUP',
      });

    // only create entry of the lookup in the this._AnomalyLookup object
    // if elements are exiting, otherwise, subsequent call will
    // return empty array and will cause issues on UI rendering.
    if (ret.length) this._AnomalyLookup[lkpKey] = ret;

    return [];
  }


  ngAfterViewInit() {
    //
  }
}
