import { DataOption, ILookupItem } from './../../api/mod/app-common.classes';
import { AppMainServiceService } from './../../svc/app-main-service.service';
import { FormCommon } from './../form.common';
import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-anomaly',
  templateUrl: './anomaly.component.html',
  styleUrls: ['./anomaly.component.scss', '../form.common.scss'],
})
export class AnomalyComponent
  extends FormCommon
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
        { filterValue: 190 }, // SAP Status
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
        this.AnomalyLookup(190);
        this.AnomalyLookup('antype');
        this.ds.riskMatrixData;
      }
    );

    // Set Common Data Settings
    this.CommonFormInit();

    this.SetupGridColumns();

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

    const colorParams = {
      foreGround: { 8470: '#fff', 8471: '#000', 8472: '#fff' },
      backGround: { 8470: '#28a745', 8471: '#ffc107', 8472: '#dc3545' },
    };

    // Setup grid
    this.mainGridOptions
      // Data grid UI definition *****************************************
      .RowHeight(22)

      // Set key column name
      .SetKeyColumnName('AN_ID')

      // add data grid columns *****************************************
      .AddColumn({
        fieldName: 'AN_ID',
        width: wd2,
        caption: 'ID',
        align: center,
        isKey: true,
      })
      .AddColumn({
        fieldName: 'AN_REF',
        width: wd3,
        caption: 'Ref.No.',
        align: center,
      })
      .AddColumn({
        fieldName: 'AN_REVNO',
        width: wd1,
        caption: 'Rev#',
        align: center,
      })
      .AddColumn({ fieldName: 'AN_TITLE', caption: 'Title', minWidth: minLong })
      .AddColumn({
        fieldName: 'AN_ATTACHMENTS',
        caption: 'Att#',
        width: wd1,
        align: center,
        noZero: true,
      })
      // still to formulate how to link anomaly table to  anomaly action records
      //.AddColumn({ fieldName: 'AI_TARGET_DATE',caption:'Action Date',width: 80,align:center })
      .AddColumn({
        fieldName: 'AN_DESC',
        caption: 'Description',
        minWidth: minMemo,
      })
      .AddColumn({
        fieldName: 'AN_MAINT_REQ',
        caption: 'Ma.Req.',
        width: wd4,
        align: center,
        lookupParams: {
          inlineLookupFieldAlias: 'MAREQ',
          inlineLookupTableAlias: 'mareq',
          inlineLookupTableField: 'LKP_DESC_B',
        },
      })
      .AddColumn({
        fieldName: 'AN_ACT_PARTY',
        caption: 'Action Party',
        minWidth: minShort,
      })

      .AddColumn({
        fieldName: 'AN_ASSET_ID',
        minWidth: minLong,
        lookupParams: {
          inlineLookupTableAlias: 'alkp',
          inlineLookupTableField: 'NODE_DESC',
          inlineLookupFieldAlias: 'ASSETNAME',
        },
      })
      .AddColumn({
        fieldName: 'AN_STATUS',
        width: wd3,
        caption: 'Status',
        align: center,
        lookupParams: {
          inlineLookupFieldAlias: 'STATUS',
          inlineLookupTableAlias: 'stat',
          inlineLookupTableField: 'LKP_DESC_B',
        },
      })
      .AddColumn({
        fieldName: 'AN_WO_REF',
        caption: 'SAP#',
        width: wd4,
      })
      .AddColumn({
        fieldName: 'AN_WO_STATUS',
        caption: 'SAP Status',
        width: wd5,
        lookupParams: {
          inlineLookupTableField: 'LKP_DESC_B',
          inlineLookupTableAlias: 'sapstat',
          inlineLookupFieldAlias: 'SAPSTAT',
        },
      })
      .AddColumn({
        fieldName: 'AN_ASIS',
        caption: 'OTR',
        width: wd1,
        align: center,
        lookupParams: { toggleDisplay: this.ds.toggleYesNoNA },
      })

      .AddColumn({
        fieldName: 'AN_ASSMNT',
        caption: 'Assessment',
        minWidth: minMemo,
      })
      .AddColumn({
        fieldName: 'AN_ASS_BY',
        caption: 'Assessed By',
        width: wd5,
      })
      .AddColumn({
        fieldName: 'AN_ASS_DATE',
        caption: 'Assessed Date',
        width: wd5,
        dateFormat: 'default',
      })
      .AddColumn({
        fieldName: 'AN_DATE_IDENT',
        caption: 'Date Identified',
        width: wd5,
        dateFormat: 'default',
      })

      .AddColumn({
        fieldName: 'AN_RAISED_BY',
        caption: 'Raised By',
        width: wd5,
      })
      .AddColumn({
        fieldName: 'AN_RAISED_DATE',
        caption: 'Raised Date',
        width: wd5,
        dateFormat: 'default',
      })
      .AddColumn({
        fieldName: 'AN_UPD_BY',
        caption: 'Updated By',
        width: wd5,
      })
      .AddColumn({
        fieldName: 'AN_UPD_DATE',
        caption: 'Updated Date',
        width: wd5,
        dateFormat: 'default',
      })
      .AddColumn({
        fieldName: 'AN_RECCMD',
        caption: 'Recommendation',
        minWidth: minMemo,
      })
      .AddColumn({
        fieldName: 'AN_TA_APPROVED',
        caption: 'TA Approved',
        width: wd1,
        align: center,
        lookupParams: { toggleDisplay: this.ds.toggleYesNoNA },
      })
      .AddColumn({
        fieldName: 'AN_TA_NAME',
        caption: 'TA Name',
        width: wd5,
      })
      .AddColumn({
        fieldName: 'AN_TA_APPR_DATE',
        caption: 'TA Approve Date',
        width: wd5,
        dateFormat: 'default',
      })

      .AddColumn({
        fieldName: 'AN_ORIG_CLASS',
        width: wd3,
        align: center,
        colorParams: colorParams,
        lookupParams: {
          inlineLookupFieldAlias: 'OCLASS',
          inlineLookupTableAlias: 'ocls',
          inlineLookupTableField: 'LKP_DESC_B',
        },
      })
      .AddColumn({
        fieldName: 'AN_CURR_CLASS',
        width: wd3,
        align: center,
        colorParams: colorParams,
        lookupParams: {
          inlineLookupFieldAlias: 'CCLASS',
          inlineLookupTableAlias: 'ccls',
          inlineLookupTableField: 'LKP_DESC_B',
        },
      })

      .AddColumn({
        fieldName: 'AN_ORIG_AVAIL_CLASS',
        width: wd3,
        align: center,
        caption: 'Orig.Avail.',
        colorParams: colorParams,
        lookupParams: {
          inlineLookupFieldAlias: 'OACLASS',
          inlineLookupTableAlias: 'oacls',
          inlineLookupTableField: 'LKP_DESC_B',
        },
      })
      .AddColumn({
        fieldName: 'AN_CURR_AVAIL_CLASS',
        width: wd3,
        align: center,
        caption: 'Curr.Avail.',
        colorParams: colorParams,
        lookupParams: {
          inlineLookupFieldAlias: 'CACLASS',
          inlineLookupTableAlias: 'cacls',
          inlineLookupTableField: 'LKP_DESC_B',
        },
      })

      // set mandatory field(s) needed to be extracted from the database
      // even if the grid column(s)'s visibility mode is set to hidden
      .AddRequiredDataFields(['AN_ID', 'AN_ASSET_ID'])

      // show only selected fields to display
      .ShowColumns([
        'AN_ID',
        'AN_REF',
        'AN_REVNO',
        'AN_TITLE',
        'AN_DESC',
        'AN_STATUS',
        'AN_ORIG_CLASS',
        'AN_CURR_CLASS',
        'AN_ORIG_AVAIL_CLASS',
        'AN_CURR_AVAIL_CLASS',
        'AN_DATE_IDENT',
        'AN_RAISED_DATE',
        'AN_RAISED_BY',
      ])
      // .HideColumns(['AN_ID'])

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
        alias: 'oacls',
        localField: 'AN_ORIG_AVAIL_CLASS',
      })
      .LeftJoin({
        code: 'lkp',
        alias: 'cacls',
        localField: 'AN_CURR_AVAIL_CLASS',
      })
      .LeftJoin({
        code: 'lkp',
        alias: 'stat',
        localField: 'AN_STATUS',
      })
      .LeftJoin({
        code: 'lkp',
        alias: 'mareq',
        localField: 'AN_MAINT_REQ',
      })
      .LeftJoin({
        code: 'lkp',
        alias: 'sapstat',
        localField: 'AN_WO_STATUS',
      });

    console.log(
      '\nselect:',
      this.mainGridOptions.FieldList,
      '\nfrom:',
      this.mainGridOptions.fromClauseCode,
      '\nwhere:',
      this.mainGridOptions.whereClause
    );
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

    if (!this.currentRow) {
      // prompt to select a record if currentRow is null
      this.dataSource.Confirm("No current record",
      "Please select an Anomaly record to edit");
      return;
    }

    this.dataSource
      .OpenPopup('addEditAnomaly', 870, 455, true, {
        row: this.currentRow,

        // create single item asset lookup to display asset as a read-only select field
        assetLookup: [
          {
            key: this.currentRow.AN_ASSET_ID,
            code: this.currentRow.XTRA.NODE_ID,
            text: this.currentRow.XTRA.NODE_DESC,
            location: this.currentRow.XTRA.TRE_NOD_LOC,
          },
        ],
        // use common form object from the FormCommon base class
        //formObject: this.mainFormObject,
        formObject: this.GetRowFormObject(),
        //
        riskMatrixData: this.ds.riskMatrixData,
        // set AnomalyComponent as the parent component reference
        parent: this,
        // Dialog title
        title: 'Edit Anomaly',
        // dialog title icon
        icon: 'fa-edit',
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

  DeleteRecordEvent(args: any) {
    console.log('DeleteRecordEvent', args, 'Current row:', this.currentRow);
    // this.OpenAssetSelector();
  }

  PrintRecordEvent(args: any) {
    console.log('PrintRecordEvent', args, 'Current row:', this.currentRow);
    this.dataSource.SelectAsset().subscribe((result) => {
      console.log('Dialog result:', result);
    });
  }

  SearchEvent(args: any) {
    this.dataSource.OpenPopup('alert', 550, 200, false, {
      title: 'Feature not available',
      icon: 'fa-exclamation-circle',
      message: 'Sorry. Search function is not yet available.',
      buttons: [
        {
          label: 'Close',
          value: 'close',
          class: 'btn btn-sm btn-warning',
        },
      ],
    });
  }

  SendToExcelEvent(args: any) {
    this.dataSource.OpenPopup('alert', 550, 200, false, {
      title: 'Feature not available',
      icon: 'fa-exclamation-circle',
      message: 'Sorry. Send to excel funtion is not yet available.',
      buttons: [
        {
          label: 'Close',
          value: 'close',
          class: 'btn btn-sm btn-warning',
        },
      ],
    });
  }
}
