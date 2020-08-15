import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-date-picker-a',
  templateUrl: './date-picker-a.component.html',
  styleUrls: ['./date-picker-a.component.scss']
})
export class DatePickerAComponent implements OnInit {

  @Input() data:{};

  constructor() { }

  ngOnInit(): void {
  }

}
