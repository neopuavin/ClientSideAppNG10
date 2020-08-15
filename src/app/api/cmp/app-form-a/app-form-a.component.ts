import { FormGroup, AbstractControl } from '@angular/forms';
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
    this.Scatter();
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

  constructor(@Inject(LOCALE_ID) private locale: string) {}

  ngOnInit(): void {}
  ngAfterViewInit() {
    this.Scatter();
  }

  public Scatter(): void {
    /******************************************************************************
     * Sets the values of form controls to the equivalent field of the source
     ******************************************************************************/
    if (!this.formObject) return;
    //if (!this.sourceRow) return;

    let patchValues: any = {};
    let sourceTable: any = null;
    let cols: Array<any> = [];
    let ctrl: AbstractControl;

    this.suspendControlChangeEvent = true; // suspend control change event

    if (this.sourceRow) {
      sourceTable = this.sourceRow.parentTable;
      if (sourceTable) cols = sourceTable.columns;

      for (const field in this.formObject.controls) {
        // 'field' is a string
        // patch value of each
        if (this.excludes.indexOf(field) == -1) {
          let controlEnabled: boolean = true;
          ctrl = this.formObject.get(field);
          //ctrl.readonly = false;
          if (this.sourceRow) {
            // patchValues[field] = this.sourceRow[field];
            const col = cols.find((c) => c.name == field);
            let colValue: any = this.sourceRow[field];

            if (col)
              if (col.type == 'Date' && colValue) {
                const timeValue = formatDate(colValue, 'HH:mm:ss', this.locale);
                colValue = formatDate(
                  colValue,
                  'dd-MMM-yyyy' + (timeValue == '00:00:00' ? '' : ' HH:mm:ss'),
                  this.locale
                );
              }

            patchValues[field] = colValue;

            if (patchValues[field] == 'TBA') controlEnabled = false;
          } else {
            controlEnabled = false;
            patchValues[field] = null;
          }

          if (controlEnabled) {
            if (ctrl.disabled) ctrl.enable();
          } else {
            if (!ctrl.disabled) ctrl.disable();
          }
        }// end of if not in excludes

      } // end of for
    } else
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

    this.afterScatter.emit(this);
  }
}
