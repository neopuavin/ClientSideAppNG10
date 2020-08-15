import { AppMainServiceService } from './../../svc/app-main-service.service';
import { FormCommon } from './../form.common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-seismic',
  templateUrl: './seismic.component.html',
  styleUrls: ['./seismic.component.scss']
})
export class SeismicComponent  extends FormCommon implements OnInit{

  constructor(public dataSource:AppMainServiceService) {
    super(dataSource);
  }

  ngOnInit(): void {
  }

}
