import { AppMainServiceService } from './svc/app-main-service.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'NG10App';
  public showMaterials:boolean =true;
  public showFontAwesome:boolean =false;

  constructor(
    public dataSource: AppMainServiceService
  ) {
    // this.dataSource.dialog = this.dialog;
  }

  public get withSource(): boolean {
    if (!this.dataSource) return false;
    if (!this.dataSource.ActiveSource) return false;
    return true;
  }

  public TestPost(){
    const ds = this.dataSource.ActiveSource.appDataset;
    ds.Post(null).subscribe(data=>{
      console.log("Data:",data);
    }, err=>{
      console.log("Error Posting:",err);
    })
  }

}
