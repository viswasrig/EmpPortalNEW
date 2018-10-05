import { Component, isDevMode, Input, Output, EventEmitter,
   OnInit, OnChanges, SimpleChanges, AfterViewChecked, ChangeDetectorRef} from '@angular/core';
import * as v4 from 'uuid';
import * as _ from 'lodash';
declare const $: any;
declare const appConfig: any;
declare const toastr: any;
declare const gGrid: any;
@Component({
  selector: 'app-grid',
  template: `<div class="grid-container">
                  <div id="{{id}}" class="g-grid"></div>
            </div>`,
  styleUrls: []
})
export class AppGridComponent implements OnInit, OnChanges, AfterViewChecked {
  id = '';
  @Input('options') options;
  private gridOptions: any = null;

  constructor(private cd: ChangeDetectorRef) {
    this.id = _.replace(v4(), /-/g, '_');
  }

  ngOnInit() {
    this.initializeGrid();
  }

  ngOnChanges( changes: SimpleChanges ) {
    console.log(changes);
    if ( changes.options && !_.isEqual( changes.options.currentValue, changes.options.previousValue) ) {
      this.gridOptions = changes.options.currentValue;
      this.id = changes.options.currentValue.gridID || this.id || v4().replace('-', '_');
      this.initializeGrid();
    }
  }

  private initializeGrid = () => {
    const interval = setInterval(() => {
      if ( $('#' + this.id ) && $('#' + this.id ).length > 0 ) {
        gGrid.loader.init(this.gridOptions);
        clearInterval(interval);
      }
    }, 500);
  }

  ngAfterViewChecked(){
    this.cd.detectChanges();
  }


}

