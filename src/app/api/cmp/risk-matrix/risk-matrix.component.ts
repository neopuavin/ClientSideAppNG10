import { FormGroup } from '@angular/forms';
import { PanelAComponent } from './../panel-a/panel-a.component';
import { AppFormAComponent } from './../app-form-a/app-form-a.component';
import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  Output,
  EventEmitter,
  Inject,
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

  @Input() riskMatrixData: any;

  @Input() likelihoodField: string;
  @Input() severityField: string;

  @Input() readOnly: boolean = true;

  @Output() riskClick: EventEmitter<any> = new EventEmitter();

  constructor(
    @Inject(AppFormAComponent) public form: AppFormAComponent,
    @Inject(PanelAComponent) public panel: PanelAComponent
  ) {}

  ngOnInit(): void {
    //this.riskMatrixData();
    //console.log(this.riskMatrixData());
    // console.log("from RISK MATRIX this.form.formObject",this.form.formObject);

    // bind severity and likelihood fields to the form's formObject
    if (this.form) {
      console.log("RISK MATRIX INIT!")
      if (this.likelihoodField) console.log("CTL LIK:",this.form.RegisterField(this.likelihoodField));
      if (this.severityField) console.log("CTL SEV:",this.form.RegisterField(this.severityField));
    }
  }

  ngAfterViewInit() {
    // console.log('riskMatrixData:', this.riskMatrixData);
    console.log(
      'from RISK MATRIX: ',
      this.likelihoodField,
      this.severityField,
      this.severity,
      this.likelihood
    );
  }

  private get formObject(): FormGroup {
    if (this.form) return this.form.formObject;
    return null;
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

  CellClick(sev: number, lik: number) {
    if (this.readOnly) return;
    this.severity = sev;
    this.likelihood = lik;
    this.riskClick.emit({ severity: sev, likelihood: lik });
  }

  public get severity(): number {
    return this.getFieldValue(this.severityField);
  }
  public get likelihood(): number {
    return this.getFieldValue(this.likelihoodField);
  }

  private getFieldValue(fieldName: string): number {
    // console.log("getFieldValue:",fieldName,this[fieldName], this.formObject)
    if (!fieldName || !this.formObject) return -1;
    const ctl = this.formObject.get(fieldName);
    if (!ctl) return 0;
    return ctl.value;
  }

  public set severity(value: number) {
    this.setFieldValue(this.severityField, value);
  }
  public set likelihood(value: number) {
    this.setFieldValue(this.likelihoodField, value);
  }

  private setFieldValue(fieldName: string, value: number) {
    if (!fieldName || !this.formObject) return;
    const ctl = this.formObject.get(fieldName);
    if (!ctl) return;
    ctl.setValue(value);
  }

  public get severityText(): string {
    if (!this.severity) return '';
    const sev = this.riskMatrixData.sev.find((i) => i.key == this.severity);
    return sev ? sev.text : '';
  }
  public get likelihoodText(): string {
    //return 'Incident has occurred in region / Susceptable to degradation under normal conditions';
    // Incident has occurred in region / Susceptable to degradation under normal conditions
    if (!this.likelihood) return '';
    const lik = this.riskMatrixData.lik.find((i) => i.key == this.likelihood);
    return lik ? lik.text : '';
  }
}
