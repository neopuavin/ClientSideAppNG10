import { TblLookups } from './../../../svc/app.tables';
// import { FilterDataType } from './../../mod/app-common.classes';
import { IDataGridColumn } from './../data-grid/data-grid.component';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { ColumnInfo } from '../../mod/app-column.model';
import { IFilterOperator, FilterDataType } from '../../mod/app-common.classes';
import * as moment from 'moment/moment';

@Component({
  selector: 'app-filter-parameters',
  templateUrl: './filter-parameters.component.html',
  styleUrls: ['./filter-parameters.component.scss'],
})
export class FilterParametersComponent implements OnInit {
  @Input() dateFormat: string = 'DD-MMM-YYYY';
  @Input() dateTimeFormat: string = 'DD-MMM-YYYY, hh:mm:ss a';

  public selectedValues:Array<{severity:number, likelihood:number}> =[];

  public COMMON_TYPES: number =
    FilterDataType.TEXT | FilterDataType.DATE | FilterDataType.NUMBER;
  public TEXT_OR_NUMBER: number = FilterDataType.TEXT | FilterDataType.NUMBER;

  // available data
  // public aData: Array<any> = [
  //   new Date('2020-jan-2'),
  //   new Date('2020-jan-32'),
  //   new Date('2020-feb-17'),
  //   new Date('2020-mar-7'),
  //   new Date('2020-apr-9'),
  //   new Date('2019-may-8'),
  //   new Date('2019-aug-22'),
  //   new Date('2019-sep-16'),
  //   new Date('2019-nov-22'),
  // ];

  public aData: Array<any> = [
    '2020-jan-2',
    '2020-jan-32',
    '2020-feb-17',
    '2020-mar-7',
    '2020-apr-9',
    '2019-may-8',
    '2019-aug-22',
    '2019-sep-16',
    '2019-nov-22',
  ];


  private _dataType: number = null;
  public get dataType(): number {
    if (this._dataType == null) {
      const col = this.dataColumn;
      if (col) {
        if (col.filterType != undefined) {
          this._dataType = col.filterType;
        } else if (col.matrixData) {
          this._dataType = FilterDataType.MATRIX;
        } else {
          switch (this.ColumnType) {
            case 'string':
              this._dataType = FilterDataType.TEXT;
              break;
            case 'Date':
              this._dataType = FilterDataType.DATE;
              break;
            case 'number':
              this._dataType = FilterDataType.NUMBER;
              break;
            default:
              this._dataType = FilterDataType.TEXT;
          }
        }
      } else {
        this._dataType = FilterDataType.TEXT;
      }
    }
    return this._dataType;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<FilterParametersComponent>
  ) {}

  public get Lookups():any{
    return this.data ? this.data.sourceLookups : null;
  }

  public optrs: Array<IFilterOperator> = [
    {
      prmt: 'Equal To ...',
      optr: 'eq',
      apsw: this.COMMON_TYPES | FilterDataType.BOOLEAN | FilterDataType.ASSET,
    },
    {
      prmt: 'Not Equal To ...',
      optr: 'neq',
      apsw: this.COMMON_TYPES | FilterDataType.BOOLEAN | FilterDataType.ASSET,
    },
    // {
    //   prmt: 'In ...',
    //   optr: 'in',
    //   apsw: this.COMMON_TYPES | FilterDataType.ASSET,
    // },
    // {
    //   prmt: 'Not In ...',
    //   optr: 'nin',
    //   apsw: this.COMMON_TYPES | FilterDataType.ASSET,
    // },

    { prmt: 'Less Than ...', optr: 'lt', apsw: this.TEXT_OR_NUMBER },
    {
      prmt: 'Less Than or Equal To ...',
      optr: 'lte',
      apsw: this.TEXT_OR_NUMBER,
    },
    { prmt: 'Greater Than ...', optr: 'gt', apsw: this.TEXT_OR_NUMBER },
    {
      prmt: 'Greater Than or Equal To ...',
      optr: 'gte',
      apsw: this.TEXT_OR_NUMBER,
    },
    { prmt: 'Between ...', optr: 'btw', apsw: this.TEXT_OR_NUMBER },
    { prmt: 'Outside ...', optr: 'nbtw', apsw: this.TEXT_OR_NUMBER },

    { prmt: 'Before ...', optr: 'lt', apsw: FilterDataType.DATE },
    { prmt: 'On or Before ...', optr: 'lte', apsw: FilterDataType.DATE },
    { prmt: 'After ...', optr: 'gt', apsw: FilterDataType.DATE },
    { prmt: 'On or After ...', optr: 'gte', apsw: FilterDataType.DATE },
    { prmt: 'Within ...', optr: 'btw', apsw: FilterDataType.DATE },
    { prmt: 'Not Within ...', optr: 'nbtw', apsw: FilterDataType.DATE },

    { prmt: 'Contains ...', optr: 'lk', apsw: FilterDataType.TEXT },
    { prmt: 'Begins With ...', optr: 'bgw', apsw: FilterDataType.TEXT },
    { prmt: 'Ends With ...', optr: 'enw', apsw: FilterDataType.TEXT },
  ];

  private _validOperators: Array<IFilterOperator> = null;
  public get validOperators(): {} {
    if (this._validOperators == null) {
      let tmpValid: Array<IFilterOperator> = [];
      this.optrs.forEach((o) => {
        if (o.apsw & this.dataType) tmpValid.push(o);
      });
      this._validOperators = tmpValid;
    }
    return this._validOperators;
  }

  public formData: FormGroup = new FormGroup({
    searchValues: new FormArray([
      new FormControl(''),
      new FormControl(''),
      new FormControl(''),
    ]),
  });

  public columnData: Array<any> = [];

  ngOnInit(): void {
    this.formData.addControl('operatorValue', new FormControl('eq'));
    this.formData.addControl('operatorPrompt', new FormControl('Equal To'));
    this.formData.addControl('searchValue1', new FormControl(null));
    this.formData.addControl('searchValue2', new FormControl(null));
    this.formData.addControl('dateDisplay', new FormControl(null));
    this.formData.addControl('dateValue', new FormControl(null));
    this.formData.addControl('dateStart', new FormControl(null));
    this.formData.addControl('dateEnd', new FormControl(null));
    this.formData.addControl('search', new FormControl(null));

    this.testDateParse();

    console.log('DATA COLUMN:', this.dataColumn,"LOOKUPS:",this.Lookups);
  }

  testData: Array<any> = [
    { name: 'example1', date: '2011-01-01' },
    { name: 'example2', date: '2011-01-02' },
    { name: 'example3', date: '2011-02-02' },
    { name: 'example4', date: '2011-02-15' },
    { name: 'example5', date: '2011-02-17' },
    { name: 'example6', date: '2012-01-01' },
    { name: 'example7', date: '2012-03-03' },
  ];

  testDateParse() {
    this.testData.forEach((i) => {
      i.year = i.date.substr(0, 4);
      i.month = i.date.substr(5, 2);
      i.day = i.date.substr(8, 2);
    });
    const tmpArr = this.groupBy(this.testData, 'year');
    tmpArr.forEach((yr) => {
    });
  }

  operatorSelected(op: IFilterOperator) {
    this.formData.get('operatorValue').setValue(op.optr);
    this.formData.get('operatorPrompt').setValue(op.prmt);
    console.log(JSON.stringify(this.formData.value));
  }

  groupBy(
    arr,
    key,
    objLookup?,
    lookupKey?: string,
    lookupFields?: Array<string>,
    sortField?: string
  ): Array<object> {
    var newArr = [],
      types = {},
      newItem,
      i,
      j,
      cur;
    for (i = 0, j = arr.length; i < j; i++) {
      cur = arr[i];
      if (!(cur[key] in types)) {
        types[cur[key]] = { type: cur[key], data: [] };
        newArr.push(types[cur[key]]);
      }
      types[cur[key]].data.push(cur);
    }

    if (objLookup != undefined) {
      if (newArr) {
        newArr.forEach((item) => {
          let obj = objLookup.find(
            (lkpItem) => item['type'] == lkpItem[lookupKey ? lookupKey : 'id']
          );
          if (obj) {
            item['name'] = obj['name'] != undefined ? obj['name'] : 'unknown';
          } else {
            item['name'] = 'unknown';
          }
          if (lookupFields != undefined) {
            // attach all fields from the lookup item to the current item of the input array
            lookupFields.forEach((field) => {
              if (obj) {
                item[field] = obj[field];
              } else {
                item[field] = null;
              }
            });
          }
        });
      }
      if (sortField != undefined && this.sortBy != null) {
        this.sortBy(newArr, sortField);
      } else {
        this.sortBy(newArr, 'name');
      }
    } else {
      newArr.forEach((item) => {
        item['name'] = item['type'];
      });
    }

    return newArr;
  }

  sortBy(arr: Array<any>, key: string, desc?: boolean) {
    if (arr == undefined) return;

    if (desc == undefined) desc = false;

    if (desc) {
      arr.sort((a, b) => {
        return a[key] < b[key] ? 1 : b[key] < a[key] ? -1 : 0;
      });
    } else {
      arr.sort((a, b) => {
        return a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0;
      });
    }
  }

  public displayDate(fieldName: string, fieldName2?: string): string {
    const ctrl = this.formData.get(fieldName);
    if (!ctrl) return null;
    //return new Date(ctrl.value);
    if (!ctrl.value) return null;

    const dt = new Date(ctrl.value);
    const fmt =
      dt.getSeconds() != 0 || dt.getMinutes() != 0
        ? this.dateTimeFormat
        : this.dateFormat;

    let ret: string = moment(dt).format(fmt);

    if (fieldName2) {
      const ctrl2 = this.formData.get(fieldName2);
      if (ctrl2)
        if (ctrl2.value) {
          const dt2 = new Date(ctrl2.value);
          ret += ' to ' + moment(dt2).format(fmt);
        }
    }

    return ret;
  }

  public get isDate(): boolean {
    return this.dataType == FilterDataType.DATE;
  }

  public get isCommon(): boolean {
    const res: number = this.dataType & this.COMMON_TYPES;
    return res != 0;
  }

  public get isTextOrNumber(): boolean {
    const res: number = this.dataType & this.TEXT_OR_NUMBER;
    return res != 0;
  }

  public get operatorValue(): string {
    return this.getFormControlValue('operatorValue');
  }

  public get searchValues(): FormArray {
    return this.getFormControlValue('searchValues');
  }

  public get searchValue1(): any {
    return this.getFormControlValue('searchValue1');
  }
  public get searchValue2(): any {
    return this.getFormControlValue('searchValue2');
  }

  private getFormControlValue(controlName: string): any {
    const ctrl = this.formData.get(controlName);
    return ctrl ? ctrl.value : null;
  }

  public get withSecondValue(): boolean {
    const optr = this.formData.get('operatorValue');
    if (!optr) return false;
    return !this.isIn && (optr.value == 'btw' || optr.value == 'nbtw');
  }

  public get isIn(): boolean {
    const optr = this.formData.get('operatorValue');
    if (!optr) return false;
    return optr.value == 'in' || optr.value == 'nin';
  }

  private _columnCaption: string = null;
  public get columnCaption(): string {
    if (this._columnCaption != null) return this._columnCaption;
    this._columnCaption = '';

    if (this.dataColumn) this._columnCaption = this.dataColumn.caption;

    return this._columnCaption;
  }

  public get dataColumn(): IDataGridColumn {
    if (this.data) return this.data.column;
    return null;
  }

  private _columnFieldName: string = null;
  public get columnFieldName(): string {
    if (this._columnFieldName != null) return this._columnFieldName;
    this._columnFieldName = '';
    if (this.data) this._columnFieldName = this.data.column.fieldName;
    return this._columnFieldName;
  }

  private _ColumnType: string = null;
  public get ColumnType(): string {
    if (this._ColumnType != null) return this._ColumnType;

    this._ColumnType = 'unknown';

    if (!this.columnFieldName) return this._ColumnType;
    if (!this.data) return this._ColumnType;
    if (!this.data.table) return this._ColumnType;

    const col: ColumnInfo = this.data.table.columns.find(
      (c) => c.name == this.columnFieldName
    );
    if (col) this._ColumnType = col.type;

    return this._ColumnType;
  }

  public get filterExpression(): string {
    //const fmt="`{${this.dataColumn|${ret}|${this.}}`"

    //let ret:string = this.operatorValue;
    //return `{${this.dataColumn.fieldName|${this.operatorValue}|}`;

    let optr = this.operatorValue;

    let v1 = this.searchValue1;
    let v2 = this.searchValue2;

    if (optr == 'bgw') {
      optr = 'lk';
      v1 = v1 + '~';
    } else if (optr == 'enw') {
      optr = 'lk';
      v1 = '~' + v1;
    } else if (optr == 'lk') {
      v1 = '~' + v1 + '~';
    }

    return `{${this.dataColumn.fieldName}|${optr}|${v1}${
      optr == 'btw' || optr == 'nbtw' ? '^' + v2 : ''
    }}`;

    //${this.searchValues.value}
  }
}
