import { AppMainServiceService } from './../../svc/app-main-service.service';
import { FormCommon } from './../form.common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chemical-database',
  templateUrl: './chemical-database.component.html',
  styleUrls: ['./chemical-database.component.scss']
})
export class ChemicalDatabaseComponent  extends FormCommon implements OnInit{

  constructor(public dataSource:AppMainServiceService) {
    super(dataSource);
  }
  ngOnInit(): void {
  }

}
