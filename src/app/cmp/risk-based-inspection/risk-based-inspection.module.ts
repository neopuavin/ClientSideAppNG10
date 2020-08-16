import { RiskBasedInspectionComponent } from './risk-based-inspection.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APIModule } from './../../api/api.module';

const declare = [RiskBasedInspectionComponent];

@NgModule({
  declarations: declare,
  exports: declare,
  imports: [CommonModule, APIModule],
})

export class RiskBasedInspectionModule { }
