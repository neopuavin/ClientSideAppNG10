import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from './../material.module';
import { APIModule } from './../api/api.module';

import { AnomalyModule } from './anomaly/anomaly.module';
import { AssetManagementModule } from './asset-management/asset-management.module';
import { UserManagementModule } from './user-management/user-management.module';
import { SurveyUploadModule } from './survey-upload/survey-upload.module';
import { SurveyDataModule } from './survey-data/survey-data.module';
import { SettingsModule } from './settings/settings.module';
import { SeismicModule } from './seismic/seismic.module';
import { RiskBasedInspectionModule } from './risk-based-inspection/risk-based-inspection.module';
import { ReferenceLibraryModule } from './reference-library/reference-library.module';
import { FreespanModule } from './freespan/freespan.module';
import { ChemicalDatabaseModule } from './chemical-database/chemical-database.module';
import { DesignDataModule } from './design-data/design-data.module';

import { CommonPopupComponent } from './common-popup/common-popup.component';
import { AppLandingComponent } from './app-landing/app-landing.component';
import { AssetSelectorComponent } from './asset-selector/asset-selector.component';

const declare = [AppLandingComponent, CommonPopupComponent, AssetSelectorComponent];
const both = [
  // common modules
  APIModule,
  MaterialModule,

  // meature modules
  AnomalyModule,
  AssetManagementModule,
  ChemicalDatabaseModule,
  DesignDataModule,
  FreespanModule,
  ReferenceLibraryModule,
  RiskBasedInspectionModule,
  SeismicModule,
  SettingsModule,
  SurveyDataModule,
  SurveyUploadModule,
  UserManagementModule,

];

@NgModule({
  declarations: declare,
  imports: [CommonModule,  both],
  exports: [CommonPopupComponent, AppLandingComponent, both],
})
export class CoreModule {}
