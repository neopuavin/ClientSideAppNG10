import { DataGridColMgtComponent } from './data-grid-col-mgt.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import * as moment from 'moment/moment';
import { AppDataset } from './../../../svc/app-dataset.service';
import {
  DataColumn,
  IDataColumn,
  DataOption,
} from './../../mod/app-common.classes';
import { ILookupParams, IColorParams } from '../../mod/app-params.model';
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Data } from '@angular/router';

@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.scss'],
})
export class DataGridComponent implements OnInit, AfterViewInit, OnDestroy {
  @HostListener('window:resize', ['$event']) handleResize(event: any) {
    // simply adding this event declaration, triggers recalculation of column widths
    // when the browser window is resized!
    // a method can also be called within this event handler...
    // this.RefreshGridDisplay();
  }

  // object with 'rows' property which is an array of object!
  @Input() sourceTable: any = null;
  @Input() sourceRows: any = null;
  @Input() sourceLookups: any = null;

  @Input() showMenu: boolean = false;
  @Input() ManagmentOpener: any = null;

  @Input() set currentRow(value: any) {
    const keyName = this.options.keyColumnName;
    if (keyName) {
      const keyVal = value[keyName];
      if (keyVal) {
        let focusElement: any = document.querySelector('#row_focus_' + keyVal);
        if (!focusElement) {
          setTimeout(() => {
            focusElement = document.querySelector('#row_focus_' + keyVal);
            // console.log("Currentrow:",keyName,keyVal,"Focus Element(retry):",focusElement,this.sourceRows);
            if (focusElement) {
              focusElement.focus();
              this.rowClick.emit({ row: value, e: null });
            }
          }, 100);
        } else {
          focusElement.focus();
          this.rowClick.emit({ row: value, e: null });
          // console.log("Currentrow:",keyName,keyVal,"Focus Element(orig):",focusElement,this.sourceRows);
        }
      }
    }
    /**    const focusElement = event.srcElement.parentNode.querySelector('.row-focus');
    if(focusElement)focusElement.focus();
 */
    this._currentRow = value;
  }

  public get keyColumnName(): string {
    return this.options.keyColumnName;
  }

  private _options: DataGridOption = null;
  @Input() set options(value: DataGridOption) {
    this._options = value;
  }

  get options(): DataGridOption {
    return this._options;
  }

  @Input() pageNumber: number = -1;
  @Input() pageSize: number = -1;
  @Input() totalPages: number = -1;
  @Input() totalRecords: number = -1;

  @Input() isLoadingData: boolean = false;
  @Input() promptLoadingData: string = 'Loading...';

  @Input() isRowWaiting: boolean = false;

  @Input() dateFormat: string = 'DD-MMM-YYYY';
  @Input() dateTimeFormat: string = 'DD-MMM-YYYY, hh:mm:ss a';

  @Input() promptNoRecords: string = 'No record(s) found.';
  @Input() promptRefresh: string = 'Refreshing display.';

  @Output() pageClick: EventEmitter<any> = new EventEmitter();
  @Output() pageSizeChange: EventEmitter<any> = new EventEmitter();

  @Output() rowClick: EventEmitter<any> = new EventEmitter();
  @Output() onColumnsChanged: EventEmitter<any> = new EventEmitter();

  @ViewChild('gridViewPort') gridViewPort: CdkVirtualScrollViewport;
  @ViewChild('gridViewPort') gridViewPortElem: any;
  @ViewChild('gridHeader') gridHeaderObj: any;
  @ViewChild('gridHeaderWidthGuide') gridHeaderGuideObj: any;
  @ViewChild('rowHeader') rowHeader: any;

  gridHeaderGuide: HTMLElement = null;
  gridHeader: HTMLElement = null;

  public cellTip: string = null;

  constructor(public dialog: MatDialog) {}

  private _changeValuesNow: boolean = false;
  ngAfterViewInit() {
    setTimeout(() => {
      this.gridHeader = this.gridHeaderObj.nativeElement;
      this.gridHeaderGuide = this.gridHeaderGuideObj.nativeElement;

      this.gridViewPort.elementRef.nativeElement.addEventListener(
        'scroll',
        (e: any) => {
          this._leftScrollOffset = -e.srcElement.scrollLeft;
        }
      );

      console.log('Set SCROLL EVENT!');

      setTimeout(() => (this._changeValuesNow = true), 12);
    }, 10);
  }

  ngOnDestroy() {
    return;
    this.gridViewPort.elementRef.nativeElement.removeEventListener(
      'scroll',
      () => {}
    );
  }

  ngOnInit() {
    //return;
    this.InitDataSource();

    // setTimeout(()=>{
    //   this._isReady = true;
    // },100);

    //    console.log("this.pagesArray",this.pagesArray);
  }

  PageClick(event: any, page: number) {
    this.pageClick.emit({ page: page, e: event });
  }

  AcceptColumnSetup(fieldsArray: Array<string>) {
    // check if set of fields selected were part of the original (SetupData is called)
    // set of visible fields. if not onColumnsChanged must be fired!

    this.options.ShowColumns(fieldsArray)

    if(this.options.columnsDataNotAvailable){
      this.onColumnsChanged.emit();
      //this.options.RecordExtractedDataFieldnames();
    }

    return;
    //RecordExtractedDataFieldnames

    const visible = this.options.visibleColumns;
    let changed: boolean = visible.length != fieldsArray.length;

    if (!changed) {
      // for(let col in visible){
      //   if(fieldsArray.indexOf(col.fieldName)==-1){
      //   }
      // }
      // visible.forEach((col) => {
      //   if(fieldsArray.indexOf(col.fieldName)==-1){
      //     changed = true;
      //     break;
      //   }
      // });
    }
    if (changed) this.onColumnsChanged.emit();
  }

  PageSizeChange(event: any) {
    //this.pageSize
    this.pageSizeChange.emit({ pageSize: +event.srcElement.value, e: event });
  }

  PageNum(p): string {
    if (p == -1) return '...';
    return String(p + 1);
  }

  KeyUp(evt: any, row: any) {
    if (!row) return;

    const rowIndex = this.sourceRows.indexOf(row);

    // current row is the first or the last record of the sourceRows
    switch (evt.code) {
      case 'ArrowUp':
        if (rowIndex == 0) return;
        this.currentRow = this.sourceRows[rowIndex - 1];
        break;
      case 'ArrowDown':
        if (rowIndex == this.sourceRows.length - 1) return;
        this.currentRow = this.sourceRows[rowIndex + 1];
        break;
      default:
    }

    //this.currentRow = this.sourceRows[]
  }

  ManageGrid(event: any) {
    this.OpenPopup(500, 523, false, {
      parent: this,

      // Dialog title
      title: 'Manage Data Grid Columns',
      // dialog title icon
      icon: 'fa-table',
      // dialog action buttons
      buttons: [
        {
          label: 'Cancel',
          toolTip: 'Ignore changes and close',
          value: 'cancel',
          class: 'btn btn-sm btn-secondary',
        },
        {
          label: 'Reset',
          toolTip: 'Revert back to original setting',
          value: 'reset',
          class: 'btn btn-sm btn-secondary',
        },
        {
          label: 'Accept',
          toolTip: 'Accept new grid column setting',
          value: 'accept',
          class: 'btn btn-sm btn-warning',
        },
      ],
    }).subscribe((result) => {
      console.log('Result:', result);
      if (!result) return;
      if (result.mode == 'accept') {
        // accept mode result comes with fields return parameter
        this.AcceptColumnSetup(result.fields);
      }
    });
  }

  OpenPopup(
    width?: number,
    height?: number,
    disableClose?: boolean,
    data?: {}
  ): Observable<any> {
    if (!width) width = 300;
    if (!height) height = 200;
    if (!disableClose) disableClose = false;

    if (!data) data = {};
    let ref: MatDialogRef<DataGridColMgtComponent, any>;
    data['ref'] = ref;

    ref = this.dialog.open(DataGridColMgtComponent, {
      minWidth: `${width}px`,
      minHeight: `${height}px`,
      disableClose: disableClose,
      data: data,
    });

    return ref.afterClosed();

    // dialogRef.afterClosed().subscribe((result) => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }

  private _isReady: boolean = true;
  public get isReady() {
    return this._isReady;
  }

  public get isWithVisibleColumns(): boolean {
    if (!this.options) return false;
    if (!this.options.visibleColumns) return false;
    return true;
  }

  private _currentRow: any = null;
  public RowClick(event: any, row: any) {
    this.currentRow = row;
  }

  public get headerHeight(): number {
    if (!this._changeValuesNow) return 0;
    return this.options.rowHeaderHeight + 1;
  }
  public get rowHeaderHeight(): number {
    if (!this._changeValuesNow) return 0;
    return this.options.rowHeaderHeight;
  }

  public RowClass(row: any) {
    return {
      'current-row': this.isCurrRow(row),
    };
  }

  public get pageArray(): Array<number> {
    return this.pagesArray;
  }

  public get pagesArray(): Array<number> {
    if (this.totalPages <= 0 || !this.totalPages) return [];

    const totalPx = 500;
    const pageButtonPx = 20;
    const pages = this.totalPages;
    const pg = this.pageNumber;

    const maxButtons = parseInt(String(totalPx / pageButtonPx));

    if (maxButtons > pages) return Array.from(Array(pages).keys());

    // 1,seg3,...,seg3,pg,seg3,pages  => pg+seg3+1 >= pages
    // 1,seg3,pg,seg3,...,seg3,pages  => pg-seg3-1 <= 1
    const seg3 = parseInt(String((maxButtons - 2) / 3));

    // 1,seg4,...,seg4,pg,seg4,...,seg4,pages
    const seg4 = parseInt(String((maxButtons - 3) / 4));

    let marker: number;
    let arr: Array<number> = [];
    if (pg + seg3 + 1 >= pages) {
      arr = Array.from(Array(seg3).keys());
      arr.push(-1);
      marker = pg - seg3;
      for (let idx = marker; idx < pages; idx++) arr.push(idx);
    } else if (pg - seg3 - 1 <= 1) {
      arr = Array.from(Array(pg + seg3).keys());
      arr.push(-1);
      marker = pages - seg3;
      for (let idx = marker; idx < pages; idx++) arr.push(idx);
    } else {
      arr = Array.from(Array(seg4).keys());
      arr.push(-1);
      marker = pg - seg4;
      for (let idx = marker; idx < pg + seg4; idx++) arr.push(idx);
      arr.push(-1);
      marker = pages - seg4;
      for (let idx = marker; idx < pages; idx++) arr.push(idx);
    }

    return arr;
  }

  private _dataSource: Array<any> = [];
  public lastDataSourceUpdatTime: number = 0;

  InitDataSource(): void {
    if (this.sourceTable && this.options != null) {
      this.options.columns.forEach((c: DataGridColum) => {
        // map captions

        if (c.caption == '') {
          // when caption is not manually supplied
          const col = this.sourceTable.GetColumnInfo(c.fieldName);
          if (col) c.caption = col.caption ? col.caption : c.fieldName;
        }
      });
    }
  }

  private _leftScrollOffset: number = 0;
  public get leftScrollOffset(): number {
    if (!this._changeValuesNow) return 0;
    return this._leftScrollOffset;
  }

  public get barMenuLeft(): number {
    return this.rowHeader.nativeElement.offsetLeft;
  }

  private _processed: boolean = false;
  private _tmpArr: Array<any> = [];
  public ret: Array<any> = [];

  public get isPaging(): boolean {
    //return this.totalRecords > 0;
    return this.pageArray.length > 0;
    //return true;
  }

  private get SourceRows(): Array<any> {
    // if source rows is specified, use this as the data grid source
    if (this.sourceRows) return this.sourceRows;

    // otherwise use sourceTable.rows property
    if (this.sourceTable) {
      return this.sourceTable.rows;
    } else {
      return [];
    }
  }

  Refresh() {
    // Refresh data grid source

    // set flag to make sure that the
    // UI does not repeatedly refresh while the
    // _dataSource array is being populated
    this._sourceProcessing = true;

    // reset current row
    this._currentRow = null;

    setTimeout(() => {
      // initialize _dataSource array
      this._dataSource = [];
      // populate _dataSource array with data from
      // source data collection
      this.SourceRows.forEach((r) => {
        this._dataSource.push(r);
      });
      // turn off source processing flag to
      // finally display the requested data
      this._sourceProcessing = false;
    }, 10);
  }

  RefreshGridDisplay() {
    // console.log("Rsizing!");
  }

  private _sourceProcessing: boolean = false;
  public get isRefreshing(): boolean {
    return this._sourceProcessing;
  }
  public get isNoRecord(): boolean {
    return this._dataSource.length == 0 && !this.isRefreshing;
  }

  public get dataSource(): Array<any> {
    if (this._sourceProcessing || this.isLoadingData) return [];
    return this._dataSource;
  }

  public get recordStatus(): string {
    return (
      'Displaying ' +
      (this.pageSize * (this.pageNumber - 1) + 1) +
      ' to ' +
      Math.min(this.pageSize * this.pageNumber, this.totalRecords) +
      ' of ' +
      this.totalRecords +
      ' record' +
      (this.totalRecords > 1 ? '(s)' : '')
    );
  }

  // public setDataSource() {
  //   console.log('SET DATA SOURCE');
  //   return;
  //   this._dataSource = this.ds.GetTableSnapShot(this.sourceTable);
  // }

  //GetTableSnapShot
  public headerWidth(
    c: DataGridColum,
    args?: { min?: boolean; max?: boolean }
  ): number {
    if (c.width == -1) {
      if (!args) return 123;
      if (!c.minWidth && !c.maxWidth) return null;
      if (args.max) return c.maxWidth ? c.maxWidth : null;
      if (args.min) return c.minWidth ? c.minWidth : null;
      return null;
    }
    return c.width;
  }
  public cellWidth(c: DataGridColum, idx: number): number {
    if (this.gridHeaderGuide) {
      const cells = this.gridHeaderGuide.querySelectorAll('div');
      return cells[idx + 1].offsetWidth;
    }
    return c.width;
  }

  public cellStyle(c: DataGridColum): any {
    if (c.width == -1) return null;
    return null;
  }

  public cellClass(c: DataGridColum): any {
    if (c.width == -1) return null;
    return null;
  }

  public cellColor(r: any, c: DataGridColum): any {
    if (!c.colorParams) return null;
    if (!c.colorParams.foreGround) return null;

    const value = r[c.fieldName];
    //const key = isNaN(value) ? value : 'v' + value;
    //const key = isNaN(value) ? value : 'v' + value;
    const color = c.colorParams.foreGround[value];
    return !color ? null : color;
  }
  public cellBack(r: any, c: DataGridColum): any {
    if (!c.colorParams) return null;
    if (!c.colorParams.backGround) return null;

    const value = r[c.fieldName];
    //const key = isNaN(value) ? value : 'v' + value;
    const color = c.colorParams.backGround[value];
    return !color ? null : color;
  }

  public cellText(r: any, c: DataGridColum): string {
    // NOTE: If this will affect the performance of the grid because of resolving lookups,
    // first time display lookup result can be stored in a collection inside the
    // row object and can be subsequently used to render text instead of actively
    // going through the process of looking up texts.

    const value = r[c.fieldName];

    // return value;

    if (c.displayField && this.sourceLookups[c.displayField]) {
      // if sourceLookups and displayField are defined
      // sourceLookups - set of inline lookups
      // where groupname is displayField and value is the item key

      return this.sourceLookups[c.displayField][value];
    }
    // if sourceLookups is not defined, the value will still have the
    // raw field value

    // if lookup params parameter is not defined, return the raw value
    if (!c.lookupParams) {
      // here is where the raw value will fall if no lookup parameters is deifned
      // check if field is a date
      if (c.dateFormat && value) {
        const isDefault = c.dateFormat == 'default';
        const dt = new Date(value);
        const fmt =
          dt.getMinutes() != 0 || dt.getSeconds() != 0
            ? isDefault
              ? this.dateTimeFormat
              : c.dateFormat
            : isDefault
            ? this.dateFormat
            : c.dateFormat;

        return moment(dt).format(fmt);
      }

      if (c.noZero && !isNaN(value)) {
        return +value != 0 ? value : '';
      }

      return value;
    }

    // if value is empty
    if ((value + '').length == 0) return '';

    // get lookup definition parameters
    const lkpPrm = c.lookupParams;

    if (lkpPrm.lookupSource) {
      // if array of objects is supplied as lookupSource
      const lkpElem = lkpPrm.lookupSource.find((e) => e.value == value);
      return lkpElem ? lkpElem.display : lkpPrm.notFoundDislay;
    } else if (lkpPrm.formXTRA) {
      // if display value is taken from a field in the row's XTRA property
      return r.XTRA[lkpPrm.formXTRA];
    } else if (lkpPrm.toggleDisplay) {
      // if display value will be taken from a string array
      const tgl = lkpPrm.toggleDisplay.find((t) => t.value == value);
      return tgl ? tgl.display : value;
    }

    // get lookup table object
    const tbl = c.lookupParams.table;

    let dispVal: any = tbl.LookupText(
      value,
      lkpPrm.displayField,
      lkpPrm.groupValue,
      lkpPrm.groupField,
      lkpPrm.notFoundDislay
    );

    if (lkpPrm.subLookupParams) {
      const stbl = lkpPrm.subLookupParams.table;
      dispVal = stbl.LookupText(
        dispVal,
        lkpPrm.subLookupParams.displayField,
        lkpPrm.subLookupParams.groupValue,
        lkpPrm.subLookupParams.groupField,
        lkpPrm.notFoundDislay
      );
    }

    //return dispVal + (lkpPrm.subLookupParams ? " " + dispVal  : " xx ");

    return dispVal;
  }

  OnCellMouse(event: any, row: any, cell: DataColumn) {
    const eType = event.type;
    const target = event.srcElement;
    if (eType == 'mouseenter') {
      if (target) {
        if (target.scrollWidth > target.offsetWidth)
          this.cellTip = target.innerHTML;
      } else {
        this.cellTip = null;
      }
      //console.log(target.scrollWidth,target.offsetWidth,target.innerHTML);
    } else if (eType == 'mouseleave') {
      this.cellTip = null;
    }
  }

  isCurrPage(page: number): boolean {
    return page == this.pageNumber;
  }

  isCurrRow(row: any): boolean {
    const key = this.keyColumnName;
    if (!key) return false;
    if (!this._currentRow) return false;
    return this._currentRow[key] == row[key];
  }

  public get headerPadWidth(): number {
    // this can return a calculated field based on the
    // overflow status of the grid virtual scroll container
    return 17;
  }

  public get RowHeaderWidth(): number {
    if (!this._changeValuesNow) return 6;

    if (this.options.rowHeaderWidth != undefined) {
      return this.options.rowHeaderWidth;
    } else {
      return this.options.rowHeaderHeight * 0.9;
    }
  }

  public setValueTo(trueValue: any, defaultValue: any) {
    if (!this._changeValuesNow) return defaultValue;
    return trueValue;
  }

  // Events START **************************************************************************
}

export enum CellTextAlign {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
}

export interface IDataGridColumn extends IDataColumn {
  isKey?: boolean;
  width?: number;
  align?: string;
  minWidth?: number;
  maxWidth?: number;
  fromLookup?: boolean;
  colorParams?: IColorParams;
  lookupParams?: ILookupParams;
  dateFormat?: string;
  noZero?: boolean;
  order?: number;
}

export class DataGridColum extends DataColumn {
  constructor(args: IDataGridColumn) {
    super(args);

    this.width = args.width ? args.width : -1;
    this.minWidth = args.minWidth;
    this.maxWidth = args.maxWidth;
    this.align = args.align ? args.align : 'left';
    this.lookupParams = args.lookupParams;
    this.colorParams = args.colorParams;
    this.isKey = args.isKey;
    this.visible = args.visible;
    this.dateFormat = args.dateFormat;
    this.noZero = args.noZero;
    this.order = args.order ? args.order : 1;
  }

  public isKey: boolean = true;
  public visible: boolean = true;
  public frozen: boolean = false;
  public align: string;
  public minWidth: number;
  public maxWidth: number;
  public width: number;
  public dateFormat: string;
  public noZero: boolean;
  public order: number;
  public colorParams: IColorParams;
  public lookupParams: ILookupParams;
}

export class DataGridOption extends DataOption {
  constructor(
    public columns: Array<DataGridColum>,
    args?: { rowHeight?: number; table?: any; dataSource?: AppDataset }
  ) {
    super(columns, args);

    if (args != undefined) {
      // set other properties
      if (args.rowHeight != undefined) this.rowHeight = args.rowHeight;
    }
  }

  public rowHeaderHeight: number = 26;
  public rowHeight: number = 20;
  public rowHeaderWidth: number = undefined;
  public noFooter: boolean = false;
  public keyColumnName: string = '';

  private _requiredFields: Array<string> = [];

  public SetKeyColumnName(value: string): DataGridOption {
    this.keyColumnName = value;

    // include key field as required field to be extracted from the database
    if (this._requiredFields.indexOf(value) == -1)
      this._requiredFields.push(value);

    return this;
  }

  public AddRequiredDataFields(fieldNames: Array<string>): DataGridOption {
    if (fieldNames) {
      fieldNames.forEach((f) => {
        if (this._requiredFields.indexOf(f) == -1) this._requiredFields.push(f);
      });
    }
    console.log('this._requiredFields:', this._requiredFields);
    return this;
  }

  public RowHeight(rowHeight: number): DataGridOption {
    this.rowHeight = rowHeight;
    return this;
  }

  public SetRowHeaderHeight(value: number): DataGridOption {
    this.rowHeaderHeight = value;
    return this;
  }

  public SetRowHeaderWidth(value: number): DataGridOption {
    this.rowHeaderWidth = value;
    return this;
  }

  public get NoFooter(): DataGridOption {
    this.noFooter = true;
    return this;
  }

  public get WithFooter(): DataGridOption {
    this.noFooter = false;
    return this;
  }

  public SetColumnVisibility(column: DataGridColum, visible: boolean) {
    // Sets visibility mode of a column and its matching data and inline lookup fields
    column.visible = visible;
    // check field and if exist set the field's visible property to false
    const fld = this.fields.find((f) => f.fieldName == column.fieldName);
    if (fld) {
      if (!visible) {
        if (this._requiredFields.indexOf(fld.fieldName) == -1)
          fld.visible = false;
      } else {
        fld.visible = true;
      }
    }

    const lkp = column.lookupParams;
    if (lkp && column.displayField) {
      // check if an inline lookup is defined
      if (lkp.inlineLookupFieldAlias) {
        const lkpFld = this.fields.find(
          (f) => f.fieldAlias == column.displayField
        );
        if (lkpFld) {
          if (!visible) {
            if (this._requiredFields.indexOf(lkpFld.fieldAlias) == -1)
              lkpFld.visible = false;
          } else {
            lkpFld.visible = true;
          }
        }
      }
    }
  }

  public HideColumns(
    columnNames: Array<string>,
    hideOnly?: boolean
  ): DataGridOption {
    if (hideOnly == undefined) hideOnly = true;
    if (hideOnly)
      this.columns.forEach((c) => this.SetColumnVisibility(c, true));

    columnNames.forEach((cn) => {
      const col = this.columns.find((c) => c.fieldName == cn);
      if (col) this.SetColumnVisibility(col, false);
    });

    this._visibleColumns = null;
    return this;
  }

  public ShowColumns(
    columnNames: Array<string>,
    showOnly?: boolean
  ): DataGridOption {
    if (showOnly == undefined) showOnly = true;

    if (showOnly)
      this.columns.forEach((c) => this.SetColumnVisibility(c, false));

    let order: number = 1;
    columnNames.forEach((cn) => {
      const col = this.columns.find((c) => c.fieldName == cn);
      if (col) {
        this.SetColumnVisibility(col, true);
        col.order = order;
        order++;
      }
    });

    this._visibleColumns = null;
    return this;
  }

  private _visibleColumns: Array<DataGridColum> = null;
  public get visibleColumns(): Array<DataGridColum> {
    //return
    if (!this._visibleColumns) {
      this._visibleColumns = this.columns.filter((c) => c.visible); //.sort((a,b)=>{return b.order<a.order});
      this._visibleColumns.sort((a, b) => a.order - b.order);
    }
    return this._visibleColumns;
  }

  private _extractedColumns:Array<string>=[];
  public get columnsDataNotAvailable():boolean{
    // this is to check if data on visible columns were all included in the last data extraction
    let missingData:boolean = false;
    const visible  = this.visibleColumns;
    for(let idx=0;idx < visible.length ; idx++){
      if(this._extractedColumns.indexOf(visible[idx].fieldName)==-1){
        missingData = true;
        break;
      }
    }
    return missingData;
  }

  public RecordExtractedDataFieldnames(){
    this._extractedColumns = [];
    this.visibleColumns.forEach(col=>{
      this._extractedColumns.push(col.fieldName);
    })
  }

  public AddColumn(args: IDataGridColumn): DataGridOption {
    if (args.visible == undefined) args.visible = true;

    // create column entry
    const col = new DataGridColum(args);
    col.parentOption = this;
    col.order = this.columns.length;
    this.columns.push(col);

    let displayField = args.displayField;

    // check if lookup parameter exist
    const lkp = args.lookupParams;
    if (lkp) {
      // if display field is not defined at the colum root parameter
      if (!displayField) displayField = lkp.inlineLookupFieldAlias;
      // if inline lookup definition is complete
      if (
        lkp.inlineLookupTableAlias &&
        lkp.inlineLookupTableField &&
        displayField
      ) {
        // only define a lookup field if all inline lookup parameters are present
        this.AddFieldWithOptions({
          fieldName: lkp.inlineLookupTableField,
          fieldAlias: displayField,
          tableAlias: lkp.inlineLookupTableAlias,
          forLookup: true,
        });
      }
    }

    // create field entry based on parameter(s) supplied for the grid column
    let fldOpt: IDataColumn = { fieldName: args.fieldName };
    if (displayField) fldOpt.displayField = displayField;
    this.AddFieldWithOptions(fldOpt);

    return this;
  }
}
