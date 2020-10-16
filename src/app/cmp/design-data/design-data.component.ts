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

    this.ds.SetLookupData(
      [
        { filterValue: 109 },
        { filterValue: 110 },
        { tableCode: 'desprm' }, // Design Data Parameter Table
      ],
      () => {
        this.DesignDataLookup(109);
        this.DesignDataLookup(110);
        this.DesignDataLookup('desprm');
        //setTimeout(()=>{console.log('desprm lookup: ', this.DesignDataLookup('desprm'))},100);
        

      }
    );

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
        align: CellTextAlign.CENTER
      })
      .AddColumn({
        minWidth: minLong,
        fieldName: 'DD_ASSET',
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
        lookupParams: {
          inlineLookupTableAlias: 'dpType',
          inlineLookupTableField: 'LKP_DESC_B',
          inlineLookupFieldAlias: 'parType',
        },


      })
      .AddColumn({
        fieldName: 'DD_PARAM_VALUE',
        width: 100,
        //caption: 'Param Value',
      })
      .AddColumn({
        fieldName: 'DD_PARAM_UNIT',
        width: 100,
        //caption: 'Units',
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
        //caption: 'Notes',
      })
      .AddColumn({
        fieldName: 'DD_PARAM_REF',
        width: 150,
        //caption: 'References',
      })


      .AddRequiredDataFields(['DD_ID', 'DD_ASSET'])


      // .From(this.sourceTable.tableCode)
      .LeftJoin({ code: 'node', alias: 'alkp', localField: 'DD_ASSET' })
      //.InnerJoin({ code: 'tre', localField: 'DD_ASSET', foreignField: 'TRE_DAT_TAG' })
      .LeftJoin({
        code: 'lkp',
        alias: 'ulkp',
        localField: 'DD_PARAM_UNIT',
      })
    
    

    .LeftJoin({
      code: 'desprm',
      localField: 'DD_PARAM',
      alias: 'dpType2',
      leftJoin:
        {code: 'lkp',
        localField: 'DD_PARAM_TYPE',
        alias: 'dpType'}
      
  
    })

    // LeftJoin({
    //   code: 'lkp',
    //   localField: 'dpType2.DD_PARAM_TYPE',
    //   alias: 'dpType',
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
    else if (lkpKey == 'desprm')
      // get formatted lookup for specific type where field mapping info is
      // specified as parameter in the GetLookupItems function
      ret = this.ds.GetLookupItems(key, {
        key: 'DD_PARAM',
        text: 'DD_PARAM_NAME',
        code: 'DD_PARAM_CODE',
      });
    else if (lkpKey == 'node')
      // get formatted lookup for specific type where field mapping info is
      // specified as parameter in the GetLookupItems function
      ret = this.ds.GetLookupItems(key, {
        key: 'DD_ASSET',
        text: 'DD_PARAM_NAME',
        code: 'DD_PARAM_CODE',
      });
    if (ret.length) this._DesignDataLookup[lkpKey] = ret;

    return [];
  }

  public DesignDataNameLookup() {
    let ret: Array<any> = this.DesignDataLookup('desprm');
    return ret;
  }

  public DesignDataAssetLookup() {
    let ret: Array<any> = this.DesignDataLookup('node');
    return ret;
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
        'Please select an asset where new data will be raised.',
        { height: 170 }
      );
      return;
    }

    const row = this.ds.tblDesignData.Add();

    const form: FormGroup = this.GetRowFormObject(true);
    const node = this.treeView.currNode;

    // initialize blank form with default values
    form.get('DD_ID').setValue(-1);
    form.get('DD_ASSET').setValue(node.did);
    form.get('DD_PARAM_REF').setValue('<New Reference>');
    form.get('DD_PARAM_NOTES').setValue('<New Notes>');
    form.get('DD_PARAM_NOTES').setValue('<New Parameter Value>');
    form.get('DD_PARAM_UNIT').setValue(1543);
    form.get('DD_PARAM').setValue(1);// for ADM - Allowable Bending Moment IMSA_TBL_DESIGN_DATA_PARAMS


    for (const fieldName in form.controls)
      row[fieldName] = form.get(fieldName).value;

    row.XTRA.assetLookup = [
      { code: node.code, key: node.did, location: node.loc, text: node.text },
    ];

    this.dataSource
      .OpenPopup('addEditDesigndata', 770, 330, true, {
        row: row,

        // Define a blank form object
        formObject: form,
        //
        riskMatrixData: this.ds.riskMatrixData,
        // set AnomalyComponent as the parent component reference
        parent: this,
        // Dialog title
        title: 'Add New Design Data',
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
        'Please select a record to edit'
      );
      return;
    }

    this.dataSource
      .OpenPopup('addEditDesigndata', 770, 330, true, {
        row: this.currentRow,

        // use common form object from the FormCommon base class
        //formObject: this.mainFormObject,
        formObject: this.GetRowFormObject(),
        //
        // set AnomalyComponent as the parent component reference
        parent: this,
        // Dialog title
        title: 'Edit Design Data',
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
          (row ? ` of Design Data Parameter value${row['DD_PARAM_VALUE']}` : ''),
        msgWarning: `You are about to delete the currently selected design data record.<br/><br/>Do you want to continue?`,
        msgSuccess: `Design Data Parameter value${row['DD_PARAM_VALUE']} was successfully deleted`
      },
    });
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

