import { AppFormAComponent } from './../../api/cmp/app-form-a/app-form-a.component';
import { AnomalyComponent } from './anomaly.component';
import { Inject, ViewChild, Component } from '@angular/core';


@Component({
  template: ''
})
export class AnomalyCommon {
  // declaration of details form inserted on each module subform
  // instance of the form must have #detailForm identifier


  @ViewChild('detailForm') detailForm: AppFormAComponent;

  constructor(@Inject(AnomalyComponent) public module: AnomalyComponent) {}

  ngOnInit(): void {
  }
  ngAfterViewInit(){
    // Call scatter after rendering sub form component inside the tab pages
    if(this.detailForm) {
      this.detailForm.Scatter();
      this.module.mainFormCollection.push(this.detailForm);
    }
  }
}
