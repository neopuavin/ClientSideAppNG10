import { Component, OnInit, Inject } from '@angular/core';
import { ReferenceLibraryComponent } from './../reference-library.component';

@Component({
  selector: 'app-reference-links',
  templateUrl: './reference-links.component.html',
  styleUrls: ['./reference-links.component.scss']
})
export class ReferenceLinksComponent implements OnInit {

  constructor(@Inject(ReferenceLibraryComponent) public module: ReferenceLibraryComponent) { }

  ngOnInit(): void {
  }

}
