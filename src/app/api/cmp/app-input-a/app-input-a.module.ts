import { ApiCommonModule } from './../api-common/api-common.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './../../../material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppInputAComponent } from './app-input-a.component';
import { TextInputComponent } from './text-input/text-input.component';


const declare = [AppInputAComponent,TextInputComponent];

@NgModule({
  declarations: declare,
  exports: [declare],
  imports: [
    CommonModule,
    MaterialModule,
    ApiCommonModule,
    ReactiveFormsModule
  ]
})
export class AppInputAModule { }
