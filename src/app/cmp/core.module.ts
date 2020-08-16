import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from './../material.module';
import { APIModule } from './../api/api.module';

import { AnomalyModule } from './anomaly/anomaly.module';

import { CommonPopupComponent } from './common-popup/common-popup.component';
import { AssetSelectorComponent } from './asset-selector/asset-selector.component';
import { FormHeaderComponent } from './form-header/form-header.component';

@NgModule({
  declarations: [FormHeaderComponent, CommonPopupComponent, AssetSelectorComponent],
  imports: [CommonModule, APIModule, MaterialModule, AnomalyModule],
  exports: [FormHeaderComponent, CommonPopupComponent, AnomalyModule],
})
export class CoreModule {}
