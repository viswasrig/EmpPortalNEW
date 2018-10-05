import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import {APP_CONSTANTS} from '../services/app.constants';

@Component({
  selector: 'app-inline-alert',
  template: `<div class="alert err " ngClass="{{alert.className}}">
                <div class="app-alert-close-icon float-right" (click)="close()"><i class="fa fa-times"></i></div>
                <strong>{{alert.type}}!</strong> {{alert.msg}}.
            </div>`,
  styleUrls: []
})
export class AppInlineAlertComponent implements OnInit, OnChanges {
   @Input() msg;
   @Input() type;
   @Output() action =  new EventEmitter();
   alert = {type: '', msg: '', closeIconEnabled: true, className: ''};

  constructor() {
  }

  ngOnInit() {
      const msg = this.msg;
      const type = this.type;
      let className = '';
      if ( type === 'Error' || type === APP_CONSTANTS.ALERT_TYPES.ERROR) {
        className = 'alert-danager';
      } else if ( type === 'Success' || type === APP_CONSTANTS.ALERT_TYPES.SUCCESS) {
        className = 'alert-success';
      } else {
        className = 'alert-danager';
      }
    this.alert = {msg, type, closeIconEnabled: true, className};
  }

  close = () => {
    if (this.action) {
        this.action.emit( {'e': null} );
    }
  }

  ngOnChanges( changes: SimpleChanges ) {
    console.log(changes);
  }

}

