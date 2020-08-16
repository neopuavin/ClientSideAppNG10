import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APIModule } from './../../api/api.module';
import { ReferenceLibraryComponent } from './reference-library.component';

const declare = [ReferenceLibraryComponent];

@NgModule({
  declarations: declare,
  exports: declare,
  imports: [CommonModule, APIModule],
})

export class ReferenceLibraryModule { }
