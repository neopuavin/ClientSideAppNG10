
import { DesignDataComponent } from './../design-data.component';
import {
  Component,
  OnInit,
  Inject,
  Input,
  AfterViewInit,
} from '@angular/core';

import { DesignDataCommon } from '../design-data.common';

@Component({
  selector: 'app-design-data-general',
  templateUrl: './design-data-general.component.html',
  styleUrls: ['./design-data-general.component.scss']
})
export class DesignDataGeneralComponent extends DesignDataCommon
  implements OnInit, AfterViewInit {

  @Input() data: any = {};

  constructor(@Inject(DesignDataComponent) public module: DesignDataComponent) {
    super(module);
  }

  public get toggleDisplay(): Array<any> {
    return this.module.ds.toggleYesNoNA;
  }



  public get row(): any {
    if (!this.data) return null;
    return this.data.row;
  }

  public get assetLookup(): Array<any> {
    if (!this.data) return null;
    if (!this.row) return null;
    if (!this.row.XTRA) return null;

    return this.row.XTRA.assetLookup;
  }

  ngAfterViewInit() {
    setTimeout(() => (this._isReady = true), 1);
    //setTimeout(() => this.SetDesignDataParTypeGroup(), 1);

    console.log('\nDesignDataAddEditPopupData:', this.data);
  }

  private _isReady: boolean = false;
  public get isReady(): boolean {
    // in the future, this should be dicated by the required parameters in the form (eg. lookups, etc.)
    return this._isReady;
  }
  

}
