import { FormGroup, AbstractControl } from '@angular/forms';
import { CommonPopupComponent } from './../cmp/common-popup/common-popup.component';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

import { AppDataset } from './app-dataset.service';
import { AppCommonMethodsService } from './../api/svc/app-common-methods.service';

import * as appConfig from '../../assets/config/cfg.json';
import {
  MatDialog,
  MatDialogRef,
  MatDialogConfig,
} from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class AppMainServiceService {
  public DataSources: Array<IAppDataset> = [];

  // private _ActiveSource: IAppDataset = {
  //   name: 'spex',
  //   appDataset: new AppDataset(this.http, this.apiCommon, ''),
  // };

  private _ActiveSource: IAppDataset = null;
  public get ActiveSource(): IAppDataset {
    return this._ActiveSource;
  }

  public set SourceName(name: string) {
    // set active source by name
    // assignment of source name will be done on initial load
    // where the name of the default opco will be set,
    // if no default OpCo is configured, then the name
    // of the first OpCo in the stack will be set

    // deactivate current active data source
    const aDS = this.DataSources.find((d) => d.active);
    if (aDS) aDS.active = false;

    // activate selected data source
    const sDS = this.DataSources.find((d) => d.name == name);
    sDS.active = true;

    // set local variable to the selected data source
    this._ActiveSource = sDS;
  }

  constructor(
    public http: HttpClient,
    public apiCommon: AppCommonMethodsService,
    public dialog: MatDialog,
    private titleService: Title,
    private _snackBar: MatSnackBar
  ) {
    // declare datasets for each configured OpCo
    appConfig.DataSources.forEach((e: IDataSource) => {
      this.DataSources.push({
        name: e.name,
        appDataset: new AppDataset(this.http, this.apiCommon, {
          apiUrl:
            e.url_use_deploy || location.hostname != 'localhost'
              ? (location.hostname.toLowerCase().indexOf('soga-s-01') == -1 ? e.url_deploy: e.url_soga)
              : e.url_local,
          appTitle: e.app_title,
          appHeader: e.app_header_main,
          appHeaderSub: e.app_header_sub,
          appTree: e.tree_definition,
        }),
        active: false,
      });
    });

    // SET INITIAL DATASET (AppDataSet)
    // find if there is initial active datasource that was set
    // and set the first one if there is none
    const aDS = this.DataSources.find((d) => d.active);

    if (!aDS) {
      const source = this.DataSources[0];
      const sourceData = source.appDataset.data;
      this.SourceName = source.name;

      this.titleService.setTitle(
        sourceData['appTitle'] ? sourceData['appTitle'] : 'IMSA'
      );
    }

    //this.titleService.setTitle(this.title);
  }

  public set sourceData(value: string) {
    // to be developed and used to set current application DataSet ...
  }

  openSnackBar(
    message: string,
    action?: string,
    duration?: number,
    horizontalPosition?: any,
    verticalPosition?: any
  ) {
    if (!horizontalPosition) horizontalPosition = 'end';
    if (!verticalPosition) verticalPosition = 'bottom';
    if (!duration) duration = 500;
    this._snackBar.open(message, action ? action : '', {
      duration: duration,
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
    });
  }

  OpenPopup(
    component: string,
    width?: number,
    height?: number,
    disableClose?: boolean,
    data?: {}
  ): Observable<any> {
    if (!width) width = 300;
    if (!height) height = 200;
    if (!disableClose) disableClose = false;

    if (!data) data = {};
    if (!data['component']) data['component'] = component;
    let ref: MatDialogRef<CommonPopupComponent, any>;
    data['ref'] = ref;

    ref = this.dialog.open(CommonPopupComponent, {
      width: `${width}px`,
      height: `${height}px`,
      disableClose: disableClose,
      data: data,
    });

    return ref.afterClosed();

    // dialogRef.afterClosed().subscribe((result) => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }

  SelectAsset(currentLocation?: string): Observable<any> {
    return this.OpenPopup('assetSelector', 420, 550, false, {
      title: 'Asset Selector',
      icon: 'fa-sitemap',
      dataSource: this,
      currentLocation: currentLocation,
      buttons: [
        { label: 'Select', value: 'accept', class: 'btn btn-sm btn-warning' },
        { label: 'Close', value: 'close', class: 'btn btn-sm btn-secondary' },
      ],
    });
  }

  Confirm(
    title?: string,
    message?: string,
    options?: {
      icon?: string;
      labelNo?: string;
      labelYes?: string;
      labelContinue?: string;
      width?: number;
      height?: number;
    }
  ): Observable<any> {
    // confirm actions - Ignore
    let buttons: Array<any> = []; // default labels
    let icon: string;
    let width: number = 550;
    let height: number = 150;

    if (!title) title = 'Alert';
    if (!message) message = 'Please confirm';

    if (options) {
      if (options.width) width = options.width;
      if (options.height) height = options.height;
      if (options.height) icon = options.icon;

      if (options.labelContinue)
        buttons.push({
          label: options.labelContinue,
          value: 'continue',
          class: 'btn btn-sm btn-secondary',
        });
      if (options.labelNo)
        buttons.push({
          label: options.labelNo,
          value: 'no',
          class: 'btn btn-sm btn-secondary',
        });
      if (options.labelYes)
        buttons.push({
          label: options.labelYes,
          value: 'yes',
          class: 'btn btn-sm btn-warning',
        });
    }

    if (buttons.length == 0) {
      buttons.push({
        label: 'Ok',
        value: 'ok',
        class: 'btn btn-sm btn-warning',
      });
      if (!icon) icon = 'fa-info-circle';
    } else if (buttons.length == 1 && !icon)  icon = 'fa-info-circle';
    else if(!icon) icon = 'fa-question-circle';

    return this.OpenPopup('alert', width, height, false, {
      title: title,
      message: message,
      icon: icon,
      buttons: buttons,
      disableClose: true,
    });
  }

  SelectDate(e: any): Observable<any> {
    const label = e.label;
    return this.OpenPopup('datePicker', 400, 450, false, {
      title: `Select Date/Time${label ? ' for ' + label : ''}`,
      icon: 'fa-calendar-alt',
      buttons: [
        { label: 'Close', value: 'close', class: 'btn btn-sm btn-warning' },
      ],
    });
  }
}

export interface IAppDataset {
  name: string;
  appDataset: AppDataset;
  active: boolean;
}

export interface IDataSource {
  name: string;

  app_title: string;
  app_header_main: string;
  app_header_sub: string;
  tree_definition: Array<{
    tree_id: number;
    name: string;
    roots: Array<{ location: string; id: number }>;
  }>;
  url_deploy: string;
  url_local: string;
  url_soga: string;
  url_use_deploy: boolean;

  /**app_title": "SPEX - IMSA",
      "  app_title:string;
":"Integrity Management System Application - IMSA",
      "app_header_sub": */
}
