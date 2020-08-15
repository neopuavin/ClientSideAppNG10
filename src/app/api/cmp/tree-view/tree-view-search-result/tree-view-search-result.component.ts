import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tree-view-search-result',
  templateUrl: './tree-view-search-result.component.html',
  styleUrls: ['./tree-view-search-result.component.scss']
})
export class TreeViewSearchResultComponent implements OnInit {

  @Input() data: any = {};

  constructor() { }

  ngOnInit(): void {
  }

}
