import { ILookupItem } from './../../api/mod/app-common.classes';
import { AppDataset } from './../../svc/app-dataset.service';
import { AppMainServiceService } from './../../svc/app-main-service.service';
import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-risk-matrix',
  templateUrl: './risk-matrix.component.html',
  styleUrls: ['./risk-matrix.component.scss'],
})
export class RiskMatrixComponent implements OnInit, AfterViewInit {
  @Input() phHeight: number = 100;
  @Input() phBackSize: number = 600;
  @Input() phDuration: number = 4;

  @Input() severity: number = 0;
  @Input() likelihood: number = 0;
  @Input() readOnly: boolean = true;

  @Output() riskClick: EventEmitter<any> = new EventEmitter();

  constructor(public dataSource: AppMainServiceService) {}

  ngOnInit(): void {
    //this.riskMatrixData();
    //console.log(this.riskMatrixData());
  }

  ngAfterViewInit() {
    // console.log('riskMatrixData:', this.riskMatrixData);
  }

  public get ds(): AppDataset {
    if (!this.dataSource) return null;
    if (!this.dataSource.ActiveSource) return null;
    return this.dataSource.ActiveSource.appDataset;
  }

  public get isWithData(): boolean {
    if (!this.severity) return false;
    if (!this.likelihood) return false;
    return true;
  }

  public get riskMatrixData(): any {
    return this.ds.riskMatrixData;
  }

  public get isReady(): boolean {
    if (!this.ds) return false;
    if (!this.riskMatrixData) return false;
    return true;
  }

  CellClick(lik: number, sev: number) {
    if(this.readOnly)return;
    console.log('likelihood', lik, 'severity', sev);
    this.severity = sev;
    this.likelihood = lik;
    this.riskClick.emit({ likelihood: lik, severity: sev });
  }
}
