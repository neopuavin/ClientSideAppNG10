import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  ContentChild,
  TemplateRef,
} from '@angular/core';

@Component({
  selector: 'app-data-tabs',
  templateUrl: './data-tabs.component.html',
  styleUrls: ['./data-tabs.component.scss'],
})
export class DataTabsComponent implements OnInit, AfterViewInit {
  @Input() name: string = 'data_tab';
  @Input() options: DataTabsOption;
  @Input() height: number = -1;
  @Input() fluid: boolean = false;

  @Input() activeForeground:string = null;
  @Input() activeBackground:string = null;

  @Input() withClose:boolean = false;

  @Output() tabClicked: EventEmitter<any> = new EventEmitter();

  @ViewChild('tabWrapper') tabWrapperObj: any;
  tabWrapper: HTMLElement = null;

  @ContentChild(TemplateRef) tabContent: TemplateRef<any>;

  constructor() {}

  ngOnInit(): void {}

  private initialized: boolean = false;
  ngAfterViewInit() {
    this.tabWrapper = this.tabWrapperObj.nativeElement;

    if (this.tabWrapper) {
      // console.log(
      //   this.tabWrapperObj,
      //   this.tabWrapper,
      //   this.tabWrapper.parentElement.parentElement.offsetHeight
      // );
    }

    // passing through a setTimeout a setting for a flag solves the problem of
    // unwanted exception error thrown when bound property value is changed
    // while rendering the view.
    setTimeout(() => {
      this.initialized = true;
    }, 0);



    console.log("TAB options:",this.options);
  }

  public get dataTabHeight(): number {
    if (!this.initialized || this.height != -1 || !this.tabWrapper)
      return this.height != -1 ? this.height : 100;

    return this.tabWrapper.parentElement.parentElement.offsetHeight;
  }

  public get activeTab(): any {
    return this.options.tabs.find((t) => t.active);
  }

  TabClicked(tab: DataTab) {
    //
    this.activeTab.active = false;
    tab.active = true;
    const btn = (document.querySelector('#t_'+ tab.id)  as HTMLElement);
    if(btn)btn.blur();
    //console.log(btn);

    this.tabClicked.emit(tab);
  }
}

export interface IDataTab {
  id: number;
  label: string;
  toolTip?: string;
  icon?: string;
  active?: boolean;
  loaded?: boolean;
  order?: number;
  parentOption?: DataTabsOption;
  withClose?:boolean;
}

export class DataTab {
  constructor(args: IDataTab) {
    if (args.icon == undefined) args.icon = '';
    if (args.active == undefined) args.active = false;

    this.id = args.id;
    this.label = args.label;
    this.icon = args.icon ? args.icon : '';
    // this.icon = args.icon;
    this.active = args.active ? args.active : false;
    this.toolTip = args.toolTip;
    this.withClose = args.withClose;

  }
  public id: number;
  public label: string;
  public toolTip: string;
  public icon?: string;
  public active?: boolean;
  public loaded?: boolean;
  public order: number;
  public withClose: boolean;
  public parentOption?: DataTabsOption;
}

export class DataTabsOption {
  constructor(public tabs: Array<DataTab>, args?: {}) {
    if (args != undefined) {
      // set other properties
    }
  }

  private _tabsIndices:Array<number>=[]
  public AddTab(args: IDataTab): DataTabsOption {

    // the next 3 lines prevents re-creation of tab element if
    // the tab id is already recorded in _tabIndices
    const id = args.id;
    if(this._tabsIndices.indexOf(id)!=-1) return;
    this._tabsIndices.push(id);

    const tab = new DataTab(args);
    tab.parentOption = this;
    tab.order = this.tabs.length;
    tab.order = args.order ? args.order : this.tabs.length;

    this.tabs.push(tab);
    return this;
  }

  public get activeTab(): DataTab {
    return this.tabs.find((t) => t.active);
  }
}
