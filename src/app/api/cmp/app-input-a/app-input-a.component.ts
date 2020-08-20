import { FieldInfo } from './../../mod/app-column.model';
import { PanelAComponent } from './../panel-a/panel-a.component';
import { AppFormAComponent } from './../app-form-a/app-form-a.component';
import {
  Component,
  OnInit,
  Input,
  Inject,
  ElementRef,
  AfterViewInit,
  ViewChild,
  Output,
  EventEmitter,
  SimpleChange,
} from '@angular/core';
import { FormControl, FormGroup, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-app-input-a',
  templateUrl: './app-input-a.component.html',
  styleUrls: ['./app-input-a.component.scss'],
})
export class AppInputAComponent implements OnInit, AfterViewInit {
  @ViewChild('input') _input: ElementRef;
  input: HTMLElement;

  @Input() type: string = null;

  @Input() label: string = 'TextBox';
  @Input() height: number = -1;
  @Input() width: number = -1;

  @Input() labelWidth: number = -1;
  @Input() rows: number = -1;

  @Input() phBackSize: number = -1;
  @Input() phDuration: number = -1;

  @Input() fieldName: string = 'TBA';

  @Input() actionIcon: string = '';
  @Input() actionTip: string = null;
  @Output() actionClick: EventEmitter<any> = new EventEmitter();

  @Input() placeHolder: string = '';

  @Input() LPL: number = -1;
  @Input() LPR: number = -1;

  @Input() toggleDisplay: Array<string> = null;
  @Input() radioData: Array<any> = null;

  // expects {key1,value2,key2,value2,..,..,key#,value#},
  // where key# is the actual value of the field and value is the display text
  // used as option text or input text
  @Input() lookupSource: any = null;

  @Input() lookupTable: any = null;
  @Input() lookupValue: string = null;
  @Input() lookupDisplay: string = null;
  @Input() lookupGroup: number = null;

  @Input() readOnly: boolean;

  public get phBackSizeSelf(): number {
    if (this.phBackSize != -1) return this.phBackSize;
    if (this.form.phBackSize != -1) return this.form.phBackSize;
    return 400; // default if at neither at form level nor input level is set
  }
  public get phDurationSelf(): number {
    if (this.phDuration != -1) return this.phDuration;
    if (this.form.phDuration != -1) return this.form.phDuration;
    return 4; // default if at neither at form level nor input level is set
  }

  private fieldLookupProcessed: boolean = false;
  private fieldLookupRequested: boolean = false;
  public get fieldLookup(): any {
    if (this.lookupSource) return this.lookupSource;

    const tbl = this.lookupTable;

    if (!tbl && !this.lookupGroup && !this.lookupValue && !this.lookupDisplay)
      return null;

    if (tbl && !this.fieldLookupProcessed) {
      if (!this.fieldLookupProcessed) {
        let rows: Array<any> = [];
        if (!this.fieldLookupRequested) {
          if (this.lookupGroup) {
            rows = tbl.GetRowsByGroup({
              key: this.lookupGroup,
              onSuccess: (e) => {
                rows = e.processed.data;
              },
            });
          } else {
            rows = tbl.GetRows();
            if (rows.length == 0) {
              tbl.Get({
                code: tbl.tableCode,
                includedFields: this.lookupValue + '`' + this.lookupDisplay,
                onSuccess: (e) => {
                  rows = e.processed.data;
                },
              });
            } else {
              //
            }
          }
        }
        if (rows.length != 0) {
          this.lookupSource = [];
          rows.forEach((r) => {
            this.lookupSource.push({
              key: r[this.lookupValue],
              text: r[this.lookupDisplay],
            });
          });
          this.fieldLookupProcessed = true;
        }
      }
    }
    return this.fieldLookupProcessed && this.lookupSource
      ? this.lookupSource
      : [];
  }

  get LabelWidth(): number {
    if (this.labelWidth != -1) return this.labelWidth;
    //return this.panel.labelWidth;
    return this.panel.LabelWidth;
  }
  get labelPaddingLeft(): number {
    if (this.LPL != -1) return this.LPL;
    if (this.panel.LPL != -1) return this.panel.LPL;
    return 0;
  }

  get labelPaddingRight(): number {
    if (this.LPR != -1) return this.LPR;
    if (this.panel.LPR != -1) return this.panel.LPR;
    return 0;
  }

  constructor(
    @Inject(AppFormAComponent) public form: AppFormAComponent,
    @Inject(PanelAComponent) public panel: PanelAComponent
  ) {}

  private _isReady: boolean = false;
  private _changeValueNow: boolean = false;

  ngOnInit(): void {
    if (!this.fieldName || !this.form.formObject) return;

    this.form.RegisterField(this.fieldName);

    // let control: any = this.form.formObject.get(this.fieldName);
    // if (!control) {
    //   // if control is not yet part of the form
    //   const colVal = this.sourceRow ? this.sourceRow[this.fieldName] : null;

    //   // register field as with initialized value when sourceRow is available
    //   // this is a must to prevent reinitialization when Scatter method is called
    //   if (this.sourceRow) this.MarkAsInitialized();

    //   control = new FormControl(colVal);
    //   this.form.formObject.addControl(this.fieldName, control);
    // } else {
    //   // control has previously been created
    //   // console.log(this.fieldName,"Previously initialized!")
    //   this.MarkAsInitialized();
    // }


  }

  ngAfterViewInit() {
    //console.log("readOnly:",this.form.readOnly,this.readOnly);
    // if (this._input) {
    //   const formObj = this.form.formObject;
    //   const ctrl = formObj.get(this.fieldName);
    // }
    setTimeout(() => (this._changeValueNow = true), 0);
    setTimeout(() => (this._isReady = true), 2000);
  }

  public get sourceRow(): any {
    if (!this.form) return null;
    if (!this.form.sourceRow) return null;
    return this.form.sourceRow;
  }

  public get background(): string {
    if (!this._changeValueNow) return null;
    if (this.isDisabled) return null;
    return 'white';
  }

  public get isDisabled(): boolean {
    if (!this.form.formObject) return true;
    const ctrl = this.form.formObject.get(this.fieldName);
    if (!ctrl) return true;
    return ctrl.disabled;
  }

  public get isReadOnly(): boolean {
    // let elem: HTMLElement = this._input.nativeElement;
    // if(elem){
    //   elem.style.background = 'red';
    // }

    //console.log("control disabled:",this.form.formObject.get(this.fieldName).disabled);

    if (this.readOnly != undefined) return this.readOnly;
    if (this.form.readOnly != undefined) return this.form.readOnly;
    return false;
  }

  public get controlHeight(): number {
    if (this.height != -1) return this.height;
    return this.form.controlHeight;
  }

  public get inputWidth(): number {
    let ret: number = null;
    if (this.width != -1) ret = this.width;
    if (this.panel.inputWidth != -1) ret = this.panel.inputWidth;
    if (ret != null && this.actionIcon) {
      // ret -= 25;
    }
    return ret;
  }

  public get Rows(): number {
    // number of text rows the input control will display
    if (this.rows != -1) return this.rows;
    return 1;
  }

  public get isInput(): boolean {
    if (!this.fieldName) return false;
    return (
      this.Rows == 1 &&
      !this.isSelect &&
      !this.isToggle &&
      !this.isCheck &&
      !this.isRadio &&
      !this.isDate
    );
  }

  public get isSelect(): boolean {
    if (!this.fieldName) return false;
    return this.Rows == 1 && this.fieldLookup;
  }

  public get isMemo(): boolean {
    if (!this.fieldName) return false;
    return this.Rows != 1 && !this.fieldLookup;
  }

  public get isToggle(): boolean {
    if (!this.toggleDisplay) return false;
    const tLen = this.toggleDisplay.length;
    return tLen == 2 || tLen == 3;
  }

  public selectColor(value?: number): { fore: string; back: string } {
    let ret: any = { fore: null, back: null };
    if (!this.lookupSource) return ret;
    if (this.lookupSource.length == 0) return ret;

    const lkpValue = value == undefined ? this.getFormControl.value : value;
    if (!lkpValue) return ret;

    const lkp = this.lookupSource.find((e) => e.key == lkpValue);
    if (lkp) ret = { fore: lkp.fore, back: lkp.back };

    return ret;
  }

  public get isCheck(): boolean {
    if (!this.toggleDisplay) return false;
    return this.toggleDisplay.length == 0;
  }

  public get isRadio(): boolean {
    if (!this.radioData) return false;
    if (this.radioData.length < 2) return false;
    return true;
  }

  private _isDate: any = undefined;
  public get isDate(): boolean {
    if (this._isDate != undefined) return this._isDate;

    this._isDate = false;

    if (this.type == 'date') {
      this._isDate = true;
      return true;
    }

    const row = this.form.sourceRow;
    if (!row) return false;

    const tbl = row.parentTable;
    if (!tbl) return false;

    const cols = tbl.columns;
    if (!cols) return false;

    const col = cols.find((c) => c.name == this.fieldName);
    if (!col) return false;

    this._isDate = col.type == 'Date';
    return this._isDate;
  }

  public get isDataLoading(): boolean {
    return this.form.isDataLoading;
  }

  public get getFormControl(): AbstractControl {
    const formObj = this.form.formObject;
    if (!formObj) return null;
    const ctrl = formObj.get(this.fieldName);
    return ctrl;
  }

  public get displayValue(): string {
    if (!this._changeValueNow) return null;

    const ctrl = this.getFormControl;
    if (!ctrl) return '';
    if (this.isToggle) {
      //console.log("this.getFormControl:",ctrl,ctrl.value);
      switch (ctrl.value) {
        case -1:
          return this.toggleDisplay[0];
        case 0:
          return this.toggleDisplay[1];
        default:
          return '';
      }
    } else {
      if (this.fieldLookup) {
        const lkpItem = this.fieldLookup.find((i) => i.key == ctrl.value);
        if (lkpItem) return lkpItem.text;
      }
      return ctrl.value;
    }
    return '';
  }

  MarkAsNotInitialized() {
    const index = this.form.fieldsInitialized.indexOf(this.fieldName);
    if (index != -1) this.form.fieldsInitialized.splice(index, 1);
  }
  MarkAsInitialized() {
    const index = this.form.fieldsInitialized.indexOf(this.fieldName);
    if (index == -1) this.form.fieldsInitialized.push(this.fieldName);
  }

  ActionClick(e: any) {
    this.actionClick.emit({ e: e, source: this });
  }
}
