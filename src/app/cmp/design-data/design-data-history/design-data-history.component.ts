import { AppMainServiceService } from '../../../svc/app-main-service.service';
import { TblDesignDataRow } from '../../../svc/app.tables';
import { DataOption, ILookupItem } from '../../../api/mod/app-common.classes';
import { FormCommon } from '../../form.common';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { CellTextAlign } from 'src/app/api/cmp/data-grid/data-grid.component';


import { DesignDataComponent } from './../design-data.component';

import { DesignDataCommon } from '../design-data.common';

@Component({
  selector: 'app-design-data-history',
  templateUrl: './design-data-history.component.html',
  styleUrls: ['./design-data-history.component.scss']
})
export class DesignDataHistoryComponent 
extends FormCommon
 implements OnInit, AfterViewInit {
   constructor(public dataSource: AppMainServiceService) {
     super(dataSource);
     console.log('module data:', this.moduleData);
   }

 ngOnInit(): void {
   

   // Set Common Data Settings

   this.ds.SetLookupData(
    [
      { filterValue: 110 },
      { tableCode: 'desprm' }, // Design Data Params
      // { filterValue: 156 }, // Survey Data Class
      // { filterValue: 157 }, // Chem Data Class
      // { filterValue: 253 }, // Compliance Module Status Color
    ],
    () => {
      // call all Anomaly Lookup formating methods
      this.kpbLookup(110);

      
    }
  );
   //this.CommonFormInit();

   // Call data grid option setup on success of getting all lookup dependencies
   this.SetupGridColumns();

     
 }


 SetupGridColumns() {

   this.mainGridOptions
     .RowHeight(22)
     //.SetKeyColumnName('DD_ID')

     .AddColumn({
       fieldName: 'DD_ID',
       width: 50,
       caption: 'ID',
       align: CellTextAlign.CENTER,
       isKey: true,
     })
     .AddColumn({
       width: 350,
       align: CellTextAlign.CENTER,
       fieldName: 'DD_ASSET',
       caption: 'Asset',
       // lookupParams: {
       //   inlineLookupTableAlias: 'alkp',
       //   inlineLookupTableField: 'NODE_DESC',
       //   inlineLookupFieldAlias: 'Asset',
       // },
       
       
     })
     .AddColumn({
       fieldName: 'DD_PARAM',
       width: 100,
       caption: 'Param Type',
       align: CellTextAlign.CENTER,
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
       // lookupParams: {
       //   inlineLookupTableAlias: 'lkp',
       //   inlineLookupTableField: 'LKP_DESC_B',
       //   inlineLookupFieldAlias: 'parunit',
       // },
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

     .AddRequiredDataFields(['DD_ID', 'DD_ASSET'])
      

      .AddField('DD_ID')
      
      .AddField('DD_ASSET')
      .AddField('DD_PARAM')
      .AddField('DD_PARAM_VALUE')
      .AddField('DD_PARAM_UNIT')
      .AddField('DD_PARAM_NOTES')
      .AddField('DD_PARAM_REF')
      
      // .AddFieldWithOptions({
      //   fieldName: 'DD_ASSET',
      //   displayField: 'Asset',
      // })
      // //.LeftJoin({ code: 'node', localField: 'DD_ASSET' })
      // .AddFieldWithOptions({
      //   fieldName: 'NODE_DESC',
      //   fieldAlias: 'Asset',
      //   tableAlias: 'alkp',
      // })
      

      .From(this.sourceTable.tableCode)
      .LeftJoin({ code: 'node', alias:'alkp', localField: 'DD_ASSET' })
      .InnerJoin({code:'tre',localField:'DD_ASSET',foreignField:'TRE_DAT_TAG'})
      .LeftJoin({
        code: 'lkp',
        alias: 'parunit',
        localField: 'DD_PARAM_UNIT',
      })
      .LeftJoin({
        code: 'desprm',
        alias: 'parName',
        localField: 'DD_PARAM',
      })
     

   this.mainGridOptions.debugString.forEach((s) => this.ds.AddDebugTrace(s));

 }

 private _kpbLookup: any = {};
 kpbLookup(key: any): Array<any> {
   let lkpKey: string = key;
   const isCommonLookup = !isNaN(+key);

   if (isCommonLookup) lkpKey = 'lkp' + key;
   if (this._kpbLookup[lkpKey])
     return this._kpbLookup[lkpKey];

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
   if (ret.length) this._kpbLookup[lkpKey] = ret;

   return [];
 }

 ngAfterViewInit(): void {
   
 }

 GridRowClickLocal(data: any) {
   
 }

 /********************************* action button events ******************************************/
 AddRecordEvent(args: any) {

   
 }

 EditRecordEvent(args: any) {
   
 }

 DeleteRecordEventLocal(args: any) {
   
 }

 DeleteSelectedRecord() {
   console.log('Execute delete');
 }

 PrintRecordEvent(args: any) {
   
 }

 SearchEvent(args: any) {
   
 }

 SendToExcelEvent(args: any) {
   
 }
}
