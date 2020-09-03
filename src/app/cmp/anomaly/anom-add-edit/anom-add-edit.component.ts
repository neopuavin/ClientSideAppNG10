import { CommonPopupComponent } from './../../common-popup/common-popup.component';
import { AppFormAComponent } from './../../../api/cmp/app-form-a/app-form-a.component';
import {
  DataTabsOption,
  DataTab,
} from './../../../api/cmp/data-tabs/data-tabs.component';
import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  Input,
  Inject,
} from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-anom-add-edit',
  templateUrl: './anom-add-edit.component.html',
  styleUrls: ['./anom-add-edit.component.scss'],
})
export class AnomAddEditComponent implements OnInit, AfterViewInit {
  public mainTabsOptions = new DataTabsOption([]);

  @ViewChild('detailForm') detailForm: AppFormAComponent;

  @Input() data: any = {};

  constructor(
    @Inject(CommonPopupComponent) public popUp: CommonPopupComponent
  ) {}

  ngOnInit(): void {
    this.mainTabsOptions
      .AddTab({
        id: 1,
        label: 'General Information',
        icon: 'fa fa-info-circle',
        active: true,
        loaded: true,
      })
      .AddTab({ id: 2, label: 'Assessment', icon: '', active: false })
      .AddTab({ id: 3, label: 'Recommendations', icon: '', active: false })
      .AddTab({ id: 4, label: 'Risk Ranking', icon: '', active: false });
    // .AddTab({ id: 5, label: 'Test Tab', icon: '', active: false });
  }
  ngAfterViewInit() {
    setTimeout(() => (this._isReady = true), 1);
    setTimeout(() => this.SetAnomalyTypeGroup(), 1);

    console.log("\nAnomAddEditPopupData:",this.data);
  }

  public AfterScatter(evt: any) {
    console.log(
      'AfterScatter(this.data.formData):',
      this.data.formData,
      'toggleDisplay:',
      this.toggleDisplay
    );
  }

  public get AssetInfo(): { code: string; desc: string } {
    //if(this.data.row)
    return {
      code: this.data.row.XTRA.NODE_ID,
      desc: this.data.row.XTRA.NODE_DESC,
    };
  }

  public get toggleDisplay(): Array<any> {
    return this.data.parent.ds.toggleYesNoNA;
    return this.data.parent.ds.toggleYesNo;
  }

  public AnomalyLookup(key: any) {
    return this.data.parent.AnomalyLookup(key);
  }

  private SetAnomalyTypeGroup() {
    const anType = this.formObject.get('AN_TYPE');
    const anTypeLookup = this.AnomalyTypeLookup();

    const anTypeItem =
      anType && anTypeLookup
        ? anTypeLookup.find((e) => e.key == anType.value)
        : null;
    const anTypeGroup = this.formObject.get('AN_TYPE_GROUP');

    if (anTypeGroup) {
      anTypeGroup.setValue(anTypeItem ? anTypeItem.group : null);
    }
  }
  public AnomalyTypeLookup() {
    const anTypeGroup = this.formObject.get('AN_TYPE_GROUP');
    let ret: Array<any> = this.AnomalyLookup('antype');
    if (anTypeGroup)
      if (anTypeGroup.value)
        ret = ret.filter((e) => e.group == anTypeGroup.value);
    return ret;
  }

  public TabClicked(tab: DataTab) {
    if (!tab.loaded) {
      // invoke scatter
      if (this.detailForm) {
        // a little delay is required to properly display bound data on the form!
        setTimeout(() => {
          this.detailForm.Scatter();
          tab.loaded = true;
        }, 1);
      }
    }
  }

  // public toggleDisplay: Array<{}> = [{ value: 1, display: 'Yes' },{ value: 0, display: 'No' }];

  public get activeTab(): DataTab {
    // if (!this.mainTabsOptions.activeTab)
    //   return new DataTab({ id: -1, label: 'unknown' });
    return this.mainTabsOptions.activeTab;
  }

  public setActiveTab(value: number) {
    if (this.activeTab.id != value) {
      const tab = this.mainTabsOptions.tabs.find((t) => t.id == value);
      this.TabClicked(tab);
    }
  }

  Save(dialogRef:any) {
    this.data.parent.SaveData(this.data.formObject,this.data.row,dialogRef);
  }

  Reset(dialogRef:any) {
    this.data.parent.ResetData(this.data.formObject, this.data.row);
  }

  private get dataSource(): any {
    if (!this.data) return null;
    if (!this.data.parent) return null;
    return this.data.parent.dataSource;
  }

  public get assetLookup():Array<any>{

    if(!this.data)return null;
    if(!this.data.row)return null;
    if(!this.data.row.XTRA)return null;

    return this.data.row.XTRA.assetLookup;
  }

  ChangeAsset(e: any) {
    const currAsset = this.formObject.get('AN_ASSET_ID').value;
    if (currAsset) {
      let lkpItem = this.assetLookup.find((i) => i.key == currAsset);
      this.data.currentLocation = lkpItem ? lkpItem.location : null;
    }
    this.dataSource
      .SelectAsset(this.data.currentLocation)
      .subscribe((result) => {

        if (result) {
          if (result.mode == 'accept') {
            const nodeData = result.data;
            // 1. create another entry in the asset lookup array if not yet existing.
            if (!this.assetLookup.find((i) => i.key == nodeData.dataId)) {
              // lookup item not yet existing. create and append one
              this.assetLookup.push({
                key: nodeData.dataId,
                code: nodeData.code,
                location: nodeData.location,
                text: nodeData.text,
              });
              // update asset grid lookup by calling the module's AddGridAssetLookupItem method
              this.data.parent.AddGridAssetLookupItem(nodeData.dataId,nodeData.text);
            }
            // 2. set value of AN_ASSET_ID control to the new asset key (nodeData.dataId)
            this.formObject.get('AN_ASSET_ID').setValue(nodeData.dataId);
          }
        }
      });
  }

  ChangeDate(e: any) {
    this.dataSource.SelectDate(e.source).subscribe((result) => {
      console.log(`Dialog result: ${result}`, e);
    });
  }

  public get formObject(): FormGroup {
    if (!this.data) return null;
    return this.data.formObject;
  }

  public get severity(): number {
    if (!this.data) return 0;
    if (!this.formObject) return 0;
    return this.formObject.get('AN_RISK_RANK_SEVERITY').value;
  }
  public set severity(value: number) {
    if (!this.formObject) return;
    this.formObject.get('AN_RISK_RANK_SEVERITY').setValue(value);
  }

  public get likelihood(): number {
    if (!this.data) return 0;
    if (!this.formObject) return 0;
    return this.formObject.get('AN_RISK_RANK_LIKELIHOOD').value;
  }
  public set likelihood(value: number) {
    if (!this.formObject) return;
    this.formObject.get('AN_RISK_RANK_LIKELIHOOD').setValue(value);
  }

  RiskClick(risk: { likelihood: number; severity: number }) {
    this.likelihood = risk.likelihood;
    this.severity = risk.severity;
  }

  private _isReady: boolean = false;
  public get isReady(): boolean {
    // in the future, this should be dicated by the required parameters in the form (eg. lookups, etc.)
    return this._isReady;
  }

  Test() {
    console.log(
      'this.detailForm.fieldsInitialized',
      this.detailForm.fieldsInitialized
    );
  }
}
