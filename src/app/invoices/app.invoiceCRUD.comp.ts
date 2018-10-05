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
  selector: 'app-inv-crud',
  templateUrl: './app.invoiceCRUD.comp.html',
  styleUrls: ['./app.invoiceCRUD.comp.scss']
})
export class AppInvoiceCRUDComponent implements OnInit, OnChanges {
    title = 'Invoices';
    subTitle = 'Create New Invoice';
    private user = null;
    invoice = { type: 'Regular', invoiceDate: '', associativeName: '', cname: '', rate: undefined,
    assignmentID: '', associateID: '', comments: '', toDate: '', fromDate: '',
    dueDate: '', qbinvNumber: undefined, deductions: undefined, amount: undefined, noOfUnits: '',
    unit: '', paymentMethod: '', recivedDate: '', receivedAmount: undefined , isMultiClient: false
    };
    todayDate = moment().format('MM/DD/YYYY');
    associativeList = [];
    state = null;
    operationType = APP_CONSTANTS.CRUD.NEW;
    CRUD = APP_CONSTANTS.CRUD;
    payTerm_ = '';
    invoiceTerm = 'weekly';
    associateClientList = [];
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
    this.invoice.invoiceDate =  this.todayDate;
    if ( !utils.isEmpty(state) ) {
        this.operationType = state.params && state.params.type || this.operationType;
        const data = state.params && state.params.data;
        this.state = state;
        if ( this.operationType === this.CRUD.EDIT ) {
            this.getInvoiceById(data.ID);
            this.subTitle = 'Edit Invoice';
        } else if ( this.operationType === this.CRUD.NEW ) {
            this.invoice = this.getInvoiceObject();
            this.subTitle = 'Create New Invoice';
            this.invoice.invoiceDate =  this.todayDate;
        } else if ( this.operationType === this.CRUD.VIEW) {
            this.getReceivePaymentById(data.ID);
            this.subTitle = 'Invoice Details';
        } else if ( this.operationType === this.CRUD.DELETE) {
            // Need to develop
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
    dueDate: '', qbinvNumber: undefined, deductions: undefined, amount: undefined, noOfUnits: '', unit: '',
    paymentMethod: '', recivedDate: '', receivedAmount: undefined, paymentRef: '' , isMultiClient: false,
    cnameS: '',
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
    this.invoice.isMultiClient = false;
    this.appService.assignmentSearch({query: query}).then(resp => {
        // console.log(resp);
        this.appLoaderService.setLoaderDisable(false);
        const list = resp['response'];
        if (list && list.length > 1) {
            this.invoice.isMultiClient = true;
            this.associateClientList = list;
        } else {
            this.onSelectClient(list[0]);
        }
    }).catch(ex => {
        console.log('Exception caught assignment search', ex);
    });

}

onChangeClient = (event) => {
const value = event.target.value;
    if (value && value.length > 0) {
        const client = this.associateClientList[value];
        this.onSelectClient(client);
    }
}

onSelectClient = (client) => {
    this.invoice['cname'] = client.ClientName;
    this.invoice['assignmentID'] = client.ID;
    this.invoice['rate'] = client.Price;
    this.invoice['unit'] = client.Unit;
    this.invoice['comments'] = 'Consulting Services of ' + this.invoice['associativeName'];
    const paymetTerm = client.PaymentTerm.trim();
    this.payTerm_ = paymetTerm;
    this.invoiceTerm = client.invoiceTerm;
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
}

onDeductionsChange = (deductionsInput) => {
    let noOfUnits: any = this.invoice['noOfUnits'];
    noOfUnits = parseInt(noOfUnits, 10);
    this.invoice['amount'] = (noOfUnits * this.invoice['rate']) - deductionsInput;
}

invoiceSubmit = (e: NgForm) => {
    console.log(e.value);
    if (e.valid) {
        const data = _.cloneDeep(this.invoice);
        e.control.markAsPristine();
        this.invoice = this.getInvoiceObject();
        this.appService.addInvoice(data).then(resp => {
            if ( resp && resp['success']) {
                toastr.success( resp['msg'], null, {positionClass: 'toast-bottom-right'});
            } else {
                toastr.error( resp['msg'], null, {positionClass: 'toast-bottom-right'});
            }
            if ( resp && resp['success'] ) {
                this.router.navigate(['/layout/invoice']);
            }
        }).catch(ex => {
            console.log('Exception Caught on Adding Invoice', ex);
        });
    }
}


invoiceEditSubmit = (e: NgForm) => { 
    console.log(e.value);
    if (e.valid) {
        const data = _.cloneDeep(this.invoice);
        e.control.markAsPristine();
        this.invoice = this.getInvoiceObject();
        this.appService.editSubmitInvoice(data).then(resp => {
            // console.log(resp);
            if ( resp && resp['success']) {
                toastr.success( resp['response'], null, {positionClass: 'toast-bottom-right'});
            } else {
                toastr.error( resp['response'], null, {positionClass: 'toast-bottom-right'});
            }
            if ( resp && resp['success'] ) {
                this.router.navigate(['/layout/invoice']);
            }
        }).catch(ex => {
            console.log('Exception Caught on update Invoice', ex);
        });
    }
}

invoiceCancel = () => { 
    this.router.navigate(['/layout/invoice']);
}


getReceivePaymentById = (id) => {
    this.appService.getReceivePaymentInvoiceById(id).then((resp) => {
        if (resp['success']) {
            const invoice =  resp['response'];
            this.invoice = this.getInvoiceObject();
            this.invoice = { ...this.invoice, ...invoice};
            this.invoice['receivedDate'] = this.invoice['receivedDate'] ? this.invoice['receivedDate'] : this.todayDate; 
            let amount = this.invoice['amount'];
            this.invoice['orginalAmount'] = (amount = amount ? parseFloat(amount).toFixed(2) : amount);
            this.invoice['amount'] = amount;
        }
     }).catch((ex) => {
        console.log('Exception caught For fetching due to invoice id', ex);
    });
}

invoiceRepaySubmit = ( e: NgForm) => {
    console.log(e.value);
    if ( e.valid ) {
        const data = _.cloneDeep(this.invoice);
        e.control.markAsPristine();
        this.invoice = this.getInvoiceObject();
        this.appService.repaymentSubmitInvoice(data).then(resp => {
            // console.log(resp);
            if ( resp && resp['success']) {
                toastr.success( resp['response'], null, {positionClass: 'toast-bottom-right'});
            } else {
                toastr.error( resp['response'], null, {positionClass: 'toast-bottom-right'});
            }
            if ( resp && resp['success'] ) {
                this.router.navigate(['/layout/invoice']);
            }
        }).catch(ex => {
            console.log('Exception Caught on Repayment Invoice', ex);
        });
    }
}

}
