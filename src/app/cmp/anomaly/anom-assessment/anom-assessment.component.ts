import { AnomalyComponent } from './../anomaly.component';
import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { AnomalyCommon } from '../anomaly.common';

@Component({
  selector: 'app-anom-assessment',
  templateUrl: './anom-assessment.component.html',
  styleUrls: ['./anom-assessment.component.scss']
})
export class AnomAssessmentComponent extends AnomalyCommon  implements OnInit ,AfterViewInit{

  constructor(@Inject(AnomalyComponent) public module: AnomalyComponent) {
    super(module);
   }

}
