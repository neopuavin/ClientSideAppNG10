import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APIModule } from './../../api/api.module';
import { ReferenceLibraryComponent } from './reference-library.component';
import { ReferenceGeneralComponent } from './reference-general/reference-general.component';
import { ReferenceLinksComponent } from './reference-links/reference-links.component';

const declare = [ReferenceLibraryComponent, ReferenceGeneralComponent, ReferenceLinksComponent];

@NgModule({
  declarations: declare,
  exports: declare,
  imports: [CommonModule, APIModule],
})

export class ReferenceLibraryModule { }
