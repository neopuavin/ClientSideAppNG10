import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { ReferenceLibraryComponent } from './../reference-library.component';

@Component({
  selector: 'app-reference-general',
  templateUrl: './reference-general.component.html',
  styleUrls: ['./reference-general.component.scss']
})
export class ReferenceGeneralComponent implements OnInit,AfterViewInit {

  constructor(@Inject(ReferenceLibraryComponent) public module: ReferenceLibraryComponent) { }

  ngOnInit(): void {
  }

  ngAfterViewInit():void{
    console.log("AfterViewInit:",this.module.RefLookup(139))
  }

}
