import { FilterParametersComponent } from './../filter-parameters/filter-parameters.component';
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
  private _HostListenerTimeout: any;
  @HostListener('window:resize', ['$event']) handleResize(event: any) {
    // simply adding this event declaration, triggers recalculation of column widths
    // when the browser window is resized!
    // a method can also be called within this event handler...
    // this.RefreshGridDisplay();

    //
    this.gridViewPort.checkViewportSize();

    this.resetColumnWidths();
  }

  // object with 'rows' property which is an array of object!
  @Input() sourceTable: any = null;
  @Input() sourceRows: any = null;
  @Input() sourceLookups: any = null;

  @Input() showMenu: boolean = false;
  @Input() ManagmentOpener: any = null;

  @Input() activeFiltering: boolean = false;

  @Input() gridPortHeight: number = 768;

  // this is to allow usage of external object as current row of the grid
  @Input() gridDataSource: any;
  private _dataSource: Array<any> = [];
  private get dataSourceObject(): Array<any> {
    // return this._dataSource;

    return this.gridDataSource != undefined
      ? this.gridDataSource
      : this._dataSource;
  }

  private set dataSourceObject(value: Array<any>) {
    if (this.gridDataSource != undefined) this.gridDataSource = value;
    else this._dataSource = value;
  }

  @Input() gridCurrentRow: any;
  private _currentRow: any = null;

  private get currentRowObject(): any {
    // return this._currentRow;
    return this.gridCurrentRow != undefined
      ? this.gridCurrentRow
      : this._currentRow;
  }

  private set currentRowObject(value: any) {
    if (this.gridCurrentRow != undefined) this.gridCurrentRow = value;
    else this._currentRow = value;
  }

  public get currentRow(): any {
    return this.currentRowObject;
  }

  public set currentRow(value: any) {
    const keyName = this.options.keyColumnName;
    if (keyName && value) {
      const keyVal = value[keyName];
      if (keyVal) {
        let focusElement: any = document.querySelector('#row_focus_' + keyVal);
        if (!focusElement) {
          setTimeout(() => {
            focusElement = document.querySelector('#row_focus_' + keyVal);
            // console.log("Currentrow:",keyName,keyVal,"Focus Element(retry):",focusElement,this.sourceRows);
            if (focusElement) {
              focusElement.focus();
              // this.rowClick.emit({ row: value, e: null });
              this.rowClick.emit(value);
            }
          }, 100);
        } else {
          focusElement.focus();
          // this.rowClick.emit({ row: value, e: null });
          this.rowClick.emit(value);
          // console.log("Currentrow:",keyName,keyVal,"Focus Element(orig):",focusElement,this.sourceRows);
        }
      }
    }
    /**    const focusElement = event.srcElement.parentNode.querySelector('.row-focus');
    if(focusElement)focusElement.focus();
 */
    this.currentRowObject = value;
  }

  private debugMode: boolean = false;

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
  @Input() bufferRows: number = 4;

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

      setTimeout(() => (this._changeValuesNow = true), 12);

      this.OpenFilterForDebug();
    }, 10);
  }

  OpenFilterForDebug() {
    return;
    const col: DataColumn = this.options.columns.find(
      (c) => c.fieldName == 'AN_REF'
    );
    if (!col) return;

    this.OpenFilter(col);
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
    this._portHeight = this.gridPortHeight;
    this.InitDataSource();

    setTimeout(() => {
      this._isReady = true;
    }, 1);

    //    console.log("this.pagesArray",this.pagesArray);
  }

  PageClick(event: any, page: number) {
    this.pageClick.emit({ page: page, e: event });
  }

  AcceptColumnSetup(fieldsArray: Array<string>) {
    // check if set of fields selected were part of the original (SetupData is called)
    // set of visible fields. if not onColumnsChanged must be fired!

    console.log('fieldsArray:', fieldsArray);
    this.options.ShowColumns(fieldsArray);

    if (this.options.columnsDataNotAvailable) {
      this.onColumnsChanged.emit();
      //this.options.RecordExtractedDataFieldnames();
    }

    // set column widths array to null to force width recalculation
    this.resetColumnWidths();

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

  OpenFilter(column: DataColumn) {
    let ref: MatDialogRef<FilterParametersComponent, any>;

    ref = this.dialog.open(FilterParametersComponent, {
      minWidth: '300px',
      minHeight: '550px',
      disableClose: false,
      data: { column: column, table: this.sourceTable },
    });

    return ref.afterClosed();
  }

  private _isReady: boolean = false;
  public get isReady() {
    return this._isReady;
  }

  public get isWithVisibleColumns(): boolean {
    if (!this.options) return false;
    if (!this.options.visibleColumns) return false;
    return true;
  }

  public RowClick(row: any) {
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
      noselect: true,
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

  Refresh(fromCachedData?: boolean) {
    // Refresh data grid source
    // if (fromCachedData) {
    //   return;
    // }

    // set flag to make sure that the
    // UI does not repeatedly refresh while the
    // _dataSource array is being populated
    this._sourceProcessing = true;

    // reset current row
    this.currentRow = null;

    setTimeout(() => {
      // initialize _dataSource array
      // this._dataSource = [];
      this.dataSourceObject = [];
      // populate _dataSource array with data from
      // source data collection
      const dataSourceObject = this.dataSourceObject;
      this.SourceRows.forEach((r) => {
        // this._dataSource.push(r);
        dataSourceObject.push(r);
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
    // return this._dataSource;
    return this.dataSourceObject;
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

  _cellWidths: Array<number> = null;
  _cellTotalWidth: number = 0;
  public get cellWidths(): Array<number> {
    if (this.gridHeaderGuide && !this._cellWidths) {
      const widths: Array<number> = [];
      const cells = this.gridHeaderGuide.querySelectorAll('div');
      this._cellTotalWidth = 0;
      cells.forEach((cell) => {
        widths.push(cell.offsetWidth);
        this._cellTotalWidth += cell.offsetWidth;
      });

      this._cellWidths = widths;
    }
    return this._cellWidths;
    //if(!_ce
    /**
     *     if (this.gridHeaderGuide) {
      // const cells = this.gridHeaderGuide.querySelectorAll('div');
      // return cells[idx + 1].offsetWidth;
    }
     */
  }

  public get totalCellWidths(): number {
    return this._cellTotalWidth;
  }

  resetColumnWidths() {
    if (this._HostListenerTimeout) clearTimeout(this._HostListenerTimeout);
    this._HostListenerTimeout = setTimeout(() => {
      this._cellWidths = null;
    }, 10);
  }

  calcWidths() {
    this._cellWidths = null;
    setTimeout(() => {
      console.log(this.cellWidths);
    }, 1000);
  }

  public cellWidth(c: DataGridColum, idx: number): number {
    const widths = this.cellWidths;
    if (!widths) return 100;
    return widths[idx + 1];

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

  public cellColor(r: any, c: DataGridColum): string {
    if (this.debugMode) return null;
    if (!c.colorParams) return null;
    if (!c.colorParams.foreGround) return null;

    let value: any = null;
    if (!c.fieldName && r.CELL_TEXT != undefined) {
      const colKey = c.fieldKey;
      value = r.CELL_TEXT[colKey];
    } else if (c.fieldName) {
      value = r[c.fieldName];
    } else {
      return null;
    }

    const color = value ? c.colorParams.foreGround[value] : null;
    return !color ? null : color;
  }
  public cellBack(r: any, c: DataGridColum): any {
    if (this.debugMode) return null;
    if (!c.colorParams) return null;
    if (!c.colorParams.backGround) return null;

    let value: any = null;
    if (!c.fieldName && r.CELL_TEXT != undefined) {
      const colKey = c.fieldKey;
      value = r.CELL_TEXT[colKey];
    } else if (c.fieldName) {
      value = r[c.fieldName];
    } else {
      return null;
    }

    const color = value ? c.colorParams.backGround[value] : null;
    return !color ? null : color;

    // const value = r[c.fieldName];
    // //const key = isNaN(value) ? value : 'v' + value;
    // const color = c.colorParams.backGround[value];
    // return !color ? null : color;
  }

  public cellText(r: any, c: DataGridColum): string {
    // NOTE: If this will affect the performance of the grid because of resolving lookups,
    // first time display lookup result can be stored in a collection inside the
    // row object and can be subsequently used to render text instead of actively
    // going through the process of looking up texts.

    const colKey: string = c.fieldKey;

    // if cellText cache object is not yet existing, create an empty object
    if (r.CELL_TEXT == undefined) {
      r.CELL_TEXT = {};
      r.CELL_BACK = {};
      r.CELL_FORE = {};
    }

    // if cellText is already cached in the current row
    if (r.CELL_TEXT[colKey] != undefined) {
      return r.CELL_TEXT[colKey];
    }

    let value: any;

    if (c.fieldName) {
      value = this.cellTextFromFieldName(r, c);
      if (this.debugMode) return value;
    } else if (c.value) {
      // process calculated column
      value = this.cellTextFromValue(r, c);
    }

    if (this.debugMode) return value;

    return value;
  }

  cellTextFromValue(r: any, c: DataGridColum): string {
    const fmt: string = '`' + c.value.replace(/\{/gi, '${r.') + '`';
    let value: string = eval(fmt);
    const lkpParams = c.lookupParams;

    if (value.indexOf('null') != -1) value = '';

    if (lkpParams && value)
      if (lkpParams.lookupSource)
        value = this.cellTextFromLookupParams(r, c, value);

    // WARNING: Setting timeout just to eliminate changed value error
    // will significantly slow down cell rendering
    //setTimeout(() => (r.CELL_TEXT[c.fieldKey] = value), 0);
    r.CELL_TEXT[c.fieldKey] = value;

    return value; // //eval("`${r[AN_ID]}`");
  }

  cellTextFromFieldName(r: any, c: DataGridColum): string {
    let value: any = r[c.fieldName];
    let recordValue: boolean = false;

    if (c.displayField && this.sourceLookups[c.displayField]) {
      // if sourceLookups and displayField are defined
      // sourceLookups - set of inline lookups
      // where groupname is displayField and 'value' is the item key

      value = this.sourceLookups[c.displayField][value];
      recordValue = true;
    } else if (!c.lookupParams) {
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

        value = moment(dt).format(fmt);
        recordValue = true;
      } else if (c.noZero && !isNaN(value)) {
        // if numeric value but will simply display blank if the value is zero
        value = +value != 0 ? value : '';
      } else {
        // retain current value of 'value'
      }
    } else {
      // c.lookupParams is supplied, process lookup parameters to derive cellText
      value = this.cellTextFromLookupParams(r, c, value);
      recordValue = true;
    }

    // WARNING: Setting timeout just to eliminate changed value error
    // will significantly slow down cell rendering
    // if (recordValue) setTimeout(() => (r.CELL_TEXT[c.fieldKey] = value), 0);

    // cache only cell text non-native value
    if (recordValue) r.CELL_TEXT[c.fieldKey] = value;

    return value;
  }

  cellTextFromLookupParams(r: any, c: DataGridColum, value: any): string {
    // get lookup definition parameters
    const lkpPrm = c.lookupParams;
    let retVal: any;

    if (lkpPrm.lookupSource) {
      const lookupValueField = lkpPrm.lookupValueField
        ? lkpPrm.lookupValueField
        : 'value';
      const lookupDisplayField = lkpPrm.lookupDisplayField
        ? lkpPrm.lookupDisplayField
        : 'display';

      // if object is supplied as lookupSource value, use the value as parameter key of the lookup object,
      // if array of objects is supplied as lookupSource,  use the value as search value
      const lkpElem =
        lookupValueField == 'object'
          ? lkpPrm.lookupSource[value]
          : lkpPrm.lookupSource.find((e) => e[lookupValueField] == value);

      retVal = lkpElem ? lkpElem[lookupDisplayField] : lkpPrm.notFoundDislay;

      // retVal =`${lookupDisplayField},${value},${lkpPrm.lookupSource[value]}`
    } else if (lkpPrm.formXTRA) {
      // if display value is taken from a field in the row's XTRA property
      retVal = r.XTRA[lkpPrm.formXTRA];
    } else if (lkpPrm.toggleDisplay) {
      // if display value will be taken from a string array
      const tgl = lkpPrm.toggleDisplay.find((t) => t.value == value);
      retVal = tgl ? tgl.display : value;
    } else {
      // get lookup table object
      const tbl = c.lookupParams.table;

      retVal = tbl.LookupText(
        value,
        lkpPrm.displayField,
        lkpPrm.groupValue,
        lkpPrm.groupField,
        lkpPrm.notFoundDislay
      );

      if (lkpPrm.subLookupParams) {
        const stbl = lkpPrm.subLookupParams.table;
        retVal = stbl.LookupText(
          retVal,
          lkpPrm.subLookupParams.displayField,
          lkpPrm.subLookupParams.groupValue,
          lkpPrm.subLookupParams.groupField,
          lkpPrm.notFoundDislay
        );
      }
    }

    // return value;
    return retVal + '';
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
    if (!this.currentRow) return false;
    return this.currentRow[key] == row[key];
  }

  private _portHeight: number = 768;
  public get portHeight(): number {
    return this._portHeight;
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

  public handleOffset: number = 2;
  public onNext: boolean = false;
  public onPrev: boolean = false;

  public _mouseDown: boolean = false;
  headerMouse(event: any) {
    const type = event.type;
    const e = event;
    const src = e.srcElement;

    if (src.id.indexOf('h_') != 0) return;

    const idx = +src.id.substr(2);
    const offset = event.offsetX;
    const colWidth = this.cellWidths[idx + 1];

    if (type == 'mousemove') {
      this.onNext = offset >= 0 && offset <= this.handleOffset && idx != 0;
      this.onPrev =
        offset >= colWidth - this.handleOffset && offset <= colWidth;

      this._showResizeCursor = this.onNext || this.onPrev || this._mouseDown;

      if (this._showResizeCursor) {
        this._getHandleLeft = this.RowHeaderWidth - this.handleOffset;
        for (let cIdx = 0; cIdx < idx + (this.onPrev ? 1 : 0); cIdx++) {
          this._getHandleLeft += this.cellWidths[cIdx + 1];
        }
      }
    } else if (type == 'mouseup') {
      this._mouseDown = false;
    } else if (type == 'mousedown') {
      this._mouseDown = true;
    } else if (type == 'mouseleave') {
      this._mouseDown = false;
      this._showResizeCursor = false;
    }

    this.promptNoRecords = `Left:${this._getHandleLeft}, MouseDown:${this._mouseDown}, ShowHandle:${this._showResizeCursor}, Offset:${offset}, OnPrev:${this.onPrev}, OnNext:${this.onNext}`;
  }

  splitCursorMouse(event: any) {
    const type = event.type;
    const e = event;
    const src = e.srcElement;
    if (type == 'mouseup') {
      this._mouseDown = false;
    } else if (type == 'mousedown') {
      this._mouseDown = true;
    }
  }

  private _getHandleLeft: number = 100;
  public get getHandleLeft(): number {
    return this._getHandleLeft;
  }

  private _showResizeCursor: boolean = false;
  public get showResizeCursor(): boolean {
    return this._showResizeCursor;
  }
  public get headerMaskCursor(): string {
    return 'default';
    return this._showResizeCursor ? 'ew-resize' : 'default';
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
  displayFormat?: string;

  allowFilter?: boolean;
  sortAsc?: boolean;
  sortDesc?: boolean;
  filters?: Array<any>;
  filterType?: number;
  matrixData?: any;
  matrixSeverity?: string;
  matrixLikelihood?: string;
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
    this.displayFormat = args.displayFormat;

    this.allowFilter = args.allowFilter != undefined ? args.allowFilter : true;
    this.sortAsc = args.sortAsc;
    this.sortDesc = args.sortDesc;

    if (this.allowFilter) this.filters = args.filters ? args.filters : [];
    this.filterType = args.filterType; // == undefined ? 1 : args.filterType;

    this.matrixData = args.matrixData;
    this.matrixSeverity = args.matrixSeverity;
    this.matrixLikelihood = args.matrixLikelihood;

    if (args.visible != undefined) this.visible = args.visible;

    this.dateFormat = args.dateFormat;
    this.value = args.value;
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
  public value: any;
  public displayFormat: string;

  public allowFilter: boolean;
  public sortAsc: boolean;
  public sortDesc: boolean;
  public filters: Array<any>;
  public filterType: number;
  public matrixData: any;
  public matrixSeverity: string;
  public matrixLikelihood: string;
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
    //const fld = this.fields.find((f) => f.fieldName == column.fieldName);
    const fld = this.fields.find((f) => f.fieldKey == column.fieldKey);

    if (fld) {
      if (!visible) {
        // if (this._requiredFields.indexOf(fld.fieldName) == -1)
        if (this._requiredFields.indexOf(fld.fieldKey) == -1)
          fld.visible = false;
      } else {
        fld.visible = true;
      }
    }

    const lkp = column.lookupParams;
    if (lkp && column.displayField) {
      // check if an inline lookup is defined. If it does, it must be included in the
      // set of fields to be requested from the server
      if (lkp.inlineLookupFieldAlias) {
        // find lookup field definition associated with the field set in the column
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
      } // if inlinelookup defined
    }
  }

  public HideColumns(
    fieldKeys: Array<string>,
    hideOnly?: boolean
  ): DataGridOption {
    if (hideOnly == undefined) hideOnly = true;
    if (hideOnly)
      this.columns.forEach((c) => this.SetColumnVisibility(c, true));

    fieldKeys.forEach((fk) => {
      // const col = this.columns.find((c) => c.fieldName == cn);
      const col = this.columns.find((c) => c.fieldKey == fk);
      if (col) this.SetColumnVisibility(col, false);
    });

    this._visibleColumns = null;
    return this;
  }

  public ShowColumns(
    fieldKeys: Array<string>,
    showOnly?: boolean
  ): DataGridOption {
    if (showOnly == undefined) showOnly = true;

    if (showOnly)
      this.columns.forEach((c) => this.SetColumnVisibility(c, false));

    let order: number = 1;
    fieldKeys.forEach((fk) => {
      const col = this.columns.find((c) => c.fieldKey == fk);
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

  private _extractedColumns: Array<string> = [];
  public get columnsDataNotAvailable(): boolean {
    // this is to check if data on visible columns were all included in the last data extraction
    let missingData: boolean = false;
    const visible = this.visibleColumns;
    for (let idx = 0; idx < visible.length; idx++) {
      if (this._extractedColumns.indexOf(visible[idx].fieldName) == -1) {
        missingData = true;
        break;
      }
    }
    return missingData;
  }

  public RecordExtractedDataFieldnames() {
    this._extractedColumns = [];
    this.visibleColumns.forEach((col) => {
      this._extractedColumns.push(col.fieldName);
    });
  }

  public AddColumn(args: IDataGridColumn): DataGridOption {
    if (args.visible == undefined) args.visible = true;

    // create column entry
    const col = new DataGridColum(args);
    col.parentOption = this;
    col.order = this.columns.length;

    // assign column key string if not supplied during construction
    if (!col.fieldKey)
      if (col.fieldAlias)
        // if fieldAlias is available, use it
        col.fieldKey = col.fieldAlias;
      else if (col.fieldName)
        // else if fieldName is available, use it
        col.fieldKey = col.fieldName;
      // else, col.fieldKey will be assigned a GUID
      else col.fieldKey = this.GUID;

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
    // add data field only if fieldname is specified
    if (fldOpt.fieldName) this.AddFieldWithOptions(fldOpt);

    return this;
  }

  get GUID(): string {
    // Public Domain/MIT
    let d = new Date().getTime(); //Timestamp
    let d2 = (performance && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (
      c
    ) {
      var r = Math.random() * 16; //random number between 0 and 16
      if (d > 0) {
        //Use timestamp until depleted
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {
        //Use microseconds since page-load if supported
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  } // end of GUID method
}
