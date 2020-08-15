import { AppMainServiceService } from './../../svc/app-main-service.service';
import { FormCommon } from './../form.common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-asset-management',
  templateUrl: './asset-management.component.html',
  styleUrls: ['./asset-management.component.scss']
})
export class AssetManagementComponent extends FormCommon implements OnInit{

  constructor(public dataSource:AppMainServiceService) {
    super(dataSource);
  }
  ngOnInit(): void {
  }

}
