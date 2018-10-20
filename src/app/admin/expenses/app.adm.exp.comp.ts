import { Component, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { AppService } from '../../services/app.service';
import { AppUserAuthService } from '../../services/app.userAuth.service';
import { AppRoutingService } from '../../services/app.routing.service';
import { APP_CONSTANTS } from '../../services/app.constants';
import { AppGridService } from '../../services/app.grid.service';
import * as _ from 'lodash';
import { PARAMETERS } from '../../../../node_modules/@angular/core/src/util/decorators';
declare const toastr: any;
declare const utils: any;

@Component({
  selector: 'app-adm-emp-exp',
  templateUrl: './app.adm.exp.comp.html',
  styleUrls: ['./app.adm.exp.comp.scss']
})
export class AppAdminEmployeeExpensesComponent implements OnInit, OnChanges {
    title = 'Employee Expenses';
    private user = null;
    loader = false;
    CRUD = APP_CONSTANTS.CRUD;
    options = null;
    DATE_TYPES = APP_CONSTANTS.DATA_TYPES;
    subtitle = '';
    state = null;
    TABS = {
        ASSOC_EXPENSES: 'ASSOC_EXPENSES',
        COMPANY_EXPENSES: 'COMPANY_EXPENSES'
    };
    selectedTab = null;
    summaryData = null;
    eType = 'A';
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
            // console.log(state);
        }
        this.selectedTab = this.TABS.ASSOC_EXPENSES;
        this.initialiseAssociateExpensesModule();
        this.onTabChange(this.TABS.ASSOC_EXPENSES);
    }

    ngOnChanges() {

    }

    onTabChange = (tab) => {
        this.selectedTab = tab;
        this.eType = 'A';
        switch (tab) {
            case this.TABS.ASSOC_EXPENSES: {
                this.getAssociateExpensesDetails();
                break;
            }
            case this.TABS.COMPANY_EXPENSES: {
                this.getAssociateExpensesDetails();
                break;
            }
        }
    }

    initialiseAssociateExpensesModule = ( ) => {
        const options = this.appGridService.getTableOptions();
       // options.container = options.container + ' a-exp-t'; 
        options.pager = true;
        options.pagination.pageSize = 50;
        options.columns = this.buildAssociateExpensesColumns();
        this.options = options;
    }


    buildAssociateExpensesColumns = () => {
        const column1 = this.appGridService.getColumn(0, 'Associate ID', 'AssociateID', this.DATE_TYPES.STRING, true, true, '5%');
        const column2 = this.appGridService.getColumn(1, 'Associate Name', 'FullName', this.DATE_TYPES.STRING, true, true, '35%');
        const column3 = this.appGridService.getColumn(2, 'Total Expenses', 'Amount', this.DATE_TYPES.NUMBER, true, true, '15%');
        const column4 = this.appGridService.getColumn(3, 'Action', 'action', this.DATE_TYPES.ACTION_BUTTONS, false, false, '10%');
        column4['buttons'] = this.getAssociateExpensesColumns();
        const columns = [column1, column2, column3, column4];
        return columns;
    }

    getAssociateExpensesColumns = () => {
        return[
            {buttonType: 'LINK', title: 'View Expense', actionType: this.CRUD.VIEW,
            pClass: 'px-3', buttonClassName: 'fa fa-eye', onClick: this.onNavigateTo},
            {buttonType: 'LINK', title: 'Edit Expense', actionType: this.CRUD.EDIT, pClass: 'px-3', 
            visibleIf: 'return (item.recStatus!="D" && item.RecTransformed!="Y")',
             buttonClassName: 'fa fa-pencil', onClick: this.onNavigateTo},
            {buttonType: 'LINK', title: 'Transform Expense', actionType: this.CRUD.ASSIGN,
            visibleIf: 'return (item.recStatus!="D" && item.RecTransformed!="Y")',
            pClass: 'px-3', buttonClassName: 'fa fa-arrow-right', onClick: this.onNavigateTo}
           ];
    }

    onNavigateTo = (type, item) => {
        if (type === this.CRUD.ASSIGN) {
            this.onExpenseTransform(item);
        } else {
            const params = { type: type, data: item};
            this.appRoutingService.navigateToURLParams('layout/adm-exp-crud', params);
        }
    }

    onTypeChange = (e) => {
        // this.eType = e.target.value;
        if ( this.selectedTab === this.TABS.ASSOC_EXPENSES) {
            this.getAssociateExpensesDetails();
        } else {
            this.getAssociateExpensesDetails();
        }
    }

    getAssociateExpensesDetails = () => {
        const  type = this.eType;
        this.appService.getAllExpensesByAssociateOnType(type, this.selectedTab).then(resp => {
            const options = _.cloneDeep(this.options);
            options.columns = this.buildAssociateExpensesColumns();
            options.dataSource = null;
            const dataSource = _.cloneDeep(this.options.dataSource) || {data: [], viewData: []};
            if ( resp['success'] ) {
                const list = resp['response'];
                dataSource.data =  _.cloneDeep(list);
                dataSource.originalData = _.cloneDeep(list);
            } else {
                dataSource.data = [];
                dataSource.originalData = [];
            }
            options.dataSource = dataSource;
            this.options = options;
         }).catch((e) => {
            console.log('Exception caught on Fetch Income', e);
        });
    }

    onExpenseTransform = (item) => {
        this.appService.getExpensesTransform(item).then(res => {
            if (res['success']) {
                toastr.success(res['response'], null, { positionClass: 'toast-bottom-right' });
                this.getAssociateExpensesDetails();
            } else {
                toastr.error(res['response'], null, { positionClass: 'toast-bottom-right' });
            }
        }).then(ex => {
            console.log('Exception caught due to Tranform', ex);
        });
    }
}
