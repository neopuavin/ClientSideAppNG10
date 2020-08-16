import { FreespanComponent } from './freespan.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APIModule } from './../../api/api.module';

const declare = [FreespanComponent];

@NgModule({
  declarations: declare,
  exports: declare,
  imports: [CommonModule, APIModule],
})
export class FreespanModule { }
