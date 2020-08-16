import { ChemicalDatabaseComponent } from './chemical-database.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { APIModule } from './../../api/api.module';
const declare = [ChemicalDatabaseComponent];

@NgModule({
  declarations: declare,
  exports: declare,
  imports: [CommonModule, APIModule],
})

export class ChemicalDatabaseModule { }
