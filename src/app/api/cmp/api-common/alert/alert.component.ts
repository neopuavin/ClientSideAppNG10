import { Component, OnInit,Input,  AfterViewInit } from '@angular/core';

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
