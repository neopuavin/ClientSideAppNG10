import { AppMainServiceService } from './../../svc/app-main-service.service';
import { FormCommon } from './../form.common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-risk-based-inspection',
  templateUrl: './risk-based-inspection.component.html',
  styleUrls: ['./risk-based-inspection.component.scss']
})
export class RiskBasedInspectionComponent  extends FormCommon implements OnInit{

  constructor(public dataSource:AppMainServiceService) {
    super(dataSource);
  }
  ngOnInit(): void {
  }

}
