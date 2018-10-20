import { Component, isDevMode, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from '../../services/app.service';
import { AppUserAuthService } from '../../services/app.userAuth.service';
import { NgForm } from '@angular/forms';
import * as _ from 'lodash';
import { AppRoutingService } from '../../services/app.routing.service';
import { APP_CONSTANTS } from '../../services/app.constants';
import { AppLoaderService } from '../../services/app.loader.service';
import { AppGridService } from '../../services/app.grid.service';
import * as moment from 'moment';
declare const utils: any;
declare const toastr: any;


@Component({
    selector: 'app-adm-exp-crud',
    templateUrl: './app.adm.exp.crud.comp.html',
    styleUrls: ['./app.adm.exp.comp.scss']
})
export class AppAdminExpenseCRUDComponent implements OnInit, OnChanges {
    title = 'Expense Details';
    subTitle = 'Create New Expense';
    private user = null;
    expense = {
         expenseDate: '', associateName: '', associateID: '', comments: '', description: '', ref: 'rCompany',
        header: '', paymentMethod: undefined, deductions: undefined, amount: undefined, payee: '',
        userId: '' , ID: ''
    };
    todayDate = moment().format('MM/DD/YYYY');
    associativeList = [];
    state = null;
    operationType = APP_CONSTANTS.CRUD.NEW;
    CRUD = APP_CONSTANTS.CRUD;
    options = null;
    DATE_TYPES = APP_CONSTANTS.DATA_TYPES;
    dateOfOptions = {default: new Date(), format: 'MM/DD/YYYY'};
    constructor(private appService: AppService,
        private appUserAuthService: AppUserAuthService,
        private router: Router,
        private route: ActivatedRoute,
        private appRoutingService: AppRoutingService,
        private appLoaderService: AppLoaderService,
        private appGridService: AppGridService
    ) {
        this.expense = this.getExpenseObject();
    }

    ngOnInit() {
        this.user = this.appUserAuthService.getUser();
        const state = this.appRoutingService.getCurrentState();
        const options = this.appGridService.getTableOptions();
        options.pager = false;
        options.pagination.pageSize = 10;
        options.columns = this.buildColumns();
        this.options = options;
        if (!utils.isEmpty(state)) {
            this.operationType = state.params && state.params.type || this.operationType;
            const data = state.params && state.params.data;
            this.state = state;
            if (this.operationType === this.CRUD.EDIT) {
                this.getExpenseObjectById(data.ID);
                this.subTitle = 'Edit Expense';
            } else if (this.operationType === this.CRUD.NEW) {
                this.expense = this.getExpenseObject();
                this.subTitle = 'Create New Expense';
            } else if (this.operationType === this.CRUD.VIEW) {
                // this.getReceivePaymentById(data.ID);
                this.getExpenseObjectById(data.ID);
                this.subTitle = 'Expense Details';
            } else if (this.operationType === this.CRUD.DELETE) {
                // Need to develop
            } else {
                this.operationType = this.CRUD.NEW;
                this.subTitle = 'Create New Expense';
            }

        }
    }

    ngOnChanges(chnages: SimpleChanges) {

    }

    onRefChange = (e) => {
        if (this.expense.ref === 'rCompany') {
            this.expense.associateName = 'E3 Globa Inc';
            this.expense.associateID = '1085';
        }

        if (this.expense.ref === 'rIndividual') {
            this.expense.associateName = '';
            this.expense.associateID = '';
        }
    }

    getExpenseObjectById = (id) => {
        this.appService.getExpenseObjectById(id).then((resp) => {
            if (resp['success']) {
                this.expense =  resp['response'];
                this.expense.ref = !this.expense.ref ? 'rIndividual' : this.expense.ref;
                console.log(this.expense);
                const dataSource = _.cloneDeep(this.options.dataSource) || {data: [], viewData: []};
                dataSource.data.push( _.cloneDeep(this.expense));
                dataSource.originalData = [];
                dataSource.originalData.push(_.cloneDeep(this.expense));
                const options = _.cloneDeep(this.options);
                options.dataSource = dataSource;
                this.options = options;
            } else {
                toastr.error(resp['response'], null, { positionClass: 'toast-bottom-right' });
            }
        }).catch((ex) => {
            console.log('Exception caught For fetching due to invoice id', ex);
        });
    }


    getExpenseObject = () => {
       const userId = this.user && this.user.ID || '';
        return {
            expenseDate: '', associateName: '', associateID: '', comments: '',
             description: '', ref: 'rIndividual', header: '', paymentMethod: undefined,
            deductions: undefined, amount: undefined, payee: '', originalAmount: '',
            userId: userId, ID: ''
        };
    }

    expenseCancel = () => {
        this.router.navigate(['/layout/adm-expenses']);
    }

    onAssociativeNameChange = (inputData) => {
        this.appLoaderService.setLoaderDisable(true);
        this.appService.searchAssociativeId(inputData).then(resp => {
            this.associativeList = resp['response'];
            this.appLoaderService.setLoaderDisable(false);
        }).catch(ex => {
            console.log('Exception Caught on Search Associatve ID', ex);
        });
    }

    selectAssociativeId = (associate) => {
        this.expense['associateName'] = associate.FirstName + ' ' + associate.LastName;
        this.expense['associateID'] = associate.ID;
        this.associativeList = [];
        const query = associate.ID;
        this.appLoaderService.setLoaderDisable(true);
    }

    expenseNewSubmit = (e: NgForm) => {
        console.log(e.value);
        if (e.valid) {
            const data = _.cloneDeep(this.expense);
            data['userId'] = this.user && this.user.ID || '';
            e.control.markAsPristine();
            this.expense = this.getExpenseObject();
            this.appService.createNewExpense(data).then(resp => {
                if (resp && resp['success']) {
                    toastr.success(resp['response'], null, { positionClass: 'toast-bottom-right' });
                } else {
                    toastr.error(resp['response'], null, { positionClass: 'toast-bottom-right' });
                }
                if (resp && resp['success']) {
                    this.router.navigate(['/layout/adm-expenses']);
                }
            }).catch(ex => {
                console.log('Exception Caught on Adding Expense', ex);
            });
        }
    }

    buildColumns = () => {
        const column1 = this.appGridService.getColumn(0, 'ID', 'ID', this.DATE_TYPES.STRING, false, false, '10%');
        const column2 = this.appGridService.getColumn(1, 'Amount', 'amount', this.DATE_TYPES.NUMBER, false, false, '10%');
        const column3 = this.appGridService.getColumn(2, 'Payee', 'payee', this.DATE_TYPES.STRING, false, false, '10%');
        const column4 = this.appGridService.getColumn(3, 'Payment Method', 'paymentMethod', this.DATE_TYPES.STRING, false, false, '10%');
        const column5 = this.appGridService.getColumn(4, 'Expense Header', 'header', this.DATE_TYPES.STRING, false, false, '10%');
        const column6 = this.appGridService.getColumn(5, 'Reference', 'reference', this.DATE_TYPES.STRING, false, false, '10%');
        const column7 = this.appGridService.getColumn(6, 'Description', 'description', this.DATE_TYPES.STRING, false, false, '15%');
        const column8 = this.appGridService.getColumn(7, 'Comment', 'comments', this.DATE_TYPES.STRING, false, false, '12%');
        const column9 = this.appGridService.getColumn(9, 'Date', 'expenseDate', this.DATE_TYPES.DATE, false, false, '8%');
        const columns = [column1, column2, column3, column4, column5, column6, column7, column8, column9];
        return columns;
    }

}
