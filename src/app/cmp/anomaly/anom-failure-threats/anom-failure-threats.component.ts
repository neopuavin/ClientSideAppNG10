import { AnomalyComponent } from './../anomaly.component';
import { DataOption } from './../../../api/mod/app-common.classes';
import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { AnomalyCommon } from '../anomaly.common';

@Component({
  selector: 'app-anom-failure-threats',
  templateUrl: './anom-failure-threats.component.html',
  styleUrls: ['./anom-failure-threats.component.scss']
})
export class AnomFailureThreatsComponent extends AnomalyCommon implements OnInit,AfterViewInit {
  constructor(@Inject(AnomalyComponent) public module: AnomalyComponent) {
    super(module);
  }

  ngOnInit(): void {
  }

  private _gridDataOption: DataOption = new DataOption()
  public get gridDataOption():DataOption{
    return this._gridDataOption;
  }

  public get gridSourceLookups():any{
    return null;
  }

  public get gridSourceRows():Array<any>{
    return [];
  }

}
