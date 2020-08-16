import { SurveyUploadComponent } from './survey-upload.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APIModule } from './../../api/api.module';

const declare = [SurveyUploadComponent];

@NgModule({
  declarations: declare,
  exports: declare,
  imports: [CommonModule, APIModule],
})

export class SurveyUploadModule { }
