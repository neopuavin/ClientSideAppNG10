import { PhBox1Component } from './cmp/ph/ph-box1/ph-box1.component';
import { DataTabsComponent } from './cmp/data-tabs/data-tabs.component';
import { PanelAComponent } from './cmp/panel-a/panel-a.component';
import { AppFormAComponent } from './cmp/app-form-a/app-form-a.component';
import { AlertComponent } from './cmp/alert/alert.component';
// import { AppInputAComponent } from './cmp/app-input-a/app-input-a.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const declare = [AlertComponent, AppFormAComponent, PanelAComponent,DataTabsComponent,PhBox1Component];
// const declare = [AppInputAComponent]

@NgModule({
  declarations: declare,
  exports: declare,
  imports: [CommonModule],
})
export class APIModule {}
