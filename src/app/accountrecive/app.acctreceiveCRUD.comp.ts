import { Component, isDevMode, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { AppService } from '../services/app.service';
import { AppUserAuthService } from '../services/app.userAuth.service';
import {NgForm} from '@angular/forms';
import * as _ from 'lodash';
import { AppRoutingService } from '../services/app.routing.service';
import { APP_CONSTANTS} from '../services/app.constants';
import {AppLoaderService} from '../services/app.loader.service';
import * as moment from 'moment';
declare const utils: any;
declare const toastr: any;

@Component({
  selector: 'app-acctrec-crud',
  templateUrl: './app.acctrecCRUD.comp.html',
  styleUrls: ['./app.acctreceive.comp.scss']
})
export class AppAccountReceiveCRUDComponent implements OnInit, OnChanges {
    title = 'Invoices';
    subTitle = 'Create New Invoice';
    private user = null;
    invoice = { type: 'Regular', invoiceDate: '', associativeName: '', cname: '', rate: undefined,
    assignmentID: '', associateID: '', comments: '', toDate: '', fromDate: '',
    dueDate: '', qbinvNumber: undefined, deductions: undefined, amount: undefined, noOfUnits: '',
    unit: '', paymentMethod: '', recivedDate: '', receivedAmount: undefined
};
    todayDate = moment().format('MM/DD/YYYY');
    associativeList = [];
    state = null;
    operationType = APP_CONSTANTS.CRUD.NEW;
    CRUD = APP_CONSTANTS.CRUD;
    payTerm_ = '';
    invoiceTerm = 'weekly';
    showAlert = false;
    alert = null;
    constructor(private appService: AppService,
         private appUserAuthService: AppUserAuthService,
        private router: Router,
        private route: ActivatedRoute,
        private appRoutingService: AppRoutingService,
        private appLoaderService: AppLoaderService
    ) {

    }

ngOnInit() {
    this.user = this.appUserAuthService.getUser();
    const state = this.appRoutingService.getCurrentState();
    if ( !utils.isEmpty(state) ) {
        this.operationType = state.params && state.params.type || this.operationType;
        const data = state.params && state.params.data;
        this.state = state;
        if ( this.operationType === this.CRUD.NEW ) {
            this.invoice = this.getInvoiceObject();
            this.subTitle = 'Create New Invoice';
        } else if ( this.operationType === this.CRUD.REPAY) {
            this.getReceivePaymentById(data.ID);
            this.subTitle = 'Invoice Repayment';
        } else {
            this.operationType = this.CRUD.NEW;
            this.subTitle = 'Create New Invoice';
        }
    }
}

ngOnChanges(chnages: SimpleChanges) {

}

getInvoiceById = (id) => {
    this.appService.getInvoiceById(id).then((resp) => {
        if (resp['success']) {
            this.invoice =  resp['response'];
            this.invoice['qbinvNumber'] = this.invoice['altID'];
            this.payTerm_ = this.invoice['paymentTerm'];
            this.invoiceTerm = this.invoice['invoiceTerm'];
        }
     }).catch((ex) => {
        console.log('Exception caught For fetching due to invoice id', ex);
    });
}


getInvoiceObject = () => {
    return { type: 'Regular', invoiceDate: '', associativeName: '', cname: '', rate: undefined,
    assignmentID: '', associateID: '', comments: '', toDate: '', fromDate: '',
    dueDate: '', qbinvNumber: undefined, deductions: '0.0', amount: undefined, noOfUnits: '', unit: '',
    paymentMethod: '', recivedDate: '', receivedAmount: undefined, paymentRef: ''
    };
}

onAssociativeNameChng = (inputData) => {
    // console.log(inputData);
    this.appLoaderService.setLoaderDisable(true);
    this.appService.searchAssociativeId(inputData).then(resp => {
        this.associativeList = resp['response'];
        this.appLoaderService.setLoaderDisable(false);
    }).catch(ex => {
        console.log('Exception Caught on Search Associatve ID', ex);
    });
}

selectAssociativeId = (associate) => {
    this.invoice['associativeName'] = associate.FirstName + ' ' + associate.LastName;
    this.invoice['associateID'] = associate.ID;
    this.associativeList = [];
    const query = associate.ID;
    this.appLoaderService.setLoaderDisable(true);
    this.appService.assignmentSearch({query: query}).then(resp => {
        // console.log(resp);
        this.appLoaderService.setLoaderDisable(false);
        const list = resp['response'];
        this.invoice['cname'] = list[0].ClientName;
        this.invoice['assignmentID'] = list[0].ID;
        this.invoice['rate'] = list[0].Price;
        this.invoice['unit'] = list[0].Unit;
        this.invoice['comments'] = 'Consulting Services of ' + this.invoice['associativeName'];
        const paymetTerm = list[0].PaymentTerm.trim();
        this.payTerm_ = paymetTerm;
        this.invoiceTerm = list[0].invoiceTerm;
        if (this.invoice['invoiceDate']) {
            let startDate =  new Date(this.invoice['invoiceDate']);
            let fromDate = new Date(this.invoice['invoiceDate']);
            let toDate = new Date(this.invoice['invoiceDate']);
            const numberOfDays = 0;
            if (paymetTerm && paymetTerm === 'Net 30') {
                startDate = moment(startDate).add(numberOfDays + 30, 'd').toDate();
            } else if (paymetTerm && paymetTerm === 'Net 45') {
                startDate = moment(startDate).add(numberOfDays + 45, 'd').toDate();
            } else if ( paymetTerm && paymetTerm === 'Net 60' ) {
                startDate = moment(startDate).add(numberOfDays + 60, 'd').toDate();
            } else if (paymetTerm && paymetTerm === 'weekly') {
                startDate = moment(startDate).add(numberOfDays + 7, 'd').toDate();
            } else {
                startDate = moment(startDate).add(numberOfDays, 'd').toDate();
            }

            if (this.invoiceTerm && this.invoiceTerm === 'Monthly') {
                fromDate = moment(fromDate).subtract(1, 'month').startOf('month').toDate();
                toDate = moment(fromDate).endOf('month').toDate();
            } else if ( this.invoiceTerm && (this.invoiceTerm === 'weekly' || this.invoiceTerm === 'weely') ) {
                fromDate = moment(fromDate).subtract(1, 'week').startOf('week').toDate();
                toDate = moment(fromDate).endOf('week').toDate();
            } else {
                // default to Monthly
                fromDate = moment(fromDate).subtract(1, 'month').startOf('month').toDate();
                toDate = moment(fromDate).endOf('month').toDate();
            }
                const startDateStr = moment(startDate).format('MM/DD/YYYY');
                const fromDateStr = moment(fromDate).format('MM/DD/YYYY');
                const toDateStr = moment(toDate).format('MM/DD/YYYY');
                this.invoice['dueDate'] = startDateStr;
                this.invoice['fromDate'] = fromDateStr;
                this.invoice['toDate'] = toDateStr;

        }

    }).catch(ex => {
        console.log('Exception caught assignment search', ex);
    });

}
onInvoiceDateChange = (invoiceDate) => {
    const paymetTerm = this.payTerm_;
    if ( this.invoice['invoiceDate'] ) {
    let startDate =  new Date(this.invoice['invoiceDate']);
    let fromDate = new Date(this.invoice['invoiceDate']);
    let toDate = new Date(this.invoice['invoiceDate']);
    const numberOfDays = 0;
    if (paymetTerm && paymetTerm === 'Net 30') {
        startDate = moment(startDate).add(numberOfDays + 30, 'd').toDate();
    } else if (paymetTerm && paymetTerm === 'Net 45') {
        startDate = moment(startDate).add(numberOfDays + 45, 'd').toDate();
    } else if ( paymetTerm && paymetTerm === 'Net 60' ) {
        startDate = moment(startDate).add(numberOfDays + 60, 'd').toDate();
    } else if (paymetTerm && paymetTerm === 'weekly') {
        startDate = moment(startDate).add(numberOfDays + 7, 'd').toDate();
    } else {
        startDate = moment(startDate).add(numberOfDays, 'd').toDate();
    }

    if (this.invoiceTerm && this.invoiceTerm === 'Monthly') {
        fromDate = moment(fromDate).subtract(1, 'month').startOf('month').toDate();
        toDate = moment(fromDate).endOf('month').toDate();
    } else if ( this.invoiceTerm && (this.invoiceTerm === 'weekly' || this.invoiceTerm === 'weely') ) {
        fromDate = moment(fromDate).subtract(1, 'week').startOf('week').toDate();
        toDate = moment(fromDate).endOf('week').toDate();
    } else {
        // default to Monthly
        fromDate = moment(fromDate).subtract(1, 'month').startOf('month').toDate();
        toDate = moment(fromDate).endOf('month').toDate();
    }
    const startDateStr = moment(startDate).format('MM/DD/YYYY');
    const fromDateStr = moment(fromDate).format('MM/DD/YYYY');
    const toDateStr = moment(toDate).format('MM/DD/YYYY');
    this.invoice['dueDate'] = startDateStr;
    this.invoice['fromDate'] = fromDateStr;
    this.invoice['toDate'] = toDateStr;
    }
}

onNumberOfUnitsChange = ( noOfUnitsInput ) => {
    this.invoice['amount'] = noOfUnitsInput * this.invoice['rate'];
    this.invoice['orginalAmount'] = this.invoice['amount'];
}

onDeductionsChange = (deductionsInput) => {
    this.invoice['amount'] = this.invoice['orginalAmount'] - deductionsInput;
}

invoiceSubmit = (e: NgForm) => {
    if (e.valid) {
        const data = _.cloneDeep(this.invoice);
        e.control.markAsPristine();
        this.invoice = this.getInvoiceObject();
        this.appService.addInvoice(data).then(resp => {
            if ( resp && resp['success'] ) {
                this.router.navigate(['/layout/actreciv']);
            }
        }).catch(ex => {
            console.log('Exception Caught on Adding Invoice', ex);
        });
    }
}
invoiceCancel = () => {
    this.router.navigate(['/layout/actreciv']);
}


getReceivePaymentById = (id) => {
    this.appService.getReceivePaymentInvoiceById(id).then((resp) => {
        if (resp['success']) {
            const invoice =  resp['response'];
            this.invoice = this.getInvoiceObject();
            this.invoice = { ...this.invoice, ...invoice};
            this.invoice['receivedDate'] = this.invoice['receivedDate'] ? this.invoice['receivedDate'] : this.todayDate;
            let amount = this.invoice['amount'];
            const deductions = this.invoice['deductions'];
            this.invoice['orginalAmount'] = (amount = amount ? parseFloat(amount).toFixed(2) : amount);
            this.invoice['amount'] = amount - deductions;
        }
     }).catch((ex) => {
        console.log('Exception caught For fetching due to invoice id', ex);
    });
}

closeModel = () => {
    this.showAlert = false;
}

invoiceRepaySubmit = ( e: NgForm) => {
    // console.log(e.value);
    this.showAlert = false;
    this.alert = null;
    if ( e.valid ) {
        const data = _.cloneDeep(this.invoice);
        e.control.markAsPristine();
        this.invoice = this.getInvoiceObject();
        this.appService.repaymentSubmitInvoice(data).then(resp => {
            // console.log(resp);
            if ( resp && resp['success']) {
                toastr.success( resp['response'], null, {positionClass: 'toast-bottom-right'});
                this.router.navigate(['/layout/actreciv']);
            } else {
                if ( !resp['percentage'] ) {
                    this.showAlert = true;
                    this.alert = {title: 'Error', msg: resp['response']};
                } else {
                    toastr.error( resp['response'], null, {positionClass: 'toast-bottom-right'});
                }
            }
        }).catch(ex => {
            console.log('Exception Caught on Repayment Invoice', ex);
        });
    }
}

}
