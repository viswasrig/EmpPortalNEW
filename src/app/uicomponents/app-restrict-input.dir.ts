import { Directive, ElementRef, HostListener} from '@angular/core';
import * as moment from 'moment';
import {NgModel, NgControl } from '@angular/forms';
declare const jQuery: any;
@Directive({
  selector: '[numberOnly]',
})
export class AppRestrictInputNumberDirective {
    private regex: RegExp = new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g);
    private specialKeys: Array<string> = [ 'Backspace', 'Tab', 'End', 'Home', '-' ];
    constructor(private elementRef: ElementRef, private model: NgModel, private formCtrl: NgControl) {
    }

    @HostListener('keydown', [ '$event' ])
    onKeyDown(event: KeyboardEvent) {
        // Allow Backspace, tab, end, and home keys
        if (this.specialKeys.indexOf(event.key) !== -1) {
            return;
        }
        const current = this.elementRef.nativeElement.value;
        const next: string = current.concat(event.key);
        if (next && !String(next).match(this.regex)) {
            event.preventDefault();
        }
    }
}
