import { PhBox1Component } from './ph/ph-box1/ph-box1.component';
import { AlertComponent } from './alert/alert.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const declare = [AlertComponent, PhBox1Component];

@NgModule({
  declarations: declare,
  exports: declare,
  imports: [CommonModule],
})
export class ApiCommonModule {}
