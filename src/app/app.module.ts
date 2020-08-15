import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeComponent } from './sandbox/font-awesome/font-awesome.component';
import { MaterialsComponent } from './sandbox/materials/materials.component';

// contains all module imports related to Angular Materials/CDK
import { HttpClientModule } from '@angular/common/http';

// custom components
import { AppCommonMethodsService } from './api/svc/app-common-methods.service';
import { MainFrameComponent } from './cmp/main-frame/main-frame.component';

import { TreeViewComponent } from './api/cmp/tree-view/tree-view.component';
import { AppInputAComponent } from './api/cmp/app-input-a/app-input-a.component';
import { DataGridComponent } from './api/cmp/data-grid/data-grid.component';
// import { PanelAComponent } from './api/cmp/panel-a/panel-a.component';
// import { AppFormAComponent } from './api/cmp/app-form-a/app-form-a.component';
// import { DataTabsComponent } from './api/cmp/data-tabs/data-tabs.component';

// contains all module imports related to Angular Materials/CDK
import { MaterialModule } from './material.module';
import { APIModule } from './api/api.module';

// Application custom components
import { DesignDataComponent } from './cmp/design-data/design-data.component';
import { ChemicalDatabaseComponent } from './cmp/chemical-database/chemical-database.component';
import { SurveyDataComponent } from './cmp/survey-data/survey-data.component';
import { FreespanComponent } from './cmp/freespan/freespan.component';
import { SeismicComponent } from './cmp/seismic/seismic.component';
import { ReferenceLibraryComponent } from './cmp/reference-library/reference-library.component';
import { UserManagementComponent } from './cmp/user-management/user-management.component';
import { AssetManagementComponent } from './cmp/asset-management/asset-management.component';
import { RiskBasedInspectionComponent } from './cmp/risk-based-inspection/risk-based-inspection.component';
import { SurveyUploadComponent } from './cmp/survey-upload/survey-upload.component';
import { FormHeaderComponent } from './cmp/form-header/form-header.component';
import { SettingsComponent } from './cmp/settings/settings.component';

import { AnomalyComponent } from './cmp/anomaly/anomaly.component';
import { AnomGeneralComponent } from './cmp/anomaly/anom-general/anom-general.component';
import { AnomActionsComponent } from './cmp/anomaly/anom-actions/anom-actions.component';
import { AnomRecommendationsComponent } from './cmp/anomaly/anom-recommendations/anom-recommendations.component';
import { AnomRelatedAnomaliesComponent } from './cmp/anomaly/anom-related-anomalies/anom-related-anomalies.component';
import { AnomAttachmentsComponent } from './cmp/anomaly/anom-attachments/anom-attachments.component';
import { AnomFailureThreatsComponent } from './cmp/anomaly/anom-failure-threats/anom-failure-threats.component';
import { AnomRiskRankingComponent } from './cmp/anomaly/anom-risk-ranking/anom-risk-ranking.component';
import { AnomAssessmentComponent } from './cmp/anomaly/anom-assessment/anom-assessment.component';
import { AnomAddEditComponent } from './cmp/anomaly/anom-add-edit/anom-add-edit.component';
// import { AlertComponent } from './api/cmp/alert/alert.component';
import { RiskMatrixComponent } from './cmp/risk-matrix/risk-matrix.component';
import { PhBox1Component } from './api/cmp/ph/ph-box1/ph-box1.component';
import { AssetSelectorComponent } from './cmp/asset-selector/asset-selector.component';
import { CommonPopupComponent } from './cmp/common-popup/common-popup.component';
import { DatePickerAComponent } from './api/cmp/date-picker-a/date-picker-a.component';
import { TreeViewSearchResultComponent } from './api/cmp/tree-view/tree-view-search-result/tree-view-search-result.component';
import { TestDataGridComponent } from './cmp/test-data-grid/test-data-grid.component';

@NgModule({
  declarations: [

    AppComponent,
    MainFrameComponent,
    DesignDataComponent,
    ChemicalDatabaseComponent,
    SurveyDataComponent,
    FreespanComponent,
    SeismicComponent,
    ReferenceLibraryComponent,
    UserManagementComponent,
    AssetManagementComponent,
    RiskBasedInspectionComponent,
    SurveyUploadComponent,
    FormHeaderComponent,
    SettingsComponent,
    AnomalyComponent,
    AnomGeneralComponent,
    AnomAssessmentComponent,
    AnomRecommendationsComponent,
    AnomRiskRankingComponent,
    AnomFailureThreatsComponent,
    AnomAttachmentsComponent,
    AnomActionsComponent,
    AnomRelatedAnomaliesComponent,

    TreeViewComponent,
    // PanelAComponent,
    DataGridComponent,
    // AppFormAComponent,
    // DataTabsComponent,
    AppInputAComponent,
    AnomAddEditComponent,
    // AlertComponent,
    RiskMatrixComponent,
    PhBox1Component,
    AssetSelectorComponent,
    CommonPopupComponent,
    DatePickerAComponent,
    TreeViewSearchResultComponent,
    TestDataGridComponent,


    FontAwesomeComponent,
    MaterialsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
    APIModule
  ],
  providers: [AppCommonMethodsService,Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
