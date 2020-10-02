import { PanelAComponent } from './../panel-a/panel-a.component';
import { AppFormAComponent } from './../app-form-a/app-form-a.component';
import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormControl,  AbstractControl } from '@angular/forms';

@Component({
  template: ''
})

export abstract class InputCommon {
  @ViewChild('input') _input: ElementRef;
  input: HTMLElement;

  @Input() testProperty:any;
  @Input() data:any;


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


  constructor() {}

  public get form():any{
    return this.data.form;
  }

  public get panel():any{
    return this.data.panel;
  }


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


  private _changeValueNow:boolean = false;
  ngAfterViewInit() {
    setTimeout(()=>this._changeValueNow=true,0);
  }

  ngOnInit(): void {
    if (!this.fieldName || !this.form.formObject) return;

    let row: any = this.form.sourceRow;

    try {
      this.form.formObject.addControl(this.fieldName, new FormControl(null));
    } catch (e) {
      console.log('Error:', e.message);
    }
  }

  public get background(): string {
    if(!this._changeValueNow)return null;
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

  public get isDataLoading(): boolean {
    return this.form.isDataLoading;
  }

  public get getFormControl(): AbstractControl {
    const formObj = this.form.formObject;
    if (!formObj) return null;
    const ctrl = formObj.get(this.fieldName);
    return ctrl;
  }


  ActionClick(e: any) {
    this.actionClick.emit({ e: e, source: this });
  }
}
