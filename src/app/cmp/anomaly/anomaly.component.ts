import { DataGridColum } from './../../api/cmp/data-grid/data-grid.component';
import {
  DataOption,
  IFilterOperator,
  FilterDataType,
} from './../../api/mod/app-common.classes';
import { AppMainServiceService } from './../../svc/app-main-service.service';
import { FormCommon } from './../form.common';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
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

        // assign required lookups to mainDataGrid
        if (this.ds.riskMatrixData) {
          // late lookup binding to grid column
          const riskColumn: DataGridColum = this.mainGridOptions.columns.find(
            (c) => c.fieldKey == 'RISK'
          );
          if (riskColumn) {
            // bind value lookup object
            const mtx = this.ds.riskMatrixData.mtx;
            riskColumn.lookupParams.lookupSource = mtx;
            /**
             * from ...
             * {
             *  key1:{code:string, fore:string, back:string},
             *  key2:{code:string, fore:string, back:string},
             *  key#:{code:string, fore:string, back:string}
             * }
             * to ...
             * {
             *  foreGround: { code1: fore1, code2: fore2, code#: fore# },
             *  backGround: { code1: back1, code2: back2, code#: back# }
             * }
             */
            let fore: any = {};
            let back: any = {};
            for (let key in mtx) {
              const item = mtx[key];
              fore[item.code] = item.fore;
              back[item.code] = item.back;
            }
            riskColumn.colorParams = { foreGround: fore, backGround: back };
            console.log('color params:', riskColumn.colorParams);
          }
        }
      }
    );

    // the next method calls must be executed within the ngOnInit lifecycle because
    // objects generated are needed in the template rendering.

    // Set Common Data Settings
    this.CommonFormInit();

    // Call data grid option setup on success of getting all lookup dependencies
    this.SetupGridColumns();

    // Setup details tab
    this.SetupDetailsTab();
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
        allowFilter: false,
        sortAsc: true,
        // filters:[1],
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
        filterType:FilterDataType.ASSET,
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
        //sortAsc:true,
        sortDesc:true,
        filters: [1],
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
      .AddColumn({
        fieldAlias: 'RISK',

        filterType:FilterDataType.MATRIX,
        matrixData:this.ds.riskMatrixData,
        matrixSeverity:'AN_RISK_RANK_SEVERITY',
        matrixLikelihood:'AN_RISK_RANK_LIKELIHOOD',

        value: 'M{AN_RISK_RANK_SEVERITY}{AN_RISK_RANK_LIKELIHOOD}',
        width: wd2,
        align: center,
        caption: 'Risk',
        colorParams: null,
        lookupParams: {
          lookupSource: null, // this will later be replaced with this.ds.riskMatrixData.mtx onSuccess of lookup retreival
          lookupDisplayField: 'code',
          lookupValueField: 'object',
        },
        displayFormat: '',
      })
      .AddColumn({
        fieldName: 'AN_RISK_RANK_SEVERITY',
        fieldAlias: 'SEVERITY',
        width: wd3,
        align: center,
        caption: 'Severity',
        lookupParams: {
          inlineLookupFieldAlias: 'SEV',
          inlineLookupTableAlias: 'risksev',
          inlineLookupTableField: 'LKP_DESC_A',
        },
      })
      .AddColumn({
        fieldName: 'AN_RISK_RANK_LIKELIHOOD',
        fieldAlias: 'LIKELIHOOD',
        width: wd3,
        align: center,
        caption: 'Likelihood',
        lookupParams: {
          inlineLookupFieldAlias: 'LIK',
          inlineLookupTableAlias: 'risklik',
          inlineLookupTableField: 'LKP_DESC_A',
        },
      })

      // set mandatory field(s) needed to be extracted from the database
      // even if the grid column(s)'s visibility mode is set to hidden
      .AddRequiredDataFields(['AN_ID', 'AN_ASSET_ID'])

      // show only selected fields to display
      .ShowColumns([
        'AN_ID',
        'AN_ASSET_ID',
        'AN_REF',
        'AN_REVNO',
        'AN_TITLE',
        'AN_DESC',
        'AN_STATUS',
        'AN_ORIG_CLASS',
        'AN_CURR_CLASS',
        'AN_ORIG_AVAIL_CLASS',
        'AN_CURR_AVAIL_CLASS',
        'RISK',
        // 'SEVERITY',
        // 'LIKELIHOOD',
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
      })
      .LeftJoin({
        code: 'lkp',
        alias: 'risksev',
        localField: 'AN_RISK_RANK_SEVERITY',
      })
      .LeftJoin({
        code: 'lkp',
        alias: 'risklik',
        localField: 'AN_RISK_RANK_LIKELIHOOD',
      });

    console.log(
      '\nselect:',
      this.mainGridOptions.FieldList,
      '\nfrom:',
      this.mainGridOptions.fromClauseCode,
      '\nwhere:',
      this.mainGridOptions.whereClause
    );

    // reset column widths
    // this.mainGrid.resetColumnWidths();
  }

  SetupDetailsTab() {
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
      .AddTab({
        id: 8,
        label: 'Related Anomalies',
        icon: '',
        active: false,
      });
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
    if (!this.treeView.currNode) {
      // prompt to select a record if currentRow is null
      this.dataSource.Confirm(
        'No asset selected',
        'Please select an asset where new anomaly will be raised.',
        { height: 170 }
      );
      return;
    }

    const row = this.ds.tblAnomalies.Add();

    const form: FormGroup = this.GetRowFormObject(true);
    const node = this.treeView.currNode;

    // initialize blank form with default values
    form.get('AN_ID').setValue(-1);
    form.get('AN_REF').setValue('<New Anomaly>');
    form.get('AN_REVNO').setValue(0);
    form.get('AN_ASSET_ID').setValue(node.did);
    form.get('AN_ORIG_CLASS').setValue(8471);
    form.get('AN_CURR_CLASS').setValue(8471);
    form.get('AN_ORIG_AVAIL_CLASS').setValue(8471);
    form.get('AN_CURR_AVAIL_CLASS').setValue(8471);
    form.get('AN_ATTACHMENTS').setValue(0);
    form.get('AN_STATUS').setValue(8450);
    form.get('AN_FNCR_REQUIRED').setValue(0);
    form.get('AN_PORTFOLIO_APPL').setValue(0);
    form.get('AN_PT_SUPPORT').setValue(0);
    form.get('AN_ASIS').setValue(0);
    form.get('AN_EQ_FAILURE').setValue(0);
    form.get('AN_TA_APPROVED').setValue(0);
    form.get('AN_TA_APPROVED').setValue(0);
    form.get('AN_TYPE').setValue(58);

    for (const fieldName in form.controls)
      row[fieldName] = form.get(fieldName).value;

    row.XTRA.assetLookup = [
      { code: node.code, key: node.did, location: node.loc, text: node.text },
    ];

    this.dataSource
      .OpenPopup('addEditAnomaly', 870, 455, true, {
        row: row,

        // Define a blank form object
        formObject: form,
        //
        riskMatrixData: this.ds.riskMatrixData,
        // set AnomalyComponent as the parent component reference
        parent: this,
        // Dialog title
        title: 'Add New Anomaly',
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

  EditRecordEvent(args: any) {
    // override function

    if (!this.currentRow) {
      // prompt to select a record if currentRow is null
      this.dataSource.Confirm(
        'No current record',
        'Please select an Anomaly record to edit'
      );
      return;
    }

    this.dataSource
      .OpenPopup('addEditAnomaly', 870, 455, true, {
        row: this.currentRow,

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

  DeleteRecordEventLocal(args: any) {
    const row = this.currentRow;
    this.DeleteRecordEvent({
      row: this.currentRow,
      messages: {
        msgTitle:
          'Confirm record deletion' +
          (row ? ` of Anomaly Ref#${row['AN_REF']}` : ''),
        msgWarning: `You are about to delete the currently selected anomaly record.<br/><br/>Do you want to continue?`,
        msgSuccess: `Anomaly Ref#${row['AN_REF']} was successfully deleted`,
      },
      userStampFields: ['AN_DELETED_BY'],
      dateStampFields: ['AN_DELETED_DATE'],
    });
  }

  DeleteSelectedRecord() {
    console.log('Execute delete');
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
    //let yourDate = new Date('08/08/2019 12:22:48 PM UTC');
    let yourDate = new Date();
    let yourUTCDate = yourDate.toUTCString();
    let utcDate = new Date(
      yourDate.toLocaleDateString() +
        ' ' +
        yourDate.toLocaleTimeString() +
        ' UTC'
    );

    console.log('\nUTC yourDate.toString()', new Date(yourDate.toString()));
    console.log(
      '\nyourUTCDate',
      new Date(yourUTCDate),
      '\nRaw yourUTCDate:',
      yourUTCDate
    );

    console.log('\nutcDate()', utcDate.toString());
    console.log(
      '\nyourDate.toLocaleDateString()',
      yourDate.toLocaleDateString(),
      yourDate.toLocaleTimeString()
    );

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
