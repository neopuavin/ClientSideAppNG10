
import { DesignDataComponent } from './../design-data.component';
import {
  Component,
  OnInit,
  Inject,
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

constructor(@Inject(DesignDataComponent) public module: DesignDataComponent) {
  super(module);
}

public get toggleDisplay():Array<any>{
  return this.module.ds.toggleYesNoNA;
}

}
