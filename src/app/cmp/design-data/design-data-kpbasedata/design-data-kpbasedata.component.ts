
import { AppMainServiceService } from '../../../svc/app-main-service.service';
import { TblDesignDataRow } from '../../../svc/app.tables';
import { DataOption, ILookupItem } from '../../../api/mod/app-common.classes';
import { FormCommon } from '../../form.common';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';

import { DesignDataComponent } from './../design-data.component';

import { DesignDataCommon } from '../design-data.common';

@Component({
  selector: 'app-design-data-kpbasedata',
  templateUrl: './design-data-kpbasedata.component.html',
  styleUrls: ['./design-data-kpbasedata.component.scss']
})
export class DesignDataKpbasedataComponent
extends FormCommon
 implements OnInit, AfterViewInit {
   constructor(public dataSource: AppMainServiceService) {
     super(dataSource);
     console.log('module data:', this.moduleData);
   }

 ngOnInit(): void {
   
   //this.CommonFormInit();

   // Call data grid option setup on success of getting all lookup dependencies
   this.mainGridOptions
     .RowHeight(22)
     //.SetKeyColumnName('DD_ID')

     .AddColumn({
       fieldName: 'DD_ID',
       width: 50,
       caption: 'ID',
       isKey: true,
     })
     .AddColumn({
       width: 350,
       fieldName: 'DD_ASSET',
       caption: 'Asset',
       // lookupParams: {
       //   inlineLookupTableAlias: 'alkp',
       //   inlineLookupTableField: 'NODE_DESC',
       //   inlineLookupFieldAlias: 'Asset',
       // },
       
       
     })

     //.AddRequiredDataFields(['DD_ID', 'DD_ASSET'])
      

      .AddField('DD_ID')
      
      //.AddField('DD_ASSET')
      .AddFieldWithOptions({
        fieldName: 'DD_ASSET',
        displayField: 'Asset',
      })
      
      
      // //.LeftJoin({ code: 'node', localField: 'DD_ASSET' })
      // .AddFieldWithOptions({
      //   fieldName: 'NODE_DESC',
      //   fieldAlias: 'Asset',
      //   tableAlias: 'alkp',
      // })
      

      //.From(this.sourceTable.tableCode)
      .LeftJoin({ code: 'node', alias:'alkp', localField: 'DD_ASSET' })
      .InnerJoin({code:'tre',localField:'DD_ASSET',foreignField:'TRE_DAT_TAG'})
      
    

     
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
