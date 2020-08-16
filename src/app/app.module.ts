import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// test/sandbox components
import { FontAwesomeComponent } from './sandbox/font-awesome/font-awesome.component';
import { MaterialsComponent } from './sandbox/materials/materials.component';

// contains all module imports related to Angular Materials/CDK
import { HttpClientModule } from '@angular/common/http';

// custom components
import { AppCommonMethodsService } from './api/svc/app-common-methods.service';
import { MainFrameComponent } from './cmp/main-frame/main-frame.component';

// contains all module imports related to Angular Materials/CDK
import { CoreModule } from './cmp/core.module';

// Application custom components

import { TreeViewSearchResultComponent } from './api/cmp/tree-view/tree-view-search-result/tree-view-search-result.component';
import { TestDataGridComponent } from './cmp/test-data-grid/test-data-grid.component';

@NgModule({
  declarations: [

    AppComponent,
    MainFrameComponent,

    TreeViewSearchResultComponent,
    TestDataGridComponent,

    FontAwesomeComponent,
    MaterialsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,

    CoreModule
  ],
  providers: [AppCommonMethodsService,Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
