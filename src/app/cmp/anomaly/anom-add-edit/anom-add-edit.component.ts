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
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
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

  constructor() {}

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

    setTimeout(()=>this._isReady=true,50)
    setTimeout(() => this.SetAnomalyTypeGroup(), 60);

  }

  public AfterScatter(evt: any) {
    console.log('AfterScatter:', evt);
  }

  public get AssetInfo():{code:string, desc:string}{
    //if(this.data.row)
    return {code:this.data.row.XTRA.NODE_ID,desc:this.data.row.XTRA.NODE_DESC};
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
        }, 100);
      }
    }
  }

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

  ChangeAsset(e: any) {
    this.data.parent.dataSource.SelectAsset().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ChangeDate(e:any){
    this.data.parent.dataSource.SelectDate(e.source).subscribe((result) => {
      console.log(`Dialog result: ${result}`,e);
    });
  }

  public get formObject(): FormGroup {
    if (!this.data) return null;
    return this.data.formObject;
  }

  public get severity(): number {
    if (!this.data.row) return 0;
    return this.data.row.AN_RISK_RANK_SEVERITY;
  }
  public set severity(value:number){
    this.data.row.AN_RISK_RANK_SEVERITY = value;
  }

  public get likelihood(): number {
    if (!this.data.row) return 0;
    return this.data.row.AN_RISK_RANK_LIKELIHOOD;
  }
  public set likelihood(value:number){
    this.data.row.AN_RISK_RANK_LIKELIHOOD = value;
  }

  RiskClick(risk:{likelihood:number, severity:number}){
    this.likelihood = risk.likelihood;
    this.severity = risk.severity;
  }

  private _isReady:boolean = false;
  public get isReady():boolean{
    // in the future, this should be dicated by the required parameters in the form (eg. lookups, etc.)
    return this._isReady;
  }

}
