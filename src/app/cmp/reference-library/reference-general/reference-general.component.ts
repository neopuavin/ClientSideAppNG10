import { Component, OnInit, Inject } from '@angular/core';
import { ReferenceLibraryComponent } from './../reference-library.component';

@Component({
  selector: 'app-reference-general',
  templateUrl: './reference-general.component.html',
  styleUrls: ['./reference-general.component.scss']
})
export class ReferenceGeneralComponent implements OnInit {

  constructor(@Inject(ReferenceLibraryComponent) public module: ReferenceLibraryComponent) { }

  ngOnInit(): void {
  }

}
