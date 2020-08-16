import { APIModule } from './../../api/api.module';
import { AssetManagementComponent } from './asset-management.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const declare = [AssetManagementComponent];

@NgModule({
  declarations: declare,
  exports: declare,
  imports: [CommonModule, APIModule],
})

export class AssetManagementModule { }
