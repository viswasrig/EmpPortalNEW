import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {APP_CONSTANTS} from './app.constants';
import {AppLoaderService} from './app.loader.service';
import {Observable, pipe} from 'rxjs';
import { map, filter, scan } from 'rxjs/operators';
declare const $: any;

declare const utils: any;

@Injectable()
export class AppService {
    options = null;
    private config = APP_CONSTANTS.CONFIG;
    BASE_URL = '';
    constructor(
        private httpp: HttpClient,
        private appLoaderService: AppLoaderService
    ) {
        const headers = new HttpHeaders();
        // headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Request-Headers', '*');
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
        headers.append('Accept-Language', '*');
        this.options = { headers: headers };
        if (isDevMode()) {
            this.BASE_URL = this.config.DEV_URL;
          } else {
            this.BASE_URL = this.config.PROD_URL;
          }
     }

     getInvoices = () => {
        const url = this.BASE_URL + 'api/invoice.php';
        return this.httpp.get(url, this.options).toPromise();
    }

    searchAssociativeId = (data) => {
        const URL = this.BASE_URL + this.config.SEARCH_ASSOCIATIVE; // 'api/invoice.php';
        return this.httpp.post(URL, {'query': data}, this.options).toPromise();
    }

    assignmentSearch = (data) => {
        const URL = this.BASE_URL + this.config.SEARCH_ASSIGNMENT; // 'api/invoice.php';
        return this.httpp.post(URL, data, this.options).toPromise();
    }

    addInvoice = (data) => {
        const URL = this.BASE_URL + this.config.ADD_INVOICE; // 'api/invoice.php';
        return this.httpp.post(URL, data, this.options).toPromise();
    }

    getInvoiceById = (id) => {
        const URL = this.BASE_URL + this.config.EDIT_INVOICE;
        const params = new HttpParams().set('ID', id);
        return this.httpp.get(URL, {params}).toPromise();
    }

    editSubmitInvoice = (data) => {
        const URL = this.BASE_URL + this.config.EDIT_INVOICE; // 'api/invoice.php';
        return this.httpp.post(URL, data, this.options).toPromise();
    }

    getReceivePaymentInvoiceById = (id) => {
        const URL = this.BASE_URL + this.config.RECIVE_PAYMENT_INVOICE;
        const params = new HttpParams().set('ID', id);
        return this.httpp.get(URL, {params}).toPromise();
    }

    repaymentSubmitInvoice = (data) => {
        const URL = this.BASE_URL + this.config.RECIVE_PAYMENT_INVOICE; // 'api/invoice.php';
        return this.httpp.post(URL, data, this.options).toPromise();
    }

    getAllAssocites = () => {
        const URL = this.BASE_URL + this.config.ALL_ASSOCIATES; // 'api/invoice.php';
        return this.httpp.get(URL, this.options).toPromise();
    }

    createNewAssociate = (data) => {
        const URL = this.BASE_URL + this.config.NEW_ASSOCIATE;
        return this.httpp.post(URL, data, this.options).toPromise();
    }

    getAssociateById = (id) => {
        const URL = this.BASE_URL + this.config.EDIT_ASSOCIATE;
        const params = new HttpParams().set('ID', id);
        return this.httpp.get(URL, {params}).toPromise();
    }

    updateAssocById = ( data ) => {
        const URL = this.BASE_URL + this.config.EDIT_ASSOCIATE;
        return this.httpp.post(URL, data, this.options).toPromise();
    }

    getAllAssignments = () => {
        const URL = this.BASE_URL + this.config.ALL_ASSIGNMENTS;
        return this.httpp.get(URL).toPromise();
    }

    associateSearchByName = (data) => {
        const URL = this.BASE_URL + this.config.SEARCH_BYNAME_ASSOCIATE; // 'api/invoice.php';
        return this.httpp.post(URL, data, this.options).toPromise();
    }

    searchClientsByName = (data) => {
        const URL = this.BASE_URL + this.config.SEARCH_BYNAME_CLIENT; // 'api/invoice.php';
        return this.httpp.post(URL, data, this.options).toPromise();
    }

    createAssignment = (data) => {
        const URL = this.BASE_URL + this.config.NEW_ASSIGNMENT; // 'api/invoice.php';
        return this.httpp.post(URL, data, this.options).toPromise();
    }

    getAssignmentByID = (id) => {
        const URL = this.BASE_URL + this.config.EDIT_ASSIGNMENT; // 'api/invoice.php';
        const params = new HttpParams().set('ID', id);
        return this.httpp.get(URL, {params}).toPromise();
    }

    updateAssignment = ( data ) => {
        const URL = this.BASE_URL + this.config.EDIT_ASSIGNMENT;
        return this.httpp.post(URL, data, this.options).toPromise();
    }

    deleteAssignment = (id) => {
        const URL = this.BASE_URL + this.config.DELETE_ASSIGNMENT;
        return this.httpp.post(URL, {'ID': id}, this.options).toPromise();
    }

    deleteInvoice = (id) => {
        const URL = this.BASE_URL + this.config.DELETE_INVOICE;
        return this.httpp.post(URL, {'ID': id}, this.options).toPromise();
    }

    deleteAssociate = (id) => {
        const URL = this.BASE_URL + this.config.DELETE_ASSOCIATE;
        return this.httpp.post(URL, {'ID': id}, this.options).toPromise();
    }

    getAllClients = () => {
        const URL = this.BASE_URL + this.config.ALL_CLIENTS; // 'api/allClients.php';
        return this.httpp.get(URL, this.options).toPromise();
    }

    createClient = (data) => {
        let URL = this.BASE_URL + this.config.NEW_CLIENT;
        if (data['ID']) {
            URL = this.BASE_URL + this.config.EDIT_CLIENT;
        }
        return this.httpp.post(URL, data, this.options).toPromise();
    }

    getClientByID = (id) => {
        const URL = this.BASE_URL + this.config.EDIT_CLIENT; // 'api/updateClient.php';
        const params = new HttpParams().set('ID', id);
        return this.httpp.get(URL, {params}).toPromise();
    }

    updateClient = (data) => {
        const URL = this.BASE_URL + this.config.EDIT_CLIENT;
        return this.httpp.post(URL, data, this.options).toPromise();
    }

    deleteClient = (id) => {
        const URL = this.BASE_URL + this.config.DELETE_CLIENT;
        return this.httpp.post(URL, {'ID': id}, this.options).toPromise();
    }

    getAllInvoicesByType = (itype) => {
        const URL = this.BASE_URL + this.config.ALL_INVOCIES_TYPE;
        const params = new HttpParams().set('iType', itype);
        return this.httpp.get(URL, {params}).toPromise();
    }

    getAllExpensesByUSERID = (id) => {
        const URL = this.BASE_URL + this.config.ALL_EXPENSES_BYUSERID;
        const params = new HttpParams().set('ID', id);
        return this.httpp.get(URL, {params}).toPromise();
    }

    createNewExpense = (data) => {
        let URL = this.BASE_URL + this.config.NEW_EXPENSE;
        if (data['ID']) {
            URL = this.BASE_URL + this.config.EDIT_EXPENSE;
        }
        return this.httpp.post(URL, data, this.options).toPromise();
    }

    getExpenseObjectById = (id) => {
        const URL = this.BASE_URL + this.config.EDIT_EXPENSE;
        const params = new HttpParams().set('ID', id);
        return this.httpp.get(URL, {params}).toPromise();
    }

    deleteExpense = (id) => {
        const URL = this.BASE_URL + this.config.DELETE_EXPENSE;
        return this.httpp.post(URL, {'ID': id}, this.options).toPromise();
    }

    reOpenInvoice = (item) => {
        const URL = this.BASE_URL + this.config.REOPEN_INVOICE;
        return this.httpp.post(URL, item, this.options).toPromise();
    }

    getAllExpenses = () => {
        const URL = this.BASE_URL + this.config.ALL_EXPENSES;
        return this.httpp.get(URL).toPromise();
    }

    getAllExpensesByType = (type) => {
        const URL = this.BASE_URL + this.config.ALL_EXPENSES_BY_TYPE;
        const params = new HttpParams().set('type', type);
        return this.httpp.get(URL, {params}).toPromise();
    }

    getAssociatesByType = (type) => {
        const URL = this.BASE_URL + this.config.ALL_ASSOCIATES_BY_TYPE;
        const params = new HttpParams().set('type', type);
        return this.httpp.get(URL, {params}).toPromise();
    }

    getIncomeDetailsByAssociateID = (ID) => {
        const URL = this.BASE_URL + this.config.ALL_ASSOCIATE_INCOME;
        const params = new HttpParams().set('ID', ID);
        return this.httpp.get(URL, {params}).toPromise();
    }
    getExpenseDetailsByAssociateID = (ID) => {
        const URL = this.BASE_URL + this.config.ALL_ASSOCIATE_EXPENSE;
        const params = new HttpParams().set('ID', ID);
        return this.httpp.get(URL, {params}).toPromise();
    }
    getSummaryDetailsByAssociateID = (ID) => {
        const URL = this.BASE_URL + this.config.ALL_ASSOCIATE_SUMMARY;
        const params = new HttpParams().set('ID', ID);
        return this.httpp.get(URL, {params}).toPromise();
    }

    getAllCompensationsByRecStatus = (RECSTATUS) => {
        const URL = this.BASE_URL + this.config.ALL_COMPENSATIONS_BY_STATUS;
        const params = new HttpParams().set('RECSTATUS', RECSTATUS);
        return this.httpp.get(URL, {params}).toPromise();
    }

    closeCompensation = (item) => {
        const URL = this.BASE_URL + this.config.CLOSE_COMPENSATION;
        return this.httpp.post(URL, item, this.options).toPromise();
    }

    deleteCompensation = (item) => {
        const URL = this.BASE_URL + this.config.DELETE_COMPENSATION;
        return this.httpp.post(URL, item, this.options).toPromise();
    }

    createCompensation = (item) => {
        let URL = this.BASE_URL + this.config.CREATE_COMPENSATION;
        item['ID'] = item['ID'] + '';
        if ( item['ID'] && item['ID'].length > 0) {
            URL = this.BASE_URL + this.config.EDIT_COMPENSATION;
        }
        return this.httpp.post(URL, item, this.options).toPromise();
    }

    getCompensationByID = (ID) => {
        const URL = this.BASE_URL + this.config.EDIT_COMPENSATION;
        const params = new HttpParams().set('ID', ID);
        return this.httpp.get(URL, {params}).toPromise();
    }

    getAllPaidInvoices = () => {
        const URL = this.BASE_URL + this.config.ALL_PAID_INVOICES;
        return this.httpp.get(URL).toPromise();
    }

    assignIncome = (item) => {
        const URL = this.BASE_URL + this.config.ADM_ASSIGN_INCOME;
        return this.httpp.post(URL, item, this.options).toPromise();
    }

    getAllAssociatedRoles = () => {
        const URL = this.BASE_URL + this.config.ADM_ALL_ROLES_ASSOCIATED;
        return this.httpp.get(URL).toPromise();
    }

    getAllRoles = () => {
        const URL = this.BASE_URL + this.config.ALL_ROLES;
        return this.httpp.get(URL).toPromise();
    }

    createRoleMap = (item) => {
        const URL = this.BASE_URL + this.config.ADM_ASSIGN_INCOME;
        return this.httpp.post(URL, item, this.options).toPromise();
    }

}
