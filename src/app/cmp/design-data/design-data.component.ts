import { AppMainServiceService } from './../../svc/app-main-service.service';
import { TblDesignDataRow } from './../../svc/app.tables';
import { FormCommon } from './../form.common';
import { Component, OnInit } from '@angular/core';
import { CellTextAlign } from 'src/app/api/cmp/data-grid/data-grid.component';

@Component({
  selector: 'app-design-data',
  templateUrl: './design-data.component.html',
  styleUrls: ['./design-data.component.scss'],
})
export class DesignDataComponent extends FormCommon implements OnInit {

  public currRow:TblDesignDataRow=null;
  constructor(public dataSource:AppMainServiceService) {
    super(dataSource);
  }

  ngOnInit(): void {
    // Setup grid

    this.mainGridOptions
      .RowHeight(22)
      .AddColumn({
        fieldName: 'DD_ID',
        width: 50,
        caption: 'ID',
        align: CellTextAlign.CENTER,
      })
      .AddField('DD_ID')
      .AddField('DD_ASSET_ID')
      .From(this.sourceTable.tableCode)
      .InnerJoin({code:'tre',localField:'DD_ASSET',foreignField:'TRE_DAT_TAG'})
      .LeftJoin({ code: 'lkp', localField: 'DD_PARAM_UNIT' })
      .LeftJoin({ code: 'node', localField: 'DD_ASSET' })
      .LeftJoin({
        code: 'desprm',
        localField: 'DD_PARAM',
        leftJoin: { code: 'lkp', alias: 'type', localField: 'DD_PARAM_TYPE' },
      }).Equal({fieldName:"FIELD_NAME"},"1").In({fieldName:"FIELD_NAME"},[1,2,3,4])

      console.log("AFTER JOINS !!!");

      const fromExpr = this.mainGridOptions.fromClauseCode;
      console.log("INSIDE fromClauseCode",fromExpr,"EEEE");
      console.log("AFTER fromClauseCode !!!");

    /*
      desdat|-tre,DD_ASSET,DD_TRE_DAT_TAG;
            `lkp,DD_PARAM_UNIT;
            `node,DD_ASSET;
            `desprm,DD_PARAM`lkp@unit,DD_PARAM_TYPE
      */

    this.mainGridOptions.debugString.forEach((s) => this.ds.AddDebugTrace(s));

    // setup tab
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
}
