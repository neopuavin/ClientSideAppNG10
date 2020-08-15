import { TblTreeStrucRow, TblNodesAttribRow } from './../../svc/app.tables';
import {
  TreeViewComponent,
  TreeViewNode,
} from './../../api/cmp/tree-view/tree-view.component';
import { AppDataset } from './../../svc/app-dataset.service';
import { AppMainServiceService } from './../../svc/app-main-service.service';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-asset-selector',
  templateUrl: './asset-selector.component.html',
  styleUrls: ['./asset-selector.component.scss'],
})
export class AssetSelectorComponent implements OnInit, AfterViewInit {
  @ViewChild('mainTree') treeView: TreeViewComponent;

  constructor(public dataSource: AppMainServiceService) {}

  public treeLoadingMessage: string = 'Loading...';
  public get ds(): AppDataset {
    return this.dataSource.ActiveSource.appDataset;
  }

  public get colorDefinitions() {
    return this.ds.colorDefinitions;
  }

  public get treeData(): Array<TreeViewNode> {
    return this.ds.assetSelectorTreeData;
  }

  public set treeData(value: Array<TreeViewNode>) {
    this.ds.assetSelectorTreeData = value;
  }

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    if (this.treeData.length == 0)
      //this.GetInitialTreeData();
      this.ds.GetTreeData({
        treeView: this.treeView,
        onSuccess: (result) => this.treeView.ProcessTree(),
      });
    else {
      // tree data is available. no need tp initialize
      setTimeout(() => {
        // refresh tree
        // need to use setTimeout method for the treeView.ProcessTree() method to work properly!
        this.treeView.ProcessTree();
      }, 50);
    }
  }
  TreePMClick(e: any) {
    if (!e.options.childNodesMissing) return;

    this.ds.GetTreeData({
      treeView: this.treeView,
      parentNode: e.node,
      onSuccess: (result) => {
        e.node.exp = true;
        this.treeView.ProcessTree();
      },
    });
  }

  TreeClick(e: any) {}

}
