import { AppMainServiceService } from './../../svc/app-main-service.service';
import { SurveyDataComponent } from './../survey-data/survey-data.component';
import { IAppVer } from './../../api/mod/app-params.model';
import { ReferenceLibraryComponent } from './../reference-library/reference-library.component';
import { DesignDataComponent } from './../design-data/design-data.component';
import { AnomalyComponent } from './../anomaly/anomaly.component';
import { TblTreeStrucRow, TblNodesAttribRow } from './../../svc/app.tables';
import {
  TreeViewComponent,
  TreeViewNode,
} from './../../api/cmp/tree-view/tree-view.component';
import { AppDataset } from './../../svc/app-dataset.service';
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ComponentFactoryResolver,
} from '@angular/core';

@Component({
  selector: 'app-main-frame',
  templateUrl: './main-frame.component.html',
  styleUrls: ['./main-frame.component.scss'],
})
export class MainFrameComponent implements OnInit, AfterViewInit {
  public get ds(): AppDataset {
    if (!this.dataSource.ActiveSource) return null;
    return this.dataSource.ActiveSource.appDataset;
  }
  constructor(public dataSource: AppMainServiceService) {}

  @ViewChild('mainTree') treeView: TreeViewComponent;

  @ViewChild(AnomalyComponent) modAnomaly: AnomalyComponent;
  @ViewChild(DesignDataComponent) modDesignData: DesignDataComponent;
  @ViewChild(ReferenceLibraryComponent)
  modReferenceLibrary: ReferenceLibraryComponent;
  @ViewChild(SurveyDataComponent) modSurveyData: SurveyDataComponent;

  // property declarations
  public panelSwitch: any = {
    tree: true,
    info: !this.ds ? null : !this.ds.isDeployed && false,
  };
  public treePanelWidth: number = -1;
  public infoPanelWidth: number = -1;

  ngOnInit(): void {}

  ngAfterViewInit() {
    //console.log("treeView",this.treeView,this.treeView.treeData);
    this.InitComponent();
  }

  GetModuleData() {
    // Request data based on selected module....
  }

  KeepAlive() {
    this.ds.Get(
      [
        {
          code: 'chgTrack',
          key: '0',
          keyField: 'trk_id',
          forceRequest: true,
        },
      ],
      {
        onSuccess: (data) => {
          //console.log('Success on keeping alive!', data);
        },
      }
    );

    // set interval of 10 mins to keep api component running
    setTimeout(() => {
      this.KeepAlive();
    }, 10 * 60 * 1000);
  }

  /**chgTrack/0/-/trk_id */
  public menuList: Array<any> = this.ds ? this.ds.menuList : [];

  public get notificationTip(): string {
    const withError = this.ds.globalMessage['error'] == true;
    if (withError) return this.ds.globalMessage['message'];
    return null;
    //ds.globalMessage['message']
  }
  public get appVer(): IAppVer {
    //if (!this.ds) return { label: '', tipText: '' };
    const ver = this.ds.appVersionObject;
    let tip: string = '';
    let ctr: number = 1;
    ver.updates.forEach((u) => {
      tip += (tip ? '\n' : '') + (ctr + '. ') + u;
      ctr++;
    });
    let ret: IAppVer = {
      label: '(' + ver.ver + ' - ' + ver.build + ')',
      tipText: tip,
    };
    //
    //return "(Alpha 1.2.1-20200528)"
    return ret;

    // return "(Alpha 1.2.0-20200528)"
  }
  public get activeMenu(): any {
    return this.menuList.find((e) => e.active);
  }

  public menuClick(menuId: number) {
    const menu: any = this.activeMenu;
    let changeMenu: boolean = false;

    if (menu) {
      if (menu.id != menuId) {
        menu.active = false;
        changeMenu = true;
      }
    } else {
      changeMenu = true;
    }
    if (changeMenu) this.menuList.find((e) => e.id == menuId).active = true;

    const subm = this.subMenu;
    if (subm.length) {
      if (!subm.find((e) => e.active)) subm[0].active = true;
    }
  }

  public subMenuClick(menuId: number) {
    const subm = this.subMenu;
    const activeMenu: any = subm.find((e) => e.active);
    let changeMenu: boolean = false;
    if (activeMenu) {
      if (activeMenu != menuId) {
        activeMenu.active = false;
        changeMenu = true;
      }
    } else {
      changeMenu = true;
    }
    if (changeMenu) subm.find((e) => e.id == menuId).active = true;

    setTimeout(() => {
      this.ReloadData();
    }, 1);
  }

  public get activeModule() {
    const menu = this.menuList.find((m) => m.active);
    if (!menu == null) return -1;

    const subMenu = menu.subMenu.find((sm) => sm.active);
    if (subMenu == null) return -1;
    return subMenu.id;
  }

  public get subMenu(): Array<any> {
    const menu = this.activeMenu;
    if (!menu) return [];
    if (!menu.subMenu) return [];
    return menu.subMenu;
  }

  InitComponent(): void {
    this.ds.GetTreeData({
      treeView: this.treeView,
      onSuccess: (result) => this.treeView.ProcessTree(),
    });
  }

  ReloadData() {
    // if (this.modReferenceLibrary)
    //   if(this.modReferenceLibrary.reqInfo.)
    //   this.modReferenceLibrary.mainGrid.Refresh();
    this.SetupDetailsData();
  }

  SetupDetailsData() {
    if (this.modReferenceLibrary) {
      this.modReferenceLibrary.SetupData();
    } else if (this.modAnomaly) {
      this.modAnomaly.SetupData();
    } else if (this.modDesignData) {
      this.modDesignData.SetupData();
    } else if (this.modSurveyData) {
      console.log('SetupDetailsData....');
      this.modSurveyData.SetupData();
    }
  }

  TreeClick(n: TreeViewNode) {
    this.ds.mainTreeCurrentNode = n;
    this._NodePath = this.treeView.NodePath;

    this.SetupDetailsData();
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

  SeparatorClick(item: string) {
    this.panelSwitch[item] = !this.panelSwitch[item];
  }

  private _treeLoadingMessage = 'Loading tree. Please wait...';
  private treeLoadingReset() {
    this._treeLoadingMessage = 'Loading tree. Please wait...';
  }
  public get treeLoadingMessage(): string {
    if (this.ds.errorObject.type != '') {
      const err = this.ds.errorObject;
      this._treeLoadingMessage = err.type + ', ' + err.message.split('?')[0];
    } else {
      this.treeLoadingReset();
    }
    return this._treeLoadingMessage;
  }

  _NodePath: string = '-';
  get NodePath(): string {
    //if (!this.treeView) return this._NodePath;
    // using setTimeout suppresses the ExpressionChangedAfterItHasBeenCheckedError

    // USING THE METHOD ON THE NEXT LINE WILL SIGNIFICANTLY SLOW DOWN
    // THE SYSTEM!!!!
    //setTimeout(()=>{this._NodePath = this.treeView.NodePath;},0);

    return this._NodePath;
  }
}
