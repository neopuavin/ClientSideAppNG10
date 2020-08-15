import { AppMainServiceService } from './../../svc/app-main-service.service';
import { FormCommon } from './../form.common';
import { Component, OnInit } from '@angular/core';
import { CellTextAlign } from 'src/app/api/cmp/data-grid/data-grid.component';

@Component({
  selector: 'app-survey-data',
  templateUrl: './survey-data.component.html',
  styleUrls: ['./survey-data.component.scss'],
})
export class SurveyDataComponent extends FormCommon implements OnInit {
  constructor(public dataSource: AppMainServiceService) {
    super(dataSource);
  }

  ngOnInit(): void {
    this.mainGridOptions
      .RowHeight(22)
      .AddColumn({
        fieldName: 'SVY_HDR_ID',
        width: 50,
        align: CellTextAlign.CENTER,
      })
      .AddColumn({
        fieldName: 'SVY_HDR_MAIN_ID',
        minWidth: 100,
        maxWidth: 150,
        caption: 'Campaign',
        lookupParams: {
          table: this.ds.tblSurvey,
          displayField: 'SVY_MAIN_TITLE',
        },
      })
      .AddColumn({
        fieldName: 'SVY_HDR_NOD_ID',
        minWidth: 150,
        lookupParams: {
          table: this.ds.tblNodesAttrib,
          displayField: 'NODE_DESC',
        },
      })
      .AddColumn({
        fieldName: 'SVY_HDR_EVT_ID',
        width: 80,
        align: CellTextAlign.CENTER,
        lookupParams: {
          table: this.ds.tblSurveyEvent,
          displayField: 'SVY_EVT_DESC',
        },
      })
      .AddColumn({
        fieldName: 'SVY_HDR_EVT_NUM',
        width: 65,
        align: CellTextAlign.CENTER,
      })
      // .AddColumn({
      //   fieldName: 'SVY_HDR_START_POS_ID',
      //   width: 130,
      //   caption:'Start',
      //   align: CellTextAlign.CENTER,
      //   lookupParams: {
      //     table: this.ds.tblSurveyPosition,
      //     displayField: 'SVY_POS_DATE_TIME',
      //   },
      // })
      // .AddColumn({
      //   fieldName: 'SVY_HDR_END_POS_ID',
      //   width: 130,
      //   caption:'End',
      //   align: CellTextAlign.CENTER,
      //   lookupParams: {
      //     table: this.ds.tblSurveyPosition,
      //     displayField: 'SVY_POS_DATE_TIME',
      //   }
      // })
      .AddColumn({
        fieldName: 'SVY_HDR_ASS_DETAILS',
        minWidth: 200,
        maxWidth: 400,
        caption: 'Assessment',
      })

      //.From(this.ds.tblSurveyHeader.tableCode)
      // .LeftJoin({
      //   code:''
      // })
      .OrderBy([
        { fieldName: 'SVY_HDR_MAIN_ID', sortDescending: true },
        { fieldName: 'SVY_HDR_EVT_ID' },
      ]);

    //SVY_HDR_NOD_ID

    // Setup main tab configuration
    this.mainTabsOptions
      .AddTab({
        id: 1,
        label: 'General Information',
        icon: 'fa fa-info-circle',
        active: true,
      })
      .AddTab({
        id: 2,
        label: 'Position',
        active: true,
      })
      .AddTab({
        id: 3,
        label: 'Assessment',
        active: true,
      })
      .AddTab({
        id: 4,
        label: 'Failure Threats',
        active: true,
      })
      .AddTab({
        id: 5,
        label: 'Attachments',
        active: true,
      })
      .AddTab({
        id: 6,
        label: 'Related Survey Events',
        active: true,
      })
      .AddTab({
        id: 7,
        label: 'Related Anomalies',
        active: true,
      });
    //.AddTab({ id: 2, label: 'Linked Anomalies', icon: '', active: false });
  }
}
