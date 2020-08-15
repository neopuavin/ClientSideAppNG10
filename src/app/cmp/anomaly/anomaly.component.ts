import { DataOption, ILookupItem } from './../../api/mod/app-common.classes';
import { AppMainServiceService } from './../../svc/app-main-service.service';
import { FormCommon } from './../form.common';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CellTextAlign } from 'src/app/api/cmp/data-grid/data-grid.component';

@Component({
  selector: 'app-anomaly',
  templateUrl: './anomaly.component.html',
  styleUrls: ['./anomaly.component.scss', '../form.common.scss'],
})
export class AnomalyComponent extends FormCommon
  implements OnInit, AfterViewInit {
  constructor(public dataSource: AppMainServiceService) {
    super(dataSource);
    console.log('module data:', this.moduleData);
  }

  ngOnInit(): void {
    // Setup Lookup data
    // setup lookup data....
    this.ds.SetLookupData(
      [
        { filterValue: 143 }, // Anomaly Status
        { filterValue: 144 }, // Anomaly Class
        { filterValue: 146 }, // Anomaly Life Term
        { filterValue: 147 }, // Anomaly risk ranking Livelihood
        { filterValue: 148 }, // Anomaly risk ranking Severity
        { filterValue: 149 }, // Anomaly Type Group
        { tableCode: 'mtx' }, // Anomaly Risk Matrix data
        { tableCode: 'antype' }, // Anomaly Type
        // { filterValue: 156 }, // Survey Data Class
        // { filterValue: 157 }, // Chem Data Class
        // { filterValue: 253 }, // Compliance Module Status Color
      ],
      () => {
        // call all Anomaly Lookup formating methods
        this.AnomalyLookup(143);
        this.AnomalyLookup(144);
        this.AnomalyLookup(146);
        this.AnomalyLookup(147);
        this.AnomalyLookup(148);
        this.AnomalyLookup(149);
        this.AnomalyLookup('antype');
        this.ds.riskMatrixData;
      }
    );

    // Set Common Data Settings
    this.CommonFormInit();

    // Setup grid
    this.mainGridOptions
      // Data grid UI definition *****************************************
      .RowHeight(22)

      // add data grid columns *****************************************
      .AddColumn({
        fieldName: 'AN_ID',
        width: 50,
        caption: 'ID',
        align: CellTextAlign.CENTER,
        isKey: true,
      })
      .AddColumn({ fieldName: 'AN_ASSET_ID', minWidth: 200 })
      .AddColumn({
        fieldName: 'AN_STATUS',
        width: 80,
        caption: 'Status',
        align: 'center',
      })
      .AddColumn({
        fieldName: 'AN_ORIG_CLASS',
        width: 80,
        align: 'center',
        colorParams: {
          foreGround: { 8470: '#fff', 8471: '#000', 8472: '#fff' },
          backGround: { 8470: '#28a745', 8471: '#ffc107', 8472: '#dc3545' },
        },
      })
      .AddColumn({
        fieldName: 'AN_CURR_CLASS',
        width: 80,
        align: 'center',
        colorParams: {
          foreGround: { 8470: '#fff', 8471: '#000', 8472: '#fff' },
          backGround: { 8470: '#28a745', 8471: '#ffc107', 8472: '#dc3545' },
        },
      })
      .SetKeyColumnName('AN_ID')

      // module-specific join statement *****************************************
      .LeftJoin({
        code: 'node',
        alias: 'alkp',
        localField: 'AN_ASSET_ID',
      })
      .LeftJoin({
        code: 'lkp',
        alias: 'ocls',
        localField: 'AN_ORIG_CLASS',
      })
      .LeftJoin({
        code: 'lkp',
        alias: 'ccls',
        localField: 'AN_CURR_CLASS',
      })
      .LeftJoin({
        code: 'lkp',
        alias: 'stat',
        localField: 'AN_STATUS',
      })

      // request includedFields - ****************************************************
      .AddField('AN_ID')
      .AddField('AN_REF')
      .AddField('AN_TYPE')
      .AddFieldWithOptions({
        fieldName: 'AN_STATUS',
        displayField: 'STATUS',
      })
      .AddFieldWithOptions({
        fieldName: 'AN_ASSET_ID',
        displayField: 'ASSETNAME',
      })
      .AddFieldWithOptions({
        fieldName: 'AN_ORIG_CLASS',
        displayField: 'OCLS',
      })
      .AddFieldWithOptions({
        fieldName: 'AN_CURR_CLASS',
        displayField: 'CCLS',
      })

      // ******************** Lookups ***************************************
      .AddFieldWithOptions({
        fieldName: 'NODE_DESC',
        fieldAlias: 'ASSETNAME',
        tableAlias: 'alkp',
      })
      .AddFieldWithOptions({
        fieldName: 'LKP_DESC_B',
        fieldAlias: 'STATUS',
        tableAlias: 'stat',
      })
      .AddFieldWithOptions({
        fieldName: 'LKP_DESC_B',
        fieldAlias: 'CCLS',
        tableAlias: 'ccls',
      })
      .AddFieldWithOptions({
        fieldName: 'LKP_DESC_B',
        fieldAlias: 'OCLS',
        tableAlias: 'ocls',
      });

    // setup tab
    this.mainTabsOptions
      .AddTab({
        id: 1,
        label: 'General Information',
        icon: 'fa fa-info-circle',
        active: true,
      })
      .AddTab({ id: 2, label: 'Assessment', icon: '', active: false })
      .AddTab({ id: 3, label: 'Recommendations', icon: '', active: false })
      .AddTab({ id: 4, label: 'Risk Ranking', icon: '', active: false })
      .AddTab({ id: 5, label: 'Failure Threats', icon: '', active: false })
      .AddTab({ id: 6, label: 'Attachments', icon: '', active: false })
      .AddTab({ id: 7, label: 'Actions', icon: '', active: false })
      .AddTab({ id: 8, label: 'Related Anomalies', icon: '', active: false });
  }

  SetFilterParams(): void {
    this.mainGridOptions;
    //.Like({fieldName:'NODE_DESC'},"%Module%",true)
    // .In({fieldName:'NODE_DESC'},["Umb%","Control%"],true)

    // .SubFilterClear
    // .ORS
    // .Like({fieldName:'NODE_DESC'},"%umb%")
    // .Like({fieldName:'NODE_DESC'},"%control%")
    // .ORE

    //.Like({fieldName:'NODE_DESC'},"%umb%",true)
    //.Like({fieldName:'NODE_DESC'},"%control%")
  }

  private _AnomalyLookup: any = {};
  AnomalyLookup(key: any): Array<any> {
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

  ngAfterViewInit(): void {
    console.log('ngOnInit INIT!');

    try {
      let dato: DataOption = new DataOption();
      dato
        //  source table(s) code defintion
        .From('ft')
        .LeftJoin({
          code: 'lkp',
          localField: 'FT_GROUP',
          foreignField: 'LKP_ID',
          alias: 'grp',
        }) // foreign field is optional if the keyName of the child table is where the link is to be made
        .LeftJoin({
          code: 'lkp',
          localField: 'FT_TYPE',
          foreignField: 'LKP_ID',
          alias: 'typ',
        })

        // included field definition
        .AddField('FT_ID')
        .AddField('FT_CODE')
        .AddField('FT_NAME')

        .AddFieldWithOptions({ fieldName: 'FT_GROUP', displayField: 'FTG' })
        .AddFieldWithOptions({ fieldName: 'FT_TYPE', displayField: 'FTT' })
        .AddField('FT_CORR_REL')

        // inline lookup definitions
        .AddFieldWithOptions({
          fieldName: 'LKP_DESC_B',
          fieldAlias: 'FTG',
          tableAlias: 'grp',
        })
        .AddFieldWithOptions({
          fieldName: 'LKP_DESC_B',
          fieldAlias: 'FTT',
          tableAlias: 'typ',
        })

        // linked table filtering
        .LeftLinkedTo('an', [841, 734])

        // where condition codes
        .Equal({ fieldName: 'FT_GROUP' }, 8707);

    } catch (e) {
      console.log('ERROR in ngAfterViewInit:', e.message);
    }
  }

  GridRowClickLocal(data: any) {
    // redefinition of GridRowClickLocal
    const row = this.currentRow;
    this.mainTabsOptions.tabs[0].toolTip = row
      ? `[Ref#:${row.AN_REF}] ${row.AN_TITLE}`
      : null;

    //console.log("TIP!:", row ? `${row.AN_REF}-${row.AN_TITLE}` : null,this.mainTabsOptions.tabs[0]);
  }

  /********************************* action button events ******************************************/
  AddRecordEvent(args: any) {
    // override function
    console.log('AddRecordEvent', args, 'TreeView:', this.treeView);
    if (this.treeView) {
      // this.treeView.ResetStatus(-2);
      setTimeout(() => {
        this.ds.treeColorData = null; // will trigger re-fetching of tree color data
        this.treeView.ResetStatus(); // will set all status to value that will allow re-assignment of color
      }, 50);
    }
    // this.OpenAddEditAnomaly();
  }

  EditRecordEvent(args: any) {
    // override function
    console.log('EditRecordEvent', args, 'Current row:', this.currentRow);
    if (!this.currentRow) {
      this.dataSource.OpenPopup('alert', 450, 200, false, {
        title: 'No Current Record',
        icon: 'fa-exclamation-circle',
        message: 'Please select an Anomaly record to edit',
        buttons: [
          {
            label: 'Close',
            value: 'close',
            class: 'btn btn-sm btn-warning',
          },
        ],
      });
      return;
    }
    this.dataSource
      .OpenPopup('addEditAnomaly', 870, 475, true, {
        row: this.currentRow,
        assetLookup: [
          {
            key: this.currentRow.AN_ASSET_ID,
            code: this.currentRow.XTRA.NODE_ID,
            text: this.currentRow.XTRA.NODE_DESC,
          },
        ],
        formObject: this.mainFormObject,
        parent: this,
        title: 'Edit Anomaly',
        icon: 'fa-edit',
        buttons: [
          {
            label: 'Cancel',
            value: 'cancel',
            class: 'btn btn-sm btn-secondary',
          },
          { label: 'Save', value: 'save', class: 'btn btn-sm btn-warning' },
        ],
      })
      .subscribe((result) => {
        console.log(`Dialog result: ${result}`);
      });
  }

  DeleteRecordEvent(args: any) {
    console.log('DeleteRecordEvent', args, 'Current row:', this.currentRow);
    // this.OpenAssetSelector();
  }

  PrintRecordEvent(args: any) {
    console.log('PrintRecordEvent', args, 'Current row:', this.currentRow);
    this.dataSource.SelectAsset().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
