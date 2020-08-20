import { FormGroup, AbstractControl, FormControl } from '@angular/forms';
import {
  Component,
  OnInit,
  Input,
  LOCALE_ID,
  Inject,
  AfterViewInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';

@Component({
  selector: 'app-app-form-a',
  templateUrl: './app-form-a.component.html',
  styleUrls: ['./app-form-a.component.scss'],
})
export class AppFormAComponent implements OnInit, AfterViewInit {
  /****************************************************************************
   this switch is necessary to prevent update to the current record when a global
   field values updates are being perfomed (e.g. Scatter() method)
   ****************************************************************************/
  public suspendControlChangeEvent: boolean = false;

  // holds the reactive form parent group
  @Input() formObject: FormGroup = null;
  @Input() formName: string;

  @Input() phBackSize: number = -1;
  @Input() phDuration: number = -1;

  @Input() controlHeight: number = 22;
  @Input() labelWidth: number = 130;
  @Input() rowSpacing: number = 2;
  @Input() excludes: Array<string> = [];
  @Input() readOnly: boolean = false;

  @Output() afterScatter: EventEmitter<any> = new EventEmitter();

  private _sourceRow: any = null;
  @Input() set sourceRow(value: any) {
    let src: any = value;

    this._sourceRow = src;

    // set values of form controls to the new record's values
    // call for scatter is necessary when record is changed
    this.Scatter(true);
  }
  get sourceRow(): any {
    return this._sourceRow;
  }

  private _isDataLoading: boolean = false;
  @Input() set isDataLoading(value: boolean) {
    this._isDataLoading = value;
  }
  get isDataLoading(): boolean {
    return this._isDataLoading;
  }

  public fieldsInitialized: Array<string> = [];

  constructor(@Inject(LOCALE_ID) private locale: string) {}

  ngOnInit(): void {}
  ngAfterViewInit() {
    // console.log();
    // this.Scatter();
  }

  private _formFields: {};
  public get formFields(): {} {
    return this._formFields;
  }

  public RegisterField(fieldName: string): FormControl {
    if (!this.formObject) return null;

    let control: any = this.formObject.get(fieldName);

    if (!control) {
      // if control is not yet part of the form
      const colVal = this.sourceRow ? this.sourceRow[fieldName] : null;

      // register field as with initialized value when sourceRow is available
      // this is a must to prevent reinitialization when Scatter method is called
      if (this.sourceRow) this.MarkAsInitialized(fieldName);

      control = new FormControl(colVal);
      this.formObject.addControl(fieldName, control);
    } else {
      // control has previously been created
      // console.log(this.fieldName,"Previously initialized!")
      this.MarkAsInitialized(fieldName);
    }
    return control;
  }

  public MarkAsNotInitialized(fieldName: string) {
    const index = this.fieldsInitialized.indexOf(fieldName);
    if (index != -1) this.fieldsInitialized.splice(index, 1);
  }
  public MarkAsInitialized(fieldName: string) {
    const index = this.fieldsInitialized.indexOf(fieldName);
    if (index == -1) this.fieldsInitialized.push(fieldName);
  }

  public Scatter(recordChanged?: boolean): void {
    /******************************************************************************
     * Sets the values of form controls to the equivalent field of the source
     ******************************************************************************/
    if (!this.formObject) return;

    if (recordChanged == undefined) recordChanged = false;
    if (recordChanged) this.fieldsInitialized = [];

    let patchValues: any = {};
    let sourceTable: any = null;
    let cols: Array<any> = [];
    let ctrl: AbstractControl;

    this.suspendControlChangeEvent = true; // suspend control change event

    if (this.sourceRow) {
      // sourceTable = this.sourceRow.parentTable;
      // if (sourceTable) cols = sourceTable.columns;

      for (const field in this.formObject.controls) {
        // 'field' is a string
        // patch value of each

        // if control is not to be updated, continue with the next control
        if (this.excludes.indexOf(field) != -1) continue;

        // check if the field value has already been set initially
        if (this.fieldsInitialized.indexOf(field) != -1) continue;

        let controlEnabled: boolean = true;
        let colValue: any = undefined;

        ctrl = this.formObject.get(field);

        if (ctrl) {
          // field is not yet initialized

          // get field value from the source row
          colValue = this.sourceRow[field];

          //if (colValue == 'TBA' || colValue == undefined)
          // if (colValue == 'TBA') controlEnabled = false;

          patchValues[field] = colValue;

          // field is now initialized
          // this.formFields[field] = true;

          // register field as with value initially set
          this.fieldsInitialized.push(field);

          if (controlEnabled) {
            if (ctrl.disabled) ctrl.enable();
          } else {
            if (!ctrl.disabled) ctrl.disable();
          }
        }
      } // end of for
    } // end of sourceRow available

    // sourceRow is not set or null
    else
      for (const field in this.formObject.controls) {
        // 'field' is a string
        // patch value of each
        ctrl = this.formObject.get(field);
        if (ctrl) {
          // next line causes error reported on browser debugger but does not affect
          // execution of the program.
          if (!ctrl.disabled) ctrl.disable();
          patchValues[field] = null;
        }
      }

    // apply changed values to form object
    this.formObject.patchValue(patchValues);

    // resume control change event
    this.suspendControlChangeEvent = false;

    console.log('AfterScatter, recordChanged', recordChanged);

    this.afterScatter.emit(this);
  }
}
