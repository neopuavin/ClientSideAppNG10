import { PanelAComponent } from './../panel-a/panel-a.component';
import { AppFormAComponent } from './../app-form-a/app-form-a.component';
import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  Output,
  EventEmitter,
  Inject
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

  @Input() likelihoodField:string;
  @Input() severityField:string;

  @Input() readOnly: boolean = true;

  @Output() riskClick: EventEmitter<any> = new EventEmitter();

  constructor(
    @Inject(AppFormAComponent) public form: AppFormAComponent,
    @Inject(PanelAComponent) public panel: PanelAComponent
  ) {}

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

  public get severityText():string{
    if(!this.severity) return ''
    const sev = this.riskMatrixData.sev.find(i=>i.key==this.severity)
    return sev ? sev.text : '';
  }
  public get likelihoodText():string{
    //return 'Incident has occurred in region / Susceptable to degradation under normal conditions';
    // Incident has occurred in region / Susceptable to degradation under normal conditions
    if(!this.likelihood) return ''
    const lik = this.riskMatrixData.lik.find(i=>i.key==this.likelihood)
    return lik ? lik.text : '';
  }
}
