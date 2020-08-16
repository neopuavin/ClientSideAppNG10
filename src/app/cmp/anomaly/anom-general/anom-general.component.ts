import { AnomalyComponent } from './../anomaly.component';
import {
  Component,
  OnInit,
  Inject,
  AfterViewInit,
} from '@angular/core';
import { AnomalyCommon } from '../anomaly.common';

@Component({
  selector: 'app-anom-general',
  templateUrl: './anom-general.component.html',
  styleUrls: ['./anom-general.component.scss'],
})
export class AnomGeneralComponent extends AnomalyCommon
  implements OnInit, AfterViewInit {

  constructor(@Inject(AnomalyComponent) public module: AnomalyComponent) {
    super(module);

  }


}
