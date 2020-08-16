import { APIModule } from './../../api/api.module';
import { AnomAddEditComponent } from './anom-add-edit/anom-add-edit.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [AnomAddEditComponent],
  imports: [
    CommonModule,
    APIModule
  ],
  exports:[AnomAddEditComponent]
})
export class AnomalyModule { }
