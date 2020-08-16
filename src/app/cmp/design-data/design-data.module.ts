import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APIModule } from './../../api/api.module';
import { DesignDataComponent } from './design-data.component';

const declare = [DesignDataComponent];

@NgModule({
  declarations: declare,
  exports: declare,
  imports: [CommonModule, APIModule],
})
export class DesignDataModule {}
