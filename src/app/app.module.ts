import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeComponent } from './sandbox/font-awesome/font-awesome.component';
import { MaterialsComponent } from './sandbox/materials/materials.component';

// contains all module imports related to Angular Materials/CDK
import { HttpClientModule } from '@angular/common/http';

// custom components
import { AppCommonMethodsService } from './api/svc/app-common-methods.service';
import { MainFrameComponent } from './cmp/main-frame/main-frame.component';

// contains all module imports related to Angular Materials/CDK
import { MaterialModule } from './material.module';
import { CoreModule } from './cmp/core.module';
import { APIModule } from './api/api.module';

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
    ReactiveFormsModule,
    MaterialModule,
    APIModule,
    CoreModule
  ],
  providers: [AppCommonMethodsService,Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
