import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { DataGridOption, DataGridColum } from './data-grid.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  Component,
  OnInit,
  Inject,
  HostListener,
  ViewChild,
  AfterViewInit,
} from '@angular/core';

@Component({
  selector: 'app-data-grid-col-mgt',
  templateUrl: './data-grid-col-mgt.component.html',
  styleUrls: ['./data-grid-col-mgt.component.scss'],
})
export class DataGridColMgtComponent implements OnInit, AfterViewInit {
  @ViewChild('contentSection') contentSection: any;
  @ViewChild('actions') actions: any;
  @ViewChild('heading') heading: any;

  @HostListener('window:resize', ['$event']) handleResize(event: any) {
    // simply adding this event declaration, triggers recalculation of column widths
    // when the browser window is resized!
    // a method can also be called within this event handler...
    // this.RefreshGridDisplay();
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DataGridColMgtComponent>
  ) {}

  ngOnInit(): void {
    this.ResetSelection();
  }

  ngAfterViewInit() {

    setTimeout(()=>this._ready=true,10);

  }

  private _visible: Array<{
    id: string;
    fieldName: string;
    caption: string;
    order: number;
    selected?: boolean;
  }> = [];
  public get visible(): Array<{
    id: string;
    fieldName: string;
    caption: string;
    order: number;
    selected?: boolean;
  }> {
    return this._visible;
  }

  private _hidden: Array<{
    id: string;
    fieldName: string;
    caption: string;
    order: number;
    selected?: boolean;
  }> = [];
  public get hidden(): Array<{
    id: string;
    fieldName: string;
    caption: string;
    order: number;
    selected?: boolean;
  }> {
    return this._hidden;
  }

  private _ready=  false
  public get ready():boolean{
    return this._ready;
  }

  public get contentHeight(): number {
    if(!this.ready) return 0;

    if (!this.actions || !this.heading) return 0;
    return (
      this.actions.nativeElement.offsetTop -
      (this.heading.nativeElement.offsetTop +
        this.heading.nativeElement.offsetHeight)
    );
  }

  public get options(): DataGridOption {
    return this.data.parent.options;
  }
  public get columns(): Array<DataGridColum> {
    return this.options.columns;
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      event.previousContainer.data['selected']=false;
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  itemClicked(sender: any, event: any) {
    sender.selected = !sender.selected;
  }

  clickAction(mode: string) {
    switch (mode) {
      case 'close':
      case 'cancel':
        this.dialogRef.close(null);
        break;
      case 'reset':
        this.ResetSelection();
        break;
      //this.dialogRef.close('reset');
      case 'accept':
        this.AcceptSelection();
        break;
    }
  }

  ShowHideAll(showAll?: boolean) {
    if (showAll == undefined) showAll = true;

    this._visible = [];
    this._hidden = [];
    let list = showAll ? this._visible : this._hidden;
    this.columns.forEach((c) =>
      list.push({
        // id: c.fieldName,
        id: c.fieldKey,
        fieldName: c.fieldName,
        caption: c.caption,
        order: c.order,
      })
    );
  }
  ShowHideSelected(show?: boolean) {
    if (show == undefined) show = true;
    let from = show ? this._hidden : this._visible;
    let to = show ? this._visible : this._hidden;
    const sel = from.filter((i) => i.selected);
    sel.forEach((f) =>
      to.push({
        id: f.id,
        fieldName: f.fieldName,
        caption: f.caption,
        order: f.order,
        selected: false,
      })
    );
    let fItem = from.find(f=>f.selected)
    while(fItem){
      const idx = from.indexOf(fItem);
      if(idx==-1)break;
      from.splice(idx,1);
      fItem = from.find(f=>f.selected);
    }
  }

  AcceptSelection(){
    let visibleFields:Array<string>=[];
    this.visible.forEach(i=>{
      visibleFields.push(i.id);
    })

    this.dialogRef.close({mode:'accept',fields:visibleFields});

    // this.options.ShowColumns(visibleFields);
    // this.dialogRef.close('accept');
    // this.data.parent.Refresh();
  }

  ResetSelection(withConfirm?: boolean) {
    if (withConfirm == undefined) withConfirm = false;

    this._visible = [];
    this._hidden = [];
    this.columns.forEach((c) => {
      if (c.visible) {
        this._visible.push({
          // id: c.fieldName,
          id: c.fieldKey,
          fieldName: c.fieldName,
          caption: c.caption,
          order: c.order,
        });
      } else {
        this._hidden.push({
          // id: c.fieldName,
          id: c.fieldKey,
          fieldName: c.fieldName,
          caption: c.caption,
          order: c.order,
        });
      }
      this._visible.sort((a, b) => a.order - b.order);
      this._hidden.sort((a, b) => a.order - b.order);
    });

  }
}
