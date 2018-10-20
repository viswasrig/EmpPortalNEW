import { Component, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { AppService } from '../services/app.service';
import { AppUserAuthService } from '../services/app.userAuth.service';
import { AppRoutingService } from '../services/app.routing.service';
import { APP_CONSTANTS } from '../services/app.constants';
import { AppGridService } from '../services/app.grid.service';
import * as _ from 'lodash';
declare const toastr: any;
declare const utils: any;

@Component({
  selector: 'app-asso-stmt-details',
  templateUrl: './app.assoc.stmt.crud.comp.html',
  styleUrls: ['./app.assoc.comp.scss']
})
export class AppAssociateStatementDetailsComponent implements OnInit, OnChanges {
    title = 'Associate Details';
    private user = null;
    loader = false;
    CRUD = APP_CONSTANTS.CRUD;
    options = null;
    DATE_TYPES = APP_CONSTANTS.DATA_TYPES;
    iType = 'A';
    subtitle = 'Associates ';
    state = null;
    TABS = {
        INCOME: 'INCOME',
        EXPENSES: 'EXPENSES',
        SUMMARY: 'SUMMARY'
    };
    selectedTab = null;
    summaryData = null;
    constructor(private appService: AppService, private appUserAuthService: AppUserAuthService,
        private router: Router, private route: ActivatedRoute, private appRoutingService: AppRoutingService,
        private appGridService: AppGridService
    ) {
        this.user = this.appUserAuthService.getUser();
    }

    ngOnInit() {
        const state = this.appRoutingService.getCurrentState();
        if ( !utils.isEmpty(state) ) {
            const data = state.params && state.params.data;
            this.state = {data: data};
            console.log(state);
        }
        this.selectedTab = this.TABS.INCOME;
        this.initialiseIncomeModule();
        this.onTabChange(this.TABS.INCOME);
    }

    ngOnChanges() {

    }

    onTabChange = (tab) => {
        this.selectedTab = tab;
        switch (tab) {
            case this.TABS.INCOME: {
                this.getIncomeDetails();
                this.title = 'Income Details Of ' + this.state.data.FullName;
                break;
            }
            case this.TABS.EXPENSES: {
                this.getExpenseDetails();
                this.title = 'Expense Details Of ' + this.state.data.FullName;
                break;
            }
            case this.TABS.SUMMARY: {
                this.getSummaryDetails();
                this.title = 'Summary Details Of ' + this.state.data.FullName;
                break;
            }
        }
    }

    initialiseIncomeModule = ( ) => {
        const options = this.appGridService.getTableOptions();
        options.pager = true;
        options.pagination.pageSize = 50;
        options.columns = this.buildIncomeColumns();
        this.options = options;
    }

    initialiseExpensesModule = ( ) => {
        const options = this.appGridService.getTableOptions();
        options.pager = true;
        options.pagination.pageSize = 50;
        options.columns = this.buildExpensesColumns();
        this.options = options;
    }

    initialiseSummaryModule = ( ) => {
        const options = this.appGridService.getTableOptions();
        options.pager = true;
        options.pagination.pageSize = 50;
        options.columns = this.buildSummaryColumns();
        this.options = options;
    }


    buildIncomeColumns = () => {
        const column1 = this.appGridService.getColumn(0, 'Client Name', 'ClientName', this.DATE_TYPES.STRING, true, true, '20%');
        const column2 = this.appGridService.getColumn(1, 'From Date', 'FromDate', this.DATE_TYPES.DATE, true, false, '8%');
        const column3 = this.appGridService.getColumn(2, 'To Date', 'ToDate', this.DATE_TYPES.DATE, true, false, '8%');
        const column4 = this.appGridService.getColumn(3, 'Received Date', 'ReceivedDate', this.DATE_TYPES.DATE, true, false, '9%');
        const column5 = this.appGridService.getColumn(4, 'Rate', 'Price', this.DATE_TYPES.DATE, true, true, '8%');
        const column6 = this.appGridService.getColumn(5, 'Units', 'NumOfUnits', this.DATE_TYPES.STRING, true, true, '8%');
        // const column7 = this.appGridService.getColumn(6, 'Amount', 'Amount', this.DATE_TYPES.NUMBER, true, false, '8%');
        const column7 = this.appGridService.getColumn(6, 'Employer Amount', 'EmployerAmount', this.DATE_TYPES.STRING, true, false, '8%');
        const column8 = this.appGridService.getColumn(7, 'Percentage', 'Percentage', this.DATE_TYPES.STRING, false, false, '5%');
        const column9 = this.appGridService.getColumn(8, 'Employee Share', 'EmployeeShare', this.DATE_TYPES.STRING, false, false, '5%');
        const columns = [column1, column2, column3, column4, column5, column6,  column7, column8, column9];
        return columns;
    }

    buildExpensesColumns = () => {
        const column1 = this.appGridService.getColumn(0, 'Date', 'Date', this.DATE_TYPES.DATE, true, false, '8%');
        const column2 = this.appGridService.getColumn(1, 'Amount', 'Amount', this.DATE_TYPES.NUMBER, true, true, '8%');
        const column3 = this.appGridService.getColumn(2, 'Payement Method', 'PaymentMethod', this.DATE_TYPES.STRING, true, true, '25%');
        const column4 = this.appGridService.getColumn(3, 'Header', 'Header', this.DATE_TYPES.STRING, true, true, '10%');
        const column5 = this.appGridService.getColumn(5, 'Reference', 'Reference', this.DATE_TYPES.STRING, true, true, '10%');
        const column6 = this.appGridService.getColumn(6, 'Description', 'Description', this.DATE_TYPES.STRING, true, false, '20%');
        const column7 = this.appGridService.getColumn(7, 'Comments', 'Comments', this.DATE_TYPES.STRING, true, false, '18%');
        const columns = [column1, column2, column3, column4, column5, column6, column7];
        return columns;
    }

    buildSummaryColumns = () => {
        const column1 = this.appGridService.getColumn(0, 'Total Income', 'TotalIncome', this.DATE_TYPES.DATE, true, true, '10%');
        const column2 = this.appGridService.getColumn(1, 'Total Expenses', 'TotalExpenses', this.DATE_TYPES.NUMBER, true, false, '10%');
        const column3 = this.appGridService.getColumn(2, 'Balence', 'Balance', this.DATE_TYPES.STRING, true, false, '10%');
        const column4 = this.appGridService.getColumn(3, 'Reference', 'Reference', this.DATE_TYPES.STRING, true, false, '10%');
        const columns = [column1, column2, column3, column4];
        return columns;
    }

    getIncomeDetails = () => {
        const ID = this.state && this.state.data.ID || 1001;
        this.appService.getIncomeDetailsByAssociateID (ID).then(resp => {
            if ( resp['success'] ) {
                const list = resp['response'];
                const options = _.cloneDeep(this.options);
                options.columns = this.buildIncomeColumns();
                options.dataSource = null;
                const dataSource = _.cloneDeep(this.options.dataSource) || {data: [], viewData: []};
                dataSource.data =  _.cloneDeep(list);
                dataSource.originalData = _.cloneDeep(list);
                options.dataSource = dataSource;
                this.options = options;
            } else {

            }
         }).catch((e) => {
            console.log('Exception caught on Fetch Income', e);
        });
    }

    getExpenseDetails = () => {
        const ID = this.state && this.state.data.ID || 1085;
        this.appService.getExpenseDetailsByAssociateID(ID).then(resp => {
            if ( resp['success'] ) {
                const list = resp['response'];
                const options = _.cloneDeep(this.options);
                options.columns = this.buildExpensesColumns();
                options.dataSource = null;
                const dataSource = _.cloneDeep(this.options.dataSource) || {data: [], viewData: []};
                dataSource.data =  _.cloneDeep(list);
                dataSource.originalData = _.cloneDeep(list);
                options.dataSource = dataSource;
                this.options = options;
            } else {

            }
         }).catch((e) => {
            console.log('Exception caught on Fetch Income', e);
        });
    }

    getSummaryDetails = () => {
        const ID = this.state && this.state.data.ID || 1085;
        this.appService.getSummaryDetailsByAssociateID(ID).then(resp => {
            if ( resp['success'] ) {
                const list = resp['response'];
                this.summaryData = list[0];
                console.log(this.summaryData);
                const options = _.cloneDeep(this.options);
                options.columns = this.buildSummaryColumns();
                options.dataSource = null;
                const dataSource = _.cloneDeep(this.options.dataSource) || {data: [], viewData: []};
                dataSource.data =  _.cloneDeep(list);
                dataSource.originalData = _.cloneDeep(list);
                options.dataSource = dataSource;
                this.options = options;
            } else {

            }
         }).catch((e) => {
            console.log('Exception caught on Fetch Income', e);
        });
    }
    isSummaryNull = () => {
        const flag  = utils.isEmpty(this.summaryData);
        return flag;
    }
    isBalenceIsNegative = (summaryData) => {
        const TIncome = parseInt(summaryData && summaryData.TotalIncome || -1, 10) || -1;
        const TExpense = parseInt(summaryData && summaryData.TotalExpenses || -1, 10) || -1;
       return TIncome > TExpense;
    }
}
