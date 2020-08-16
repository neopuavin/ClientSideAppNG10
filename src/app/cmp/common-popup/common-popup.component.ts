import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-common-popup',
  templateUrl: './common-popup.component.html',
  styleUrls: ['./common-popup.component.scss']
})
export class CommonPopupComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
 ) { }

  ngOnInit(): void {
    console.log("DATA",this.data);
  }

}
