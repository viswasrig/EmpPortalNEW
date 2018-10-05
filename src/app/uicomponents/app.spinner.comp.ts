import { Component, isDevMode, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';


@Component({
  selector: 'app-spinner',
  template: `<div class="spinner-container">
                <img src="{{BASE_URL+'/assets/images/loader.gif'}}" alt="loader" class="ajax-loader">
            </div>`,
  styleUrls: []
})
export class AppSpinnerComponent implements OnInit, OnChanges {
  BASE_URL = '';
  constructor() {
    if ( isDevMode() ) {
      this.BASE_URL = '';
    } else {
      this.BASE_URL = '/EmpPortalNew';
    }
  }

  ngOnInit() {

  }

  ngOnChanges( changes: SimpleChanges ) {
    console.log(changes);
  }

}

