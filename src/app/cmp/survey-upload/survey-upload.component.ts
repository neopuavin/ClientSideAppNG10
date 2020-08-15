import { AppMainServiceService } from './../../svc/app-main-service.service';
import { FormCommon } from './../form.common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-survey-upload',
  templateUrl: './survey-upload.component.html',
  styleUrls: ['./survey-upload.component.scss']
})
export class SurveyUploadComponent extends FormCommon implements OnInit{

  constructor(public dataSource:AppMainServiceService) {
    super(dataSource);
  }

  ngOnInit(): void {
  }

}
