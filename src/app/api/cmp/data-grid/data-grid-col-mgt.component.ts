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
    // console.log("Managemnent Datae:",this.data);
    //console.log()
  }

  ngAfterViewInit() {
    console.log('this.actions:', this.actions,"contentHeight:",this.contentHeight);
  }

  public get contentHeight(): number {
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

  clickAction(mode: string) {
    switch (mode) {
      case 'close':
      case 'cancel':
        this.dialogRef.close(null);
        break;
      case 'accept':
        this.dialogRef.close('accept');
        break;
    }
  }
}
