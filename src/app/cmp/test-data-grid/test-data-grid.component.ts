import {
  DataGridOption,
  DataGridComponent,
} from './../../api/cmp/data-grid/data-grid.component';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-test-data-grid',
  templateUrl: './test-data-grid.component.html',
  styleUrls: ['./test-data-grid.component.scss'],
})
export class TestDataGridComponent implements OnInit, AfterViewInit {
  @ViewChild('basic') basicGrid: DataGridComponent;
  @ViewChild('moreOptions') advancedGrid: DataGridComponent;

  public basicGridOptions = new DataGridOption([]);
  public advancedGridOptions = new DataGridOption([]);

  constructor() {}

  ngOnInit(): void {
    this.basicGridOptions
      .AddColumn({
        caption: 'Id',
        fieldName: 'id',
        width: 50,
        isKey: true,
      })
      .AddColumn({ caption: 'Code', fieldName: 'code' })
      .AddColumn({ caption: 'Name', fieldName: 'name' });

    this.advancedGridOptions
      .SetRowHeaderHeight(0)
      .SetRowHeaderWidth(0)
      .AddColumn({
        caption: 'Id',
        fieldName: 'id',
        width: 50,
        isKey: true,
        align:'center'
      })
      .AddColumn({ caption: 'Code', fieldName: 'code' , minWidth: 30})
      .AddColumn({ caption: 'Name', fieldName: 'name', minWidth: 500 });
  }
  ngAfterViewInit() {
    setTimeout(() => {
      if (this.basicGrid) this.basicGrid.Refresh();
      if (this.advancedGrid) this.advancedGrid.Refresh();
    }, 1000);
  }

  public sourceRows(rowCount?: number): Array<any> {
    if (!rowCount) rowCount = 5;
    const ret = [];
    for (let i = 0; i < rowCount; i++) {
      ret.push({ id: i + 1, code: `Item ${i + 1} code`, name: `Item ${i + 1} long description` });
    }
    return ret;
  }
}
