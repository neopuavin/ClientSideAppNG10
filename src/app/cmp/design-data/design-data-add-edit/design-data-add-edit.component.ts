
import { CommonPopupComponent } from './../../common-popup/common-popup.component';
import { AppFormAComponent } from './../../../api/cmp/app-form-a/app-form-a.component';
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
  selector: 'app-design-data-add-edit',
  templateUrl: './design-data-add-edit.component.html',
  styleUrls: ['./design-data-add-edit.component.scss']
})
export class DesignDataAddEditComponent implements OnInit, AfterViewInit {

  @ViewChild('detailForm') detailForm: AppFormAComponent;

  @Input() data: any = {};

  constructor(
    @Inject(CommonPopupComponent) public popUp: CommonPopupComponent
  ) {}

  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    setTimeout(() => (this._isReady = true), 1);
    //setTimeout(() => this.SetDesignDataParTypeGroup(), 1);

    console.log('\nDesignDataAddEditPopupData:', this.data);
  }

  public AfterScatter(evt: any) {
    console.log(
      'AfterScatter(this.data.formData):',
      this.data.formData
    );
  }

  public get AssetInfo(): { code: string; desc: string } {
    //if(this.row)
    return {
      code: this.row.XTRA.NODE_ID,
      desc: this.row.XTRA.NODE_DESC,
    };
  }


  public DesignDataLookup(key: any) {
    return this.data.parent.DesignDataLookup(key);
  }

  public DesignDataNameLookup() {
    let ret: Array<any> = this.DesignDataLookup('desprm');
    return ret;
  }

  private SetDesignDataParTypeGroup() {
    const anType = this.formObject.get('DD_PARAM');
    const anTypeLookup = this.DesignDataTypeLookup();

    const anTypeItem =
      anType && anTypeLookup
        ? anTypeLookup.find((e) => e.key == anType.value)
        : null;
    const anTypeGroup = this.formObject.get('DD_PARAM_TYPE');

    if (anTypeGroup) {
      anTypeGroup.setValue(anTypeItem ? anTypeItem.group : null);
    }
  }
  public DesignDataTypeLookup() {
    const anTypeGroup = this.formObject.get('DD_PARAM_TYPE');
    let ret: Array<any> = this.DesignDataLookup('desprm');
    if (anTypeGroup)
      if (anTypeGroup.value)
        ret = ret.filter((e) => e.group == anTypeGroup.value);
    return ret;
  }


  Save(dialogRef: any) {
    const archive: any = {};
    let xtraParam: any = null;
    let userStamps: Array<string> = null;
    let dateStamps: Array<string> = null;

    let recolorRequired: boolean = false;
    let isNew: boolean = this.row['DD_ID'] < 0;

    const changed = this.data.parent.DataChanged(
      this.formObject,
      this.row,
      isNew
    );

    if (changed) {
      // data pre-processing

      // enumerate date and user stamp fields
      // userStamps = [isNew ? 'AN_RAISED_BY' : 'AN_UPD_BY'];
      // dateStamps = [isNew ? 'AN_RAISED_DATE' : 'AN_UPD_DATE'];

      // if (changed['AN_ASSMNT'] != undefined) {
      //   userStamps.push['AN_ASS_BY'];
      //   dateStamps.push['AN_ASS_DATE'];
      // }

      // if (changed['AN_TA_APPROVED'] != undefined) {
      //   userStamps.push['AN_TA_NAME'];
      //   dateStamps.push['AN_TA_APPR_DATE'];
      // }

      if (
        changed['DD_ASSET'] != undefined ||
        isNew
      )
        recolorRequired = true;
    }




    this.data.showMask = true;

    setTimeout(() => {
      this.data.parent.SaveData({
        form: this.formObject,
        row: this.row,
        isNew: isNew,
        extraPostParam: xtraParam,
        userStampFields: userStamps,
        dateStampFields: dateStamps,
        revField: isNew ? '' : 'AN_REVNO',
        dialogRef: dialogRef,

        requeryGrid:recolorRequired,
        requeryDetails:!isNew,
        recolorTree:recolorRequired,
        assetId:this.formObject.get('DD_ASSET').value,

        messages: {
          msgWarning: isNew
            ? 'You are about to save newly created design data.<br/><br/>Do you want to continue?'
            : undefined,
          msgSuccess: isNew ? 'New design data created.' : undefined,
        },
        onSuccess: (data?:any) => {
          // if (dialogRef) dialogRef.close({ mode: 'saved' });

          // if (recolorRequired) {
          //   this.ResetTreeStatus();
          //   const searchLocation = this.assetLookup.find(
          //     (a) => a.key == this.formObject.get('DD_ASSET').value
          //   );
          //   if (searchLocation) {
          //     this.data.parent.treeView.SetCurrentNode(searchLocation.location);
          //   }
          //   //console.log("ASSET LOOKUP:" , this.assetLookup,  this.formObject.get('DD_ASSET').value);
          //   //this.data.parent.treeView.SetCurrentNode();
          // }
          // if (isNew) refresh list
        },
        onError: (err) => {
          console.log('\nError posting data:', err);
          this.data.showMask = false;
        },
        onCancel: (res) => {
          this.data.showMask = false;
        },
      });
    }, 10);
  }

  /** form,
      row,
      dialogRef,
      extraPostParam,
      userStampFields,
      dateStampFields,
      revField,
      onSuccess,
      onError,
      messages, */

  Reset(dialogRef: any) {
    //this.data.showMask = true;
    this.data.parent.ResetData(this.formObject, this.row);
    //setTimeout(()=>{this.data.showMask=false},2000);
  }

  private get dataSource(): any {
    if (!this.data) return null;
    if (!this.data.parent) return null;
    return this.data.parent.dataSource;
  }

  public get assetLookup(): Array<any> {
    if (!this.data) return null;
    if (!this.row) return null;
    if (!this.row.XTRA) return null;

    return this.row.XTRA.assetLookup;
  }

  ChangeAsset(e: any) {
    const currAsset = this.formObject.get('DD_ASSET').value;
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
              this.data.parent.AddGridAssetLookupItem(
                nodeData.dataId,
                nodeData.text
              );
            }
            // 2. set value of DD_ASSET control to the new asset key (nodeData.dataId)
            this.formObject.get('DD_ASSET').setValue(nodeData.dataId);
          }
        }
      });
  }

  ChangeDate(e: any) {
    // this.dataSource.SelectDate(e.source).subscribe((result) => {
    //   console.log(`Dialog result: ${result}`, e);
    // });
  }

  ResetTreeStatus() {
    if (!this.data) return;
    if (!this.data.parent.ResetTreeStatus) return;
    setTimeout(() => {
      console.log(
        'this.data.parent.ResetTreeStatus:',
        this.data.parent.ResetTreeStatus
      );
      this.data.parent.ResetTreeStatus();
    }, 50);
  }

  public get formObject(): FormGroup {
    if (!this.data) return null;
    return this.data.formObject;
  }

  public get row(): any {
    if (!this.data) return null;
    return this.data.row;
  }


  private _isReady: boolean = false;
  public get isReady(): boolean {
    // in the future, this should be dicated by the required parameters in the form (eg. lookups, etc.)
    return this._isReady;
  }

}

