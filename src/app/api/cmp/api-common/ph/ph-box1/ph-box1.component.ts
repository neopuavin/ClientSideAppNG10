import { Component, OnInit, Input, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-ph-box1',
  templateUrl: './ph-box1.component.html',
  styleUrls: ['./ph-box1.component.scss']
})
export class PhBox1Component implements OnInit, AfterViewInit {

  @Input() public stripHeight: number = 20;
  @Input() public backSize: number = 1300;
  @Input() public duration: number = 1.7;
  @Input() public marginTop: number = 0;


  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
  }

  // findKeyframesRule(rule) {
  //   var ss = document.styleSheets;
  //   for (var i = 0; i < ss.length; ++i) {
  //     for (var j = 0; j < ss[i].cssRules.length; ++j) {
  //       if (ss[i].cssRules[j].type == window.CSSRule["WEBKIT_KEYFRAMES_RULE"] &&
  //       ss[i].cssRules[j]["name"] == rule) {
  //         return ss[i].cssRules[j]; }
  //     }
  //   }
  //   return null;
  // }

}
