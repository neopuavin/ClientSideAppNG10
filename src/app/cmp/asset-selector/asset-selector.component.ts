import { CommonPopupComponent } from './../common-popup/common-popup.component';
import { TblTreeStrucRow, TblNodesAttribRow } from './../../svc/app.tables';
import {
  TreeViewComponent,
  TreeViewNode,
} from './../../api/cmp/tree-view/tree-view.component';
import { AppDataset } from './../../svc/app-dataset.service';
import { AppMainServiceService } from './../../svc/app-main-service.service';
import { Component, OnInit, AfterViewInit,Inject, ViewChild } from '@angular/core';

@Component({
  selector: 'app-asset-selector',
  templateUrl: './asset-selector.component.html',
  styleUrls: ['./asset-selector.component.scss'],
})
export class AssetSelectorComponent implements OnInit, AfterViewInit {
  @ViewChild('mainTree') treeView: TreeViewComponent;

  constructor(@Inject(CommonPopupComponent) public popUp: CommonPopupComponent,public dataSource: AppMainServiceService) {}

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

  ngOnInit(): void {
    // assign listener to popup's validation routine
    this.popUp.data.validate = this.SubmitValidation;
  }
  ngAfterViewInit(): void {
    const data = this.popUp.data;
    console.log("ngAfterViewInit popup data:",data)
    if (this.treeData.length == 0)
      // call common GetTreeData function to get data from the server
      this.ds.GetTreeData({
        treeView: this.treeView,
        onSuccess: (result) => {
          // if currentLocation is not supplied, execute ProcessTree()
          if(!data.currentLocation)this.treeView.ProcessTree()
        },
        //SetCurrentNode
      });
    else {
      // tree data is available. no need tp initialize
      setTimeout(() => {
        // refresh tree
        // need to use setTimeout method for the treeView.ProcessTree() method to work properly!
        // if currentLocation is not supplied, execute ProcessTree()
          if(!data.currentLocation)this.treeView.ProcessTree()

      }, 50);
    }

    // data.currentLocation is supplied, call SetCurrentNode of the treeView component
    if(data.currentLocation){
      console.log("data.currentLocation:",data.currentLocation);
      this.treeView.SetCurrentNode(data.currentLocation,this.treeView);
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

  TreeClick(e: any) {
    // assign TreeViewNode data to the response property of the common popup component
    const node = e;
    let ret:any = null;
    if(node)ret = {id:node.id, code:node.code, text:node.text, dataId:node.did,location:node.loc}
    this.popUp.data.response = ret;
  }

  SubmitValidation(node:any):boolean{
    return (node != null && node!=undefined)
  }


}
