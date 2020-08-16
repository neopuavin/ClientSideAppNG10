import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './../material.module';

import { DatePickerAComponent } from './cmp/date-picker-a/date-picker-a.component';
import { TreeViewComponent } from './cmp/tree-view/tree-view.component';
import { DataGridComponent } from './cmp/data-grid/data-grid.component';
import { PhBox1Component } from './cmp/ph/ph-box1/ph-box1.component';
import { PhBox2Component } from './cmp/ph/ph-box2/ph-box2.component';
import { RiskMatrixComponent } from './cmp/risk-matrix/risk-matrix.component';
import { DataTabsComponent } from './cmp/data-tabs/data-tabs.component';
import { PanelAComponent } from './cmp/panel-a/panel-a.component';
import { AppFormAComponent } from './cmp/app-form-a/app-form-a.component';
import { AlertComponent } from './cmp/alert/alert.component';
import { AppInputAComponent } from './cmp/app-input-a/app-input-a.component';
import { FormHeaderComponent } from './cmp/form-header/form-header.component';

const declare = [
  AlertComponent,
  AppFormAComponent,
  PanelAComponent,
  DataTabsComponent,
  AppInputAComponent,
  RiskMatrixComponent,
  PhBox1Component,
  PhBox2Component,
  DatePickerAComponent,
  DataGridComponent,
  TreeViewComponent,
  FormHeaderComponent
];

@NgModule({
  declarations: declare,
  exports: declare,
  imports: [CommonModule,MaterialModule,ReactiveFormsModule],
})
export class APIModule {}
