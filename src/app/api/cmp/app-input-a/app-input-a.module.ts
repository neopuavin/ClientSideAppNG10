import { MemoInputComponent } from './memo-input/memo-input.component';
import { DateInputComponent } from './date-input/date-input.component';
import { CheckInputComponent } from './check-input/check-input.component';
import { RadioInputComponent } from './radio-input/radio-input.component';
import { ToggleInputComponent } from './toggle-input/toggle-input.component';
import { ApiCommonModule } from './../api-common/api-common.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './../../../material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppInputAComponent } from './app-input-a.component';
import { TextInputComponent } from './text-input/text-input.component';

const declare = [
  AppInputAComponent,
  TextInputComponent,
  ToggleInputComponent,
  RadioInputComponent,
  CheckInputComponent,
  DateInputComponent,
  MemoInputComponent,
];

@NgModule({
  declarations: declare,
  exports: [declare],
  imports: [CommonModule, MaterialModule, ApiCommonModule, ReactiveFormsModule],
})
export class AppInputAModule {}
