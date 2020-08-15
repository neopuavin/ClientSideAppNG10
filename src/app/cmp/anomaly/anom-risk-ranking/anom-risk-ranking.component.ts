import { AnomalyCommon } from './../anomaly.common';
import { AnomalyComponent } from './../anomaly.component';
import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-anom-risk-ranking',
  templateUrl: './anom-risk-ranking.component.html',
  styleUrls: ['./anom-risk-ranking.component.scss'],
})
export class AnomRiskRankingComponent extends AnomalyCommon
  implements OnInit, AfterViewInit {
  constructor(@Inject(AnomalyComponent) public module: AnomalyComponent) {
    super(module);
  }

  ngOnInit(): void {}

  public get severity(): number {
    if (!this.module.sourceRow) return 0;
    return this.module.sourceRow.AN_RISK_RANK_SEVERITY;
  }
  public get likelihood(): number {
    if (!this.module.sourceRow) return 0;
    return this.module.sourceRow.AN_RISK_RANK_LIKELIHOOD;
  }
}
