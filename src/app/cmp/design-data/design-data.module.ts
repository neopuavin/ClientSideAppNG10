import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APIModule } from './../../api/api.module';

import { DesignDataComponent } from './design-data.component';
import { DesignDataGeneralComponent } from './design-data-general/design-data-general.component';
import { DesignDataKpbasedataComponent } from './design-data-kpbasedata/design-data-kpbasedata.component';
import { DesignDataHistoryComponent } from './design-data-history/design-data-history.component';
import { DesignDataAttachmentComponent } from './design-data-attachment/design-data-attachment.component';

const declare = [
  DesignDataComponent,
  DesignDataGeneralComponent,
  DesignDataKpbasedataComponent,
  DesignDataHistoryComponent,
  DesignDataAttachmentComponent
];

@NgModule({
  declarations: declare,
  exports: declare,
  imports: [CommonModule, APIModule],
})
export class DesignDataModule {}
