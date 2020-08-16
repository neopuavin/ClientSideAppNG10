import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APIModule } from './../../api/api.module';
import { SurveyDataComponent } from './survey-data.component';

const declare = [SurveyDataComponent];

@NgModule({
  declarations: declare,
  exports: declare,
  imports: [CommonModule, APIModule],
})

export class SurveyDataModule { }
