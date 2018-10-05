import { Directive, ElementRef, OnChanges, SimpleChanges, Input, AfterViewInit,
     ChangeDetectorRef, HostListener} from '@angular/core';
import * as moment from 'moment';
import {NgModel, NgControl } from '@angular/forms';
import * as _ from 'lodash';
declare const jQuery: any;

@Directive({
  selector: '[appDate]',
})
export class AppDateDirective implements OnChanges, AfterViewInit {
    @Input() inputValue;
    @Input() dOptions;
    initialTime = true;
    private datePickerEle: any = null;
    constructor(private elementRef: ElementRef,
         private model: NgModel,
         private formCtrl: NgControl,
         private cd: ChangeDetectorRef
        ) {
        this.init();
        this.inputChange();
    }

    init = () => {
        if (this.elementRef) {
            const id = this.elementRef.nativeElement.id;
           const inteval = setTimeout(() => {
            const flag = jQuery(this.elementRef.nativeElement).hasClass('app-date');
                if (flag && !this.datePickerEle) {
                    let selectedDate = this.dOptions && this.dOptions.default || '';
                    if (this.model.control.value) {
                        selectedDate = moment(this.model.control.value, 'MM/DD/YYYY').toDate();
                    }
                    const _container = jQuery(this.elementRef.nativeElement).parent();
                    this.datePickerEle = jQuery(this.elementRef.nativeElement).datepicker({format: 'mm/dd/yyyy', container: _container,
                     autoclose: true, allowInputToggle: true, constrainInput: false});
                     this.datePickerEle.on('changeDate', (e) => {
                            let date = e.date;
                             if (date) {
                                date = moment(date).format('MM/DD/YYYY');
                                this.elementRef.nativeElement.value = date;
                                jQuery(this.elementRef.nativeElement).val(date);
                                this.model.control.setValue(date);
                                this.model.control.updateValueAndValidity();
                                this.model.control.markAsTouched();
                            }
                        });
                    this.datePickerEle.datepicker('setDate', selectedDate);
                }
            }, 1000);
        }
    }


    ngOnChanges(changes: SimpleChanges) {
        // console.log(changes);
        this.dOptions = changes.dOptions && changes.dOptions.currentValue || null;
        if (changes.dOptions && !_.isEqual(changes.dOptions.currentValue, changes.dOptions.previousValue)) { 
            this.dOptions = changes.dOptions.currentValue;
        }
        if (changes.inputValue && !_.isEqual(changes.inputValue.currentValue, changes.inputValue.previousValue)) {
            this.inputValue = changes.inputValue.currentValue;
        }
        // this.cd.detectChanges();
    }

    ngAfterViewInit() {
        this.cd.detectChanges();
    }

    inputChange = () => {
       setInterval(() => {
        const value = this.inputValue ;
        if (value && value.length > 0 && this.datePickerEle) {
            if ( !_.isEqual(this.model.control.value , value)) {
                let date = null;
                if (value && value.lastIndexOf('/') === -1 && value.length === 8) {
                    date = moment(value, 'MMDDYYYY').toDate();
                    this.datePickerEle.datepicker('setDate', date);
                }

                if (value && value.lastIndexOf('/') > -1 && value.length === 10) {
                    date = moment(value, 'MM/DD/YYYY').toDate();
                    this.datePickerEle.datepicker('setDate', date);
                }
            }
        }
       }, 1000);
    }

    @HostListener('keyup', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        let value = event.target['value'];
        if (value && value.length > 0 && this.datePickerEle) {
            if (value && value.lastIndexOf('/') === -1 && value.length === 8) {
                value = moment(value, 'MMDDYYYY').toDate();
                this.datePickerEle.datepicker('setDate', value);
            }
        }
      }
}
