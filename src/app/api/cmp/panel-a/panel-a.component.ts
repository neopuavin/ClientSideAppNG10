import { AppFormAComponent } from './../app-form-a/app-form-a.component';
import {
  Component,
  OnInit,
  Input,
  ElementRef,
  AfterViewInit,
  Inject,
} from '@angular/core';

@Component({
  selector: 'app-panel-a',
  templateUrl: './panel-a.component.html',
  styleUrls: ['./panel-a.component.scss'],
})
export class PanelAComponent implements OnInit, AfterViewInit {
  @Input() horizontal: boolean = false;
  @Input() bgcolor: string = '';

  @Input() labelWidth: number = -1;
  @Input() inputWidth: number = -1;
  @Input() rowSpacing: number = -1;

  // panel margins
  @Input() MX: number = -1;
  @Input() MY: number = -1;
  @Input() MT: number = -1;
  @Input() MB: number = -1;
  @Input() ML: number = -1;
  @Input() MR: number = -1;

  // panel paddings
  @Input() PX: number = -1;
  @Input() PY: number = -1;
  @Input() PT: number = -1;
  @Input() PB: number = -1;
  @Input() PL: number = -1;
  @Input() PR: number = -1;

  @Input() LPL: number = -1;
  @Input() LPR: number = -1;

  @Input() width: number = null;
  //[style.min-width.px]="400" [style.max-width.px]="400"

  constructor(
    @Inject(AppFormAComponent) public form: AppFormAComponent,
    public elem: ElementRef
  ) {}

  ngOnInit(): void {
    // [style.width.px]="Width"
    this.elem.nativeElement.style.minWidth = `${this.Width}px`;
    this.elem.nativeElement.style.maxWidth = `${this.Width}px`;
    //[style.min-width.px]="400" [style.max-width.px]="400"
  }

  ngAfterViewInit() {}

  public get MarginTop(): number {
    return this.MT != -1 ? this.MT : this.MY != -1 ? this.MY : null;
  }
  public get MarginBottom(): number {
    return this.MB != -1 ? this.MB : this.MY != -1 ? this.MY : null;
  }
  public get MarginLeft(): number {
    return this.ML != -1 ? this.ML : this.MX != -1 ? this.MX : null;
  }
  public get MarginRight(): number {
    return this.MR != -1 ? this.MR : this.MX != -1 ? this.MX : null;
  }

  public get PaddingTop(): number {
    return this.PT != -1 ? this.PT : this.PY != -1 ? this.PY : null;
  }
  public get PaddingBottom(): number {
    return this.PB != -1 ? this.PB : this.PY != -1 ? this.PY : null;
  }
  public get PaddingLeft(): number {
    return this.PL != -1 ? this.PL : this.PX != -1 ? this.PX : null;
  }
  public get PaddingRight(): number {
    return this.PR != -1 ? this.PR : this.PX != -1 ? this.PX : null;
  }

  public get Width(): number {
    return this.width;
  }

  public get RowSpacing():number{
    if (this.rowSpacing != -1) return this.rowSpacing;
    if (this.rowSpacing == -1 && this.form != null) {
      return this.form.rowSpacing;
    }else if (this.rowSpacing == -1){
      return 2;
    }else{
      return null;
    }
  }

  public get LabelWidth(): number {
    if (this.labelWidth != -1) return this.labelWidth;
    if (this.labelWidth == -1 && this.form != null) {
      return this.form.labelWidth;
    } else if (this.labelWidth == -1) {
      return 120;
    } else {
      return null;
    }
  }
}
