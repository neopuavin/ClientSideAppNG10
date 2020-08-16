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

  @Input() riskMatrixData:any;
  @Input() severity: number = 0;
  @Input() likelihood: number = 0;
  @Input() readOnly: boolean = true;

  @Output() riskClick: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    //this.riskMatrixData();
    //console.log(this.riskMatrixData());
  }

  ngAfterViewInit() {
    // console.log('riskMatrixData:', this.riskMatrixData);
  }



  public get isWithData(): boolean {
    if (!this.severity) return false;
    if (!this.likelihood) return false;
    return true;
  }


  public get isReady(): boolean {
    if (!this.riskMatrixData) return false;
    return true;
  }

  CellClick(lik: number, sev: number) {
    if(this.readOnly)return;
    this.severity = sev;
    this.likelihood = lik;
    this.riskClick.emit({ likelihood: lik, severity: sev });
  }
}
