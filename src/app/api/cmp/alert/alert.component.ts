import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, Input, AfterContentInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit,AfterViewInit {

  constructor() { }
  @Input() data: any;

  ngOnInit(): void {

  }

  ngAfterViewInit(){

  }



}
