import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-form-header',
  templateUrl: './form-header.component.html',
  styleUrls: ['./form-header.component.scss'],
})
export class FormHeaderComponent implements OnInit, AfterViewInit {
  @Input() title: string;
  @Input() rights: any = {};

  @Input() filteringState: boolean = true;

  @Output() addClick: EventEmitter<any> = new EventEmitter();
  @Output() editClick: EventEmitter<any> = new EventEmitter();
  @Output() deleteClick: EventEmitter<any> = new EventEmitter();
  @Output() printClick: EventEmitter<any> = new EventEmitter();
  @Output() excelClick: EventEmitter<any> = new EventEmitter();

  @Output() searchKeyEvent: EventEmitter<any> = new EventEmitter();
  @Output() filterClick: EventEmitter<any> = new EventEmitter();

  @ViewChild('search') searchTextObj: any;
  @ViewChild('formHeader') formHeader: any;
  searchText: HTMLElement = null;

  constructor() {}

  SetButtonTitle(type: string): string {
    if (type == 'add') {
      return 'Add new record';
    } else if (type == 'edit') {
      return 'Edit selected record';
    } else if (type == 'delete') {
      return 'Delete selected record(s)';
    } else if (type == 'excelx') {
      return 'Extract list to Excel';
    } else if (type == 'filter') {
      return 'Toggle on/off data table filtering function';
    }
    return 'Sorry. This action is not yet avialable...';
  }

  ngAfterViewInit() {
    this.searchText = this.searchTextObj.nativeElement;
  }

  ngOnInit(): void {}

  SearchKeyEvent(event: any) {
    this.searchKeyEvent.emit({ sender: this.searchText, e: event });
  }

  public get allowAdd(): boolean {
    return this.rights.allowAdd;
  }

  AddClick(event: any) {
    this.addClick.emit(event);
  }

  onFocus(e: any) {
    e.srcElement.blur();
  }

  public get allowEdit(): boolean {
    return this.rights.allowEdit;
  }
  EditClick(event: any) {
    this.editClick.emit(event);
  }

  public get allowDelete(): boolean {
    return this.rights.allowDelete;
  }
  DeleteClick(event: any) {
    this.deleteClick.emit(event);
  }

  public get allowPrint(): boolean {
    return this.rights.allowPrint;
  }
  PrintClick(event: any) {
    this.printClick.emit(event);
  }

  ExcelClick(event: any) {
    this.excelClick.emit(event);
  }

  FilterClick(event: any) {
    this.filterClick.emit(event);
  }
}
