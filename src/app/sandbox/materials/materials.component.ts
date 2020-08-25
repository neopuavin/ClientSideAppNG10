import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss']
})
export class MaterialsComponent implements OnInit, AfterViewInit {

  @ViewChild('picker') picker:any;

  constructor() { }

  ngOnInit(): void {
  }
  ngAfterViewInit(){
    const ctrl:any = document.querySelector('#outline');
    const div:any = ctrl.querySelector('.mat-form-field-infix');
    const div2:any = ctrl.querySelector('.mat-form-field-wrapper');

    console.log("selector",div.attributes[0].ownerElement);

    // div.style.background='magenta';
    // div2.style.background='lime';

    div.style.padding='2px';
    div2.style.height=div.offsetHeight + 'px';
    div2.style.margin='0px';
    div2.style.padding='2px';


  }

}
