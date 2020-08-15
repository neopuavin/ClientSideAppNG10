import { AnomalyComponent } from './../anomaly.component';
import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { AnomalyCommon } from '../anomaly.common';

@Component({
  selector: 'app-anom-recommendations',
  templateUrl: './anom-recommendations.component.html',
  styleUrls: ['./anom-recommendations.component.scss'],
})
export class AnomRecommendationsComponent extends AnomalyCommon implements OnInit,AfterViewInit {
  constructor(@Inject(AnomalyComponent) public module: AnomalyComponent) {
    super(module);
  }

}
