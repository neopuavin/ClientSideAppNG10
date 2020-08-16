import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ApiCommonModule } from './cmp/api-common/api-common.module';
import { MaterialModule } from './../material.module';
import { AppInputAModule } from './cmp/app-input-a/app-input-a.module';

import { DatePickerAComponent } from './cmp/date-picker-a/date-picker-a.component';
import { TreeViewComponent } from './cmp/tree-view/tree-view.component';
import { DataGridComponent } from './cmp/data-grid/data-grid.component';
import { RiskMatrixComponent } from './cmp/risk-matrix/risk-matrix.component';
import { DataTabsComponent } from './cmp/data-tabs/data-tabs.component';
import { PanelAComponent } from './cmp/panel-a/panel-a.component';
import { AppFormAComponent } from './cmp/app-form-a/app-form-a.component';
import { FormHeaderComponent } from './cmp/form-header/form-header.component';

const declare = [
  AppFormAComponent,
  PanelAComponent,
  DataTabsComponent,
  RiskMatrixComponent,
  DatePickerAComponent,
  DataGridComponent,
  TreeViewComponent,
  FormHeaderComponent,
];

@NgModule({
  declarations: declare,
  exports: [declare, ApiCommonModule, AppInputAModule],
  imports: [CommonModule, ApiCommonModule, AppInputAModule, MaterialModule, ReactiveFormsModule],
})
export class APIModule {}
