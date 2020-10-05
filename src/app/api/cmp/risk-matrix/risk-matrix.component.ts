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

  @Input() selectedValues: Array<{
    severity: number;
    likelihood: number;
  }> = null;

  @Input() readOnly: boolean = true;

  @Output() riskClick: EventEmitter<any> = new EventEmitter();

  constructor(
    @Inject(AppFormAComponent) public form: AppFormAComponent,
    @Inject(PanelAComponent) public panel: PanelAComponent
  ) {}

  ngOnInit(): void {
    // bind severity and likelihood fields to the form's formObject
    if (this.form) {
      console.log(
        'RISK MATRIX INIT!',
        this.riskMatrixData,
        'riskMatrixData.sev',
        this.riskMatrixData.sev
      );
      if (this.likelihoodField)
        console.log('CTL LIK:', this.form.RegisterField(this.likelihoodField));
      if (this.severityField)
        console.log('CTL SEV:', this.form.RegisterField(this.severityField));
    }
  }

  ngAfterViewInit() {
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
    if(this.selectedValues) return true;
    if (!this.severity) return false;
    if (!this.likelihood) return false;
    return true;
  }

  public get isReady(): boolean {
    if (!this.riskMatrixData) return false;
    return true;
  }

  CellClick(sev: number, lik: number) {
    console.log("this.selectedValues",this.selectedValues);
    if (this.readOnly) return;

    if (this.selectedValues) {
      const riskIndex = this.selectedValues.findIndex(
        (v) => v.severity == sev && v.likelihood == lik
      );
      if (riskIndex == -1) {
        // not yet selected, add to the collection
        this.selectedValues.push({severity:sev,likelihood:lik});

      } else {
        // already selected, remove from the selection
        this.selectedValues.splice(riskIndex);

      }
      return;
    }

    this.severity = sev;
    this.likelihood = lik;
    this.riskClick.emit({ severity: sev, likelihood: lik });
  }

  public checkCell(sev: number, lik: number): boolean {
    if (this.selectedValues)
      return this.selectedValues.find(
        (v) => v.severity == sev && v.likelihood == lik
      )
        ? true
        : false;
    return this.severity == sev && this.likelihood == lik;
  }

  public get severity(): number {
    return this.getFieldValue(this.severityField);
  }
  public get likelihood(): number {
    return this.getFieldValue(this.likelihoodField);
  }

  private getFieldValue(fieldName: string): number {
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

  RemoveRisk(event: any) {
    this.likelihood = null;
    this.severity = null;
  }
}
