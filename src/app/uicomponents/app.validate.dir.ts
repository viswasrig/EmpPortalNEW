import { Directive, ElementRef, OnChanges, SimpleChanges, Input, AfterViewInit,
    ChangeDetectorRef, HostListener} from '@angular/core';
import * as moment from 'moment';
import {NgModel, NgControl } from '@angular/forms';
import * as _ from 'lodash';
declare const jQuery: any;
declare const staffValidate: any;

@Directive({
 selector: '[appValidate]',
})
export class AppValidateDirective implements OnChanges, AfterViewInit {
   private formEle: any = null;
   constructor(private elementRef: ElementRef,
        private cd: ChangeDetectorRef
       ) { }

    ngOnChanges(changes: SimpleChanges) { }

    ngAfterViewInit() {
        this.cd.detectChanges();
        setTimeout(() => {
            const ele = jQuery('.form');
            if (ele && ele.length) {
                this.formEle = ele;
                staffValidate.onLoad();
            }
        }, 1000);
    }
}
