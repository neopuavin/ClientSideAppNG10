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
          table: this.ds.tblLookups,
          displayField: 'LKP_DESC_B',
          groupValue: 139,
          groupField: 'LKP_GRP_ID',
        },
      })
      .AddColumn({
        fieldName: 'RF_DESC',
        minWidth: 250,
      })
      .AddColumn({
        fieldName: 'RF_ASSET',
        minWidth: 150,
        lookupParams: {
          table: this.ds.tblNodesAttrib,
          displayField: 'NODE_DESC',
        },
      })
      .AddColumn({ fieldName: 'RF_FILENAME', minWidth: 150 });

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
      .AddTab({ id: 2, label: 'Linked Anomalies', icon: '', active: false });
  }

  ngAfterViewInit() {
    //
  }
}
