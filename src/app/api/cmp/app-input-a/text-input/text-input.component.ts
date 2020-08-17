import { Component, OnInit, Input,EventEmitter,Output } from '@angular/core';
import { InputCommon } from '../input.common'

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss','../input.common.scss']
})
export class TextInputComponent extends InputCommon implements OnInit {
  constructor() { super() }

  ngOnInit(): void {

  }

}
