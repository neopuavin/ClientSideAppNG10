import { AppMainServiceService } from './../../svc/app-main-service.service';
import { TblDesignDataRow } from './../../svc/app.tables';
import { DataOption, ILookupItem } from './../../api/mod/app-common.classes';
import { FormCommon } from './../form.common';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CellTextAlign } from 'src/app/api/cmp/data-grid/data-grid.component';
import { FilterDataType } from './../../api/mod/app-common.classes';

@Component({
  selector: 'app-design-data',
  templateUrl: './design-data.component.html',
  styleUrls: ['./design-data.component.scss'],
})
export class DesignDataComponent
  extends FormCommon
  implements OnInit, AfterViewInit {
  constructor(public dataSource: AppMainServiceService) {
    super(dataSource);
    console.log('module data:', this.moduleData);
  }

  ngOnInit(): void {

    if (!this.moduleParamsInitialized) {
      // Set Common Data Settings
      this.CommonFormInit();

      // Call data grid option setup on success of getting all lookup dependencies
      this.SetupGridColumns();

      // Setup details tab
      this.SetupDetailsTab();
    }

    // setup tab


  }

  SetupDetailsTab(){
    this.mainTabsOptions
      .AddTab({
        id: 1,
        label: 'General Information',
        icon: 'fa fa-info-circle',
        active: true,
      })
      .AddTab({
        id: 2,
        label: 'KP Based Data',
      })
      .AddTab({
        id: 3,
        label: 'Attachments',
      })
      .AddTab({
        id: 4,
        label: 'History',
      });

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

      .SetKeyColumnName('DD_ID')

      .AddColumn({
        fieldName: 'DD_ID',
        width: 50,
        caption: 'ID',
        align: CellTextAlign.CENTER
      })
      .AddColumn({
        minWidth: minLong,
        fieldName: 'DD_ASSET',
        caption: 'Asset',
        filterType: FilterDataType.ASSET,
        lookupParams: {
          inlineLookupTableAlias: 'alkp',
          inlineLookupTableField: 'NODE_DESC',
          inlineLookupFieldAlias: 'Asset',
        },


      })
      .AddColumn({
        fieldName: 'DD_PARAM',
        width: 100,
        caption: 'Param Type',
        align: CellTextAlign.CENTER,
        // filterType: FilterDataType.ASSET,
        // lookupParams: {
        //   inlineLookupTableAlias: 'desprm',
        //   inlineLookupTableField: 'DD_PARAM_NAME',
        //   inlineLookupFieldAlias: 'parName',
        // },


      })
      .AddColumn({
        fieldName: 'DD_PARAM_VALUE',
        width: 100,
        caption: 'Param Value',
        align: CellTextAlign.CENTER,
      })
      .AddColumn({
        fieldName: 'DD_PARAM_UNIT',
        width: 100,
        caption: 'Units',
        align: CellTextAlign.CENTER,
        lookupParams: {
          inlineLookupTableAlias: 'ulkp',
          inlineLookupTableField: 'LKP_DESC_B',
          inlineLookupFieldAlias: 'parunit',
        },
      })
      .AddColumn({
        fieldName: 'DD_PARAM_NOTES',
        width: 150,
        caption: 'Notes',
        align: CellTextAlign.CENTER,
      })
      .AddColumn({
        fieldName: 'DD_PARAM_REF',
        width: 150,
        caption: 'References',
        align: CellTextAlign.CENTER,
      })


      // .From(this.sourceTable.tableCode)
      .LeftJoin({ code: 'node', alias: 'alkp', localField: 'DD_ASSET' })
      //.InnerJoin({ code: 'tre', localField: 'DD_ASSET', foreignField: 'TRE_DAT_TAG' })
      .LeftJoin({
        code: 'lkp',
        alias: 'ulkp',
        localField: 'DD_PARAM_UNIT',
      })
    // .LeftJoin({
    //   code: 'desprm',
    //   alias: 'parName',
    //   localField: 'DD_PARAM',
    // })


    //.LeftJoin({
    //  code: 'desprm',
    //  localField: 'DD_PARAM',
    //  leftJoin: { code: 'lkp', alias: 'type', localField: 'DD_PARAM_TYPE' },
    //}).Equal({fieldName:"FIELD_NAME"},"1").In({fieldName:"FIELD_NAME"},[1,2,3,4])


    //.AddField('DD_ASSET_ID')


    console.log("AFTER JOINS !!!");

    const fromExpr = this.mainGridOptions.fromClauseCode;
    console.log("INSIDE fromClauseCode", fromExpr, "EEEE");
    console.log("AFTER fromClauseCode !!!");



    /*
      desdat|-tre,DD_ASSET,DD_TRE_DAT_TAG;
            `lkp,DD_PARAM_UNIT;
            `node,DD_ASSET;
            `desprm,DD_PARAM`lkp@unit,DD_PARAM_TYPE
      */

    this.mainGridOptions.debugString.forEach((s) => this.ds.AddDebugTrace(s));

  }

  private _DesignDataLookup: any = {};
  DesignDataLookup(key: any): Array<any> {
    let lkpKey: string = key;
    const isCommonLookup = !isNaN(+key);

    if (isCommonLookup) lkpKey = 'lkp' + key;
    if (this._DesignDataLookup[lkpKey])
      return this._DesignDataLookup[lkpKey];

    // desdata lookup not yet available
    let ret: Array<any> = [];
    if (isCommonLookup)
      // get formatted lookup common lookup type where field mapping info is
      // embedded in the GetLookupItems function
      ret = this.ds.GetLookupItems(key);
    else if (lkpKey == 'desdat')
      // get formatted lookup for specific type where field mapping info is
      // specified as parameter in the GetLookupItems function
      ret = this.ds.GetLookupItems(key, {
        key: 'DD_PARAM',
      });

    // only create entry of the lookup in the this._AnomalyLookup object
    // if elements are exiting, otherwise, subsequent call will
    // return empty array and will cause issues on UI rendering.
    if (ret.length) this._DesignDataLookup[lkpKey] = ret;

    return [];
  }

  ngAfterViewInit(): void {
    // console.log('ngOnInit INIT!');

    // try {
    //   let dato: DataOption = new DataOption();
    //   dato
    //     //  source table(s) code defintion
    //     .From('ft')
    //     .LeftJoin({
    //       code: 'lkp',
    //       localField: 'FT_GROUP',
    //       foreignField: 'LKP_ID',
    //       alias: 'grp',
    //     }) // foreign field is optional if the keyName of the child table is where the link is to be made
    //     .LeftJoin({
    //       code: 'lkp',
    //       localField: 'FT_TYPE',
    //       foreignField: 'LKP_ID',
    //       alias: 'typ',
    //     })

    //     // included field definition
    //     .AddField('FT_ID')
    //     .AddField('FT_CODE')
    //     .AddField('FT_NAME')

    //     .AddFieldWithOptions({ fieldName: 'FT_GROUP', displayField: 'FTG' })
    //     .AddFieldWithOptions({ fieldName: 'FT_TYPE', displayField: 'FTT' })
    //     .AddField('FT_CORR_REL')

    //     // inline lookup definitions
    //     .AddFieldWithOptions({
    //       fieldName: 'LKP_DESC_B',
    //       fieldAlias: 'FTG',
    //       tableAlias: 'grp',
    //     })
    //     .AddFieldWithOptions({
    //       fieldName: 'LKP_DESC_B',
    //       fieldAlias: 'FTT',
    //       tableAlias: 'typ',
    //     })

    //     // linked table filtering
    //     .LeftLinkedTo('an', [841, 734])

    //     // where condition codes
    //     .Equal({ fieldName: 'FT_GROUP' }, 8707);
    // } catch (e) {
    //   console.log('ERROR in ngAfterViewInit:', e.message);
    // }
  }

  GridRowClickLocal(data: any) {
    // redefinition of GridRowClickLocal
    // const row = this.currentRow;
    // this.mainTabsOptions.tabs[0].toolTip = row
    //   ? `[Ref#:${row.AN_REF}] ${row.AN_TITLE}`
    //   : null;

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
        'Please select an Design Data record to edit'
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
        msgSuccess: `Anomaly Ref#${row['AN_REF']} was successfully deleted`
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

