import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import {
  DataGridComponent,
  DataGridOption,
} from '../data-grid/data-grid.component';

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss'],
})
export class TreeViewComponent implements OnInit, AfterViewInit {

  @ViewChild('treeWrapper') treeWrapper:any;
  @ViewChild('searchInput') searchInput:any;
  @ViewChild('searchGrid') searchGrid: DataGridComponent;
  @ViewChild('treeViewPort') treeViewPort: CdkVirtualScrollViewport;

  @Input() treeData: Array<TreeViewNode> = [];

  @Input() rootId: number = 0;
  @Input() nodeHeight: number = 20;
  @Input() nodeIndent: number = 20;

  @Input() treeLeftPadding: number = 5;
  @Input() colorDefinitions: any = null;
  @Input() rollupColorData: Array<any> = [];

  @Input() showCode: boolean = true;
  @Input() statusColor: {};

  @Input() searchMaxDisplayRows:number = 10;

  @Output() nodeClick: EventEmitter<any> = new EventEmitter();
  @Output() nodePMClick: EventEmitter<any> = new EventEmitter();
  @Output() nodeZoomClick: EventEmitter<any> = new EventEmitter();

  @Output() searchTreeClick: EventEmitter<any> = new EventEmitter();
  @Output() selectSearchedItem: EventEmitter<any> = new EventEmitter();

  constructor() {}

  public panelOpenState: boolean = false;
  public gridOptions = new DataGridOption([]);
  public searched: boolean = false;
  public searching: boolean = false;

  public searchError: string = '';
  public get searchPrompt(): string {
    if (this.searching) return `Searching for '${this.toSearch}'...`;
    return this.searchError
      ? this.searchError
      : `Found with '${this.toSearch}': ${this.searchResult.length}`;
  }

  private _toSearch: string = '';
  public get toSearch(): string {
    return this._toSearch;
  }

  ngOnInit(): void {
    // console.log(this.td,this.FlatTree());
    //this.ProcessTree();
  }

  ngAfterViewInit() {
    this.gridOptions
      .SetRowHeaderHeight(24)
      .SetRowHeaderWidth(6)
      .NoFooter // .AddColumn({
      //   caption: 'Id',
      //   fieldName: 'id',
      //   visible:false,
      //   isKey: true,
      //   width:1
      // })
      .AddColumn({ caption: 'Code', fieldName: 'code', maxWidth: 100 ,allowFilter:false})
      .AddColumn({ caption: 'Name', fieldName: 'text', minWidth: 100 ,allowFilter:false})
      .ShowColumns(['code','text'])
      .SetKeyColumnName('id');

  }

  private _rootNode: TreeViewNode = null;
  public get rootNode(): TreeViewNode {
    return this._rootNode;
  }

  private _dataIndex: any = {};
  private _nodeIndex: any = {};
  public SetNodeIndex(node: TreeViewNode) {
    this._nodeIndex['n' + node.id] = node;
    this._dataIndex['d' + node.did] = node;
  }

  public GetNodeByDataId(id: number): TreeViewNode {
    return this._dataIndex['d' + id];
  }
  public GetNodeByNodeId(id: number): TreeViewNode {
    return this._nodeIndex['n' + id];
  }

  public isGlobalAction: boolean;
  public ExpandAll() {
    this.isGlobalAction = true;
    setTimeout(() => {
      this.treeData.forEach((n: TreeViewNode) => (n.exp = n.ccnt != 0));
      this.ProcessTree();
      this.isGlobalAction = false;
    }, 20);
  }
  public CollapseAll() {
    this.isGlobalAction = true;
    setTimeout(() => {
      this.treeData.forEach((n: TreeViewNode) => (n.exp = n.level == 0));
      this.ProcessTree();
      this.isGlobalAction = false;
    }, 20);
  }

  public CollapseAllToLevel() {
    if (this._maxLevel <= 1) return; // cannot collpase anymore

    this.isGlobalAction = true;

    setTimeout(() => {
      this.treeData.forEach((n: TreeViewNode) => {
        n.exp = n.level < this._maxLevel && n.ccnt > 0;
      });
      this._maxLevel--;
      this.ProcessTree();
      this.isGlobalAction = false;
    }, 20);
  }

  public ProcessTree(setInitialNode?: boolean, level?: number) {
    this._FlatTree = this.SetFlatTree(this._rootNode, level);

    const initId = this._rootNode ? this._rootNode.id : this.rootId;

    if (setInitialNode) {
      const root = this.treeData.find((n) => n.id == initId);
      if (root) this.NodeClick(root);
    }
  }

  public ToggleCode() {
    this.showCode = !this.showCode;
  }

  public NodeClick(n: any) {
    const currentNode = this.treeData.find((r) => r.current);
    if (currentNode != null) currentNode.current = false;
    n.current = true;
    this.nodeClick.emit(n);
  }

  public get currNode(): TreeViewNode {
    return this.treeData.find((r) => r.current);
  }

  public get NodePath(): string {
    let currentNode = this.treeData.find((r) => r.current);
    if (!currentNode) return '/';
    let ret: string = currentNode.text;
    while (currentNode.id != this.rootId) {
      currentNode = this.treeData.find((r) => r.id == currentNode.pid);
      if (!currentNode) break;
      ret = currentNode.text + ' / ' + ret;
    }
    return ret;
  }

  private _searchResult: Array<any> = [];
  public get searchResult(): Array<any> {
    return this._searchResult;
  }

  private _FlatTree: Array<TreeViewNode> = [];
  get FlatTree(): Array<TreeViewNode> {
    return this._FlatTree;
  }

  private _SearchResultHeight: number = 200;
  public get SearchResultHeight(): number {
    // return 200;
    return this._SearchResultHeight;
    //return this._SearchResultHeight;
  }

  private _maxLevel: number = 0;
  SetFlatTree(node?: TreeViewNode, level?: number): Array<TreeViewNode> {
    if (this.treeData.length == 0) return [];

    let ret: Array<TreeViewNode> = [];

    if (node == undefined) {
      node = this.treeData.find((n) => n.id == this.rootId);
      this._maxLevel = 0;
    } else {
    }

    const currRootId = this._rootNode ? this._rootNode.id : this.rootId;
    if (node.id == currRootId) level = 0;

    node.level = level;

    // set icon color here! ******************************************************************************

    // temporarily assign node color
    // switch (node.level) {
    //   case 0:
    //     node.sta = 'red';
    //     break;
    //   case 1:
    //     node.sta = 'ora';
    //     break;
    //   case 2:
    //     node.sta = 'grn';
    //     break;
    // }

    this._maxLevel = node.level;
    ret.push(node);

    if (node.exp) {
      let children: Array<TreeViewNode> = this.treeData.filter(
        (n) => n.pid == node.id && n.id != 0
      );
      children.forEach((n) => {
        this.SetFlatTree(n, level + 1).forEach((n2) => {
          ret.push(n2);
        });
      });
    }

    return ret;
  }

  TreeData() {
    return JSON.stringify(this.treeData);
  }

  NodeZoomClick() {
    if (!this.currNode) {
      this.nodeZoomClick.emit(null);
    } else {
      // perform zoom
      this._rootNode = this.currNode;
      this.NodePMClick(this._rootNode, true);
      //this.ProcessTree(); //this.SetFlatTree(node);
      this.nodeZoomClick.emit({ node: this._rootNode, options: {} });
    }
  }

  NodeUnZoomClick() {
    this._rootNode = null;
    this.ProcessTree();
  }

  NodePMClick(node: any, expand?: boolean) {
    // skip routine if pm is not available
    if (node.ccnt == 0) return;
    // if (this.NodePM(node) == '') return;

    if (!expand) expand = false;

    if (this.treeData.find((n) => n.pid == node.id) == null) {
      this.nodePMClick.emit({
        node: node,
        options: { childNodesMissing: true },
      });
      return;
    }
    node.exp = !node.exp || expand;
    this.nodePMClick.emit({ node: node, options: {} });
    this.ProcessTree();
  }

  NodePMCursor(node: any): string {
    return this.treeData.find((n) => n.pid == node.id) == null
      ? 'default'
      : 'pointer';
  }

  NodePMColor(node: any) {
    return this.treeData.find((n) => n.pid == node.id) == null
      ? 'moccasin'
      : 'black';
  }

  NodePMX(node: any): string {
    const chiNode = this.treeData.find((n) => n.pid == node.id);

    let ret: string = '';
    if (chiNode || node.ccnt > 0) {
      if (node.exp) {
        ret = '-';
      } else {
        ret = '+';
      }
    }

    return ret;
  }

  NodePM(node: any): any {
    const chiNode = this.treeData.find((n) => n.pid == node.id);
    const chi = chiNode || node.ccnt > 0;
    return {
      fa: true,
      'fa-minus': node.exp && chi,
      'fa-plus': !node.exp && chi,
    };
  }

  NodeText(n: TreeViewNode) {
    if (!this.showCode) return n.text;
    return (n.code ? n.code + ' - ' : '') + n.text;
    !this.showCode ? n.text : n.text;
  }

  NodeIconColor(n: TreeViewNode): string {
    const cdef = this.colorDefinitions;

    if (this.colorDefinitions == null) return cdef.default;

    // process node status only when status is not set yet (i.e. value = -1 or 0 or null or undefined)
    if ((!n.sta || n.sta == -1) && this.rollupColorData.length != 0) {
      // set node colorNodeIconColor

      // get all nodes with location starting with the current's node location (entire branch)
      const arr = this.rollupColorData.filter(
        (e) => e.location.substr(0, n.loc.length) == n.loc
      );
      if (arr.length) {
        // get maximun (worst) status level
        const max = arr.reduce((prev, current) =>
          prev.status > current.status ? prev : current
        );
        // apply maximum status to the node
        n.sta = max.status;
      } else {
        // apply neutral color
        n.sta = -2;
      }
    }

    switch (n.sta) {
      case undefined:
        return cdef.default;
      case 8472:
        return cdef.danger;
      case 8471:
        return cdef.warning;
      case 8470:
        return cdef.success;
      default:
        return cdef.secondary;
    }
  }
  NodeIcon(n: TreeViewNode): string {
    return n.exp ? 'fa fa-folder-open' : 'fa fa-folder';
  }

  SetButtonTitle(type: string): string {
    if (type == 'exp_all') {
      return 'Expand all nodes.';
    } else if (type == 'col_all') {
      return 'Collapse all nodes to level after root node.';
    } else if (type == 'zoom_tree') {
      return 'Set current node as root';
    } else if (type == 'unzoom_tree') {
      return 'Set root node to default';
    } else if (type == 'search_tree') {
      return 'Search node on the tree';
    } else if (type == 'show_code') {
      return 'Toggle item code visibility...';
    } else if (type == 'col_level') {
      return 'Collapse nodes one level up.';
    }
    return '!Sorry. This action is not yet avialable...';
  }

  InpuKeyEvent(e: any) {
    let code:string = ''
    if(e.type=='click'){
      code = 'Enter';
    }else{
      code = e.code;
    }

    switch (code) {
      case 'Enter':
      case 'NumpadEnter':
        // entry accepted
        const srcElem = this.searchInput.nativeElement;
        this._toSearch = srcElem.value;
        if (this._toSearch.length == 0) return;

        if (this._toSearch.length < 3) {
          this.searchError = 'Minimum search string length is 3 characters';
          return;
        }

        srcElem.value = '';
        this.searchError = '';
        this._searchResult.splice(0, this._searchResult.length);
        this._SearchResultHeight = 0;

        this.searching = true;
        this.searched = false;

        setTimeout(() => {
          this.SearchTree(this.toSearch);
        }, 50);
        break;
      default:
        // console.log("OTHERWISE:",e);
    }
  }

  SearchTree(searchText: string) {
    this.searchTreeClick.emit({
      searchText: searchText,
      treeView: this,
      feedback: this.SearchTreeListener,
    });
  }

  SearchTreeListener(result: any) {
    // if result is empty, prompt user that the item being searched is not found
    // if result contains only 1 item, select and focus on the tree immediately
    // if result contains more that 1 item, popup search result listing all
    // items to allow user to choose the correct item

    const tree = result.treeView;

    // local search result
    tree._searchResult = result.data;

    tree._SearchResultHeight =
      Math.min(tree._searchResult.length, tree.searchMaxDisplayRows) * tree.gridOptions.rowHeight +
      (tree._searchResult.length != 0 ? tree.gridOptions.rowHeaderHeight : 0);

    if (tree._searchResult.length == 1) {
      // if single node is found, set it to current
      tree.SetCurrentNode(tree._searchResult[0].loc);
    } else {
      // display search result grid to allow the user to
      // select node to make current
      setTimeout(() => {
        // set flags
        tree.searched = true;
        tree.searching = false;
        // refresh search grid
        tree.searchGrid.Refresh();
      }, 50);
    }
  }

  onFocus(e:any){
    e.srcElement.blur();
  }

  public get searchCount(): number {
    return this._searchResult.length;
  }

  public ResetStatus(setStatusTo?: number) {
    // will set all loaded tree node data to common status
    this.treeData.forEach((n: TreeViewNode) => {
      n.sta = setStatusTo ? setStatusTo : -1;
    });
    this.ProcessTree();
  }

  // SearchRowClick(e: { row: any; e: any }) {
  SearchRowClick(e: any) {
    // console.log("\nE:",e)
    // this.SetCurrentNode(e.row.loc);
    this.SetCurrentNode(e.loc)
  }

  SetCurrentNode(loc: string, tree?: TreeViewComponent) {
    // find node in treeData

    // if found
    //    expand all its parents, refresh tree and focus on the node
    // not found
    //    send request to extract all immediate children of its parents (excluding the root node)
    //    on response,
    //        expand all its parents, refresh tree and focus on the node

    // loop through parents search only

    // when tree parameter is supplied, SetCurrentNode is executing as feedback called from an Output function
    // else, it is executing called from within the component
    if (!tree) tree = this;

    const LEVEL_CHARS = 2;
    const dat = tree.treeData;
    let parents: Array<string> = [];
    const node: TreeViewNode = dat.find((f) => f.loc == loc);

    if (!node) {
      for (let i = 0; i < loc.length - LEVEL_CHARS; i += 2) {
        const par = loc.substring(0, i + LEVEL_CHARS);
        const parNode = dat.find((f) => f.loc == par);
        if (parNode) {
          // check children
          const chiArr = dat.filter((n) => n.pid == parNode.id);
          // when children of a parent not found, add parent to the filter location value
          if (chiArr.length == 0) parents.push(par);
        }
        // when parent is not found, add parent to the filter location value
        else parents.push(par);
      }

      if (parents.length != 0) {
        // call request
        tree.selectSearchedItem.emit({
          location: loc,
          parents: parents,
          treeView: tree,
          feedback: tree.SetCurrentNode,
        });
      }
    } else {
      // node found, simply expand all parents, and make the node found
      // current, then call ProcessTree method.

      // collect all parents
      for (let i = 0; i < loc.length - LEVEL_CHARS; i += 2) {
        const par = loc.substring(0, i + LEVEL_CHARS);
        const parNode: TreeViewNode = dat.find((f) => f.loc == par);
        // expand parent
        parNode.exp = true;
      }

      // find node with current flag set
      const currNode: TreeViewNode = dat.find((f: TreeViewNode) => f.current);
      if (currNode) currNode.current = false;

      // single search result, and focused, close search window
      if (tree.searchResult.length == 1) {
        tree.searched = false;
        tree.searching = false;
        tree._SearchResultHeight = 0;
      }

      // set found node to current
      node.current = true;

      // process tree
      tree.ProcessTree();

      // trigger host set current node event

      setTimeout(() => {
        const gotToIndex = tree._FlatTree.indexOf(node);
        tree.treeViewPort.scrollToIndex(gotToIndex);
        tree.NodeClick(node);
      }, 50);
    }
  }
}

export class TreeViewNode {
  constructor(
    public id: number, // node id
    public pid: number, // parent node id
    public did?: number, // data id
    public code?: string, // short description
    public text?: string, // long description
    public exp?: boolean, // expanded flasg
    public current?: boolean, // current node flaf
    public ccnt?: number, // children node count
    public loc?: string, // node location code on tree
    public data?: Array<any>, //
    public treeView?: TreeViewComponent
  ) {
    if (text == undefined) text = 'Node ' + id;
    if (exp == undefined) exp = false;
    if (current == undefined) current = false;
    if (ccnt == undefined) ccnt = 0;
    if (did == undefined) did = 0;
    if (loc == undefined) loc = '';
    if (data == undefined) data = [];

    if (treeView != undefined) {
      // set index
      treeView.SetNodeIndex(this);
    }
  }

  public level: number = 0;
  public isChildNodesLoading: boolean = false;

  private _dataIndex: number = 0;
  public get dataIndex(): number {
    return this._dataIndex;
  }
  public set dataIndex(value: number) {
    this._dataIndex = value;
  }

  private _countsArray: Array<number> = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
  ];

  public getDataCount(index: number): number {
    return this._countsArray[index];
  }
  public setDataCount(value: number, index: number) {
    this._countsArray[index] = value;
  }

  private _statsArray: Array<number> = [
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
  ];

  public get sta(): number {
    return this._statsArray[this.dataIndex];
  }
  public set sta(value: number) {
    this._statsArray[this.dataIndex] = value;
  }
}
