import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APIModule } from './../../api/api.module';

import { AnomRelatedAnomaliesComponent } from './anom-related-anomalies/anom-related-anomalies.component';
import { AnomActionsComponent } from './anom-actions/anom-actions.component';
import { AnomAttachmentsComponent } from './anom-attachments/anom-attachments.component';
import { AnomFailureThreatsComponent } from './anom-failure-threats/anom-failure-threats.component';
import { AnomRiskRankingComponent } from './anom-risk-ranking/anom-risk-ranking.component';
import { AnomRecommendationsComponent } from './anom-recommendations/anom-recommendations.component';
import { AnomAssessmentComponent } from './anom-assessment/anom-assessment.component';
import { AnomalyComponent } from './anomaly.component';
import { AnomGeneralComponent } from './anom-general/anom-general.component';
import { AnomAddEditComponent } from './anom-add-edit/anom-add-edit.component';

const declare = [
  AnomalyComponent,
  AnomGeneralComponent,
  AnomAssessmentComponent,
  AnomRecommendationsComponent,
  AnomRiskRankingComponent,
  AnomFailureThreatsComponent,
  AnomAttachmentsComponent,
  AnomActionsComponent,
  AnomRelatedAnomaliesComponent,
  AnomAddEditComponent,
];

@NgModule({
  declarations: declare,
  imports: [CommonModule, APIModule],
  exports: declare,
})
export class AnomalyModule {}
