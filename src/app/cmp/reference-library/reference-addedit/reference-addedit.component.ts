import { Component, OnInit,Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-reference-addedit',
  templateUrl: './reference-addedit.component.html',
  styleUrls: ['./reference-addedit.component.scss']
})
export class ReferenceAddeditComponent implements OnInit {

  @Input() data: any = {};

  constructor() { }

  ngOnInit(): void {
  }

  public RefLookup(key: any) {
    return this.data.parent.RefLookup(key);
  }


  public get formObject(): FormGroup {
    if (!this.data) return null;
    return this.data.formObject;
  }

}
