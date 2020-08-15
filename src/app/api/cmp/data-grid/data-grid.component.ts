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
} from '@angular/core';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Data } from '@angular/router';

@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.scss'],
})
export class DataGridComponent implements OnInit, AfterViewInit, OnDestroy {
  // object with 'rows' property which is an array of object!
  @Input() sourceTable: any = null;
  @Input() sourceRows: any = null;
  @Input() sourceLookups: any = null;

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

  @Input() promptNoRecords: string = 'No record(s) found.';
  @Input() promptRefresh: string = 'Refreshing display.';

  @Output() pageClick: EventEmitter<any> = new EventEmitter();
  @Output() pageSizeChange: EventEmitter<any> = new EventEmitter();

  @Output() rowClick: EventEmitter<any> = new EventEmitter();

  @ViewChild('gridViewPort') gridViewPort: CdkVirtualScrollViewport;
  @ViewChild('gridViewPort') gridViewPortElem: any;
  @ViewChild('gridHeader') gridHeaderObj: any;
  @ViewChild('gridHeaderWidthGuide') gridHeaderGuideObj: any;

  gridHeaderGuide: HTMLElement = null;
  gridHeader: HTMLElement = null;

  public cellTip: string = null;

  constructor() {}

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
  PageSizeChange(event: any) {
    //this.pageSize
    this.pageSizeChange.emit({ pageSize: +event.srcElement.value, e: event });
  }

  PageNum(p): string {
    if (p == -1) return '...';
    return String(p + 1);
  }

  KeyUp(evt: any, row: any) {
    if(!row) return;

    const rowIndex = this.sourceRows.indexOf(row);

    // current row is the first or the last record of the sourceRows
    switch (evt.code) {
      case 'ArrowUp':
        if(rowIndex == 0)return;
        this.currentRow = this.sourceRows[rowIndex - 1];
        break;
      case 'ArrowDown':
        if(rowIndex == this.sourceRows.length - 1)return;
        this.currentRow = this.sourceRows[rowIndex + 1];
        break;
      default:
    }

    //this.currentRow = this.sourceRows[]
  }

  private _isReady: boolean = true;
  public get isReady() {
    return this._isReady;
  }

  private _currentRow: any = null;
  public RowClick(event: any, row: any) {
    this.currentRow = row;
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
    return this._leftScrollOffset;
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
    const value = r[c.fieldName];
    if (c.displayField && this.sourceLookups[c.displayField]) {
      return this.sourceLookups[c.displayField][value];
    }
    if (!c.lookupParams) return value;

    if ((value + '').length == 0) return '';

    const tbl = c.lookupParams.table;
    const lkpPrm = c.lookupParams;

    if (lkpPrm.lookupSource) {
      const lkpElem = lkpPrm.lookupSource.find((e) => e.value == value);
      return lkpElem ? lkpElem.display : lkpPrm.notFoundDislay;
    } else if (lkpPrm.formXTRA) {
      return r.XTRA[lkpPrm.formXTRA];
    }

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
    if (this.options.rowHeaderWidth != undefined) {
      return this.options.rowHeaderWidth;
    } else {
      return this.options.rowHeaderHeight * 0.9;
    }
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
  }

  public isKey: boolean = true;
  public visible: boolean = true;
  public frozen: boolean = false;
  public align: string;
  public minWidth: number;
  public maxWidth: number;
  public width: number;
  public colorParams: IColorParams;
  public lookupParams: ILookupParams;

  public order: number = -1;
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

  public SetKeyColumnName(value: string): DataGridOption {
    this.keyColumnName = value;
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

  public AddColumn(args: IDataGridColumn): DataGridOption {
    if (args.visible == undefined) args.visible = true;

    const col = new DataGridColum(args);
    col.parentOption = this;
    col.order = this.columns.length;
    this.columns.push(col);
    return this;
  }
}
