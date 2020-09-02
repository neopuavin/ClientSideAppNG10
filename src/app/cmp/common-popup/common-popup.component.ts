import { SurveyDataModule } from './../survey-data/survey-data.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';

@Component({
  selector: 'app-common-popup',
  templateUrl: './common-popup.component.html',
  styleUrls: ['./common-popup.component.scss'],
})
export class CommonPopupComponent implements OnInit {
  @ViewChild('subComponent') subComponent: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CommonPopupComponent>
  ) {}

  ngOnInit(): void {
    // console.log('DATA', this.data);
  }

  clickAction(mode: string) {
    switch (mode) {
      case 'reset':
        if(this.subComponent.Reset)this.subComponent.Reset(this.dialogRef);
        break;
      case 'save':
        if(this.subComponent.Save)this.subComponent.Save(this.dialogRef);
        break;
      break;
        case 'close':
      case 'cancel':
        this.dialogRef.close(null);
        break;
      case 'accept':
        this.acceptAndClose();
        break;
      default:
        this.dialogRef.close({mode:mode});
    }
  }

  acceptAndClose() {
    if (!this.data.validate) {
      // if form validation listener is not set
      if (!this.data) {
        this.dialogRef.close(null);
      } else {
        this.dialogRef.close({
          mode: 'accept',
          form: this.data.formObject,
          data: this.data.response,
        });
      }
      return;
    }

    // if validation is required!
    // validate function is supplied where this.data.response is the parameter
    // this function is defined in the child component of the popup component
    if (this.data.validate(this.data.response)) {
      this.dialogRef.close({ mode: 'accept', data: this.data.response });
    } else {
      if (this.data.error) {
        // call error function defined in the child component
        this.data.error();
      } else {
        // show default error message
        if (this.dataSource) {
          this.dataSource.OpenPopup('alert', 450, 200, false, {
            title: 'Invalid data selected',
            icon: 'fa-exclamation-circle',
            message: 'Please select a valid entry',
            buttons: [
              {
                label: 'Close',
                value: 'close',
                class: 'btn btn-sm btn-warning',
              },
            ],
          });
        } else {
          alert('Please select valid entry');
        }
      }
    }
  }

  private get dataSource() {
    // find dataSource property in popup's data property and return it
    if (!this.data) return null;
    if (this.data.dataSource) return this.data.dataSource;
    if (this.data.parent) return this.data.parent.dataSource;
    return null;
  }
}
