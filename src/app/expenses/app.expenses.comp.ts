import { Component, OnInit, OnChanges, SimpleChanges, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { AppService } from '../services/app.service';
import { AppUserAuthService } from '../services/app.userAuth.service';
import { AppRoutingService } from '../services/app.routing.service';
import { APP_CONSTANTS } from '../services/app.constants';
import { AppGridService } from '../services/app.grid.service';
import * as _ from 'lodash';
declare const toastr: any;

@Component({
    selector: 'app-exep',
    templateUrl: './app.expenses.comp.html',
    styleUrls: ['./app.expenses.comp.scss']
  })
export class AppExpensesComponent implements OnInit, OnChanges, AfterViewInit {
    title = 'Expenses';
    private user = null;
    expenses: any[];
    loader = false;
    CRUD = APP_CONSTANTS.CRUD;
    options = null;
    DATE_TYPES = APP_CONSTANTS.DATA_TYPES;

    constructor(private appService: AppService, private appUserAuthService: AppUserAuthService,
        private router: Router, private route: ActivatedRoute, private appRoutingService: AppRoutingService,
        private appGridService: AppGridService
      ) {
          this.user = this.appUserAuthService.getUser();
        }

    ngOnInit() {
         // this.getUserAuth();
    this.user = this.appUserAuthService.getUser();
    // this.getAllInvoices();
    this.getAllExpensesById(this.user.ID);
    const options = this.appGridService.getTableOptions();
    options.pager = true;
    options.pagination.pageSize = 50;
    options.columns = this.buildColumns();
    this.options = options;
    }

    ngOnChanges( changes: SimpleChanges ) {
    }

    ngAfterViewInit() {

    }

    buildColumns = () => {
        // const columns = [];
        const column1 = this.appGridService.getColumn(0, 'ID', 'ID', this.DATE_TYPES.STRING, true, true, '5%');
        const column2 = this.appGridService.getColumn(1, 'Amount', 'Amount', this.DATE_TYPES.NUMBER, true, true, '7%');
        const column3 = this.appGridService.getColumn(2, 'Payee', 'Payee', this.DATE_TYPES.STRING, true, true, '8%');
        const column4 = this.appGridService.getColumn(3, 'Payment Method', 'PaymentMethod', this.DATE_TYPES.STRING, false, true, '13%');
        const column5 = this.appGridService.getColumn(4, 'Expense Header', 'Header', this.DATE_TYPES.STRING, false, true, '10%');
        const column6 = this.appGridService.getColumn(5, 'Reference', 'FullName', this.DATE_TYPES.STRING, true, true, '13%');
        column1.sort['format'] = 'MM/DD/YYYY';
        const column7 = this.appGridService.getColumn(6, 'Description', 'Description', this.DATE_TYPES.STRING, false, false, '13%');
        // const column8 = this.appGridService.getColumn(7, 'Comment', 'Comments', this.DATE_TYPES.STRING, false, false, '10%');
        const column9 = this.appGridService.getColumn(9, 'Date', 'Date', this.DATE_TYPES.DATE, false, false, '10%');
        const column10 = this.appGridService.getColumn(10, 'Action', 'action', this.DATE_TYPES.ACTION_BUTTONS, false, false, '10%');
        column10['buttons'] = this.getDefaultActionButtons();
        const columns = [column1, column2, column3, column4, column5, column6, column7, column9, column10];
        return columns;
      }

      getDefaultActionButtons = () => {
        return[
            {buttonType: 'LINK', title: 'View Expense', actionType: 'VIEW',
                pClass: 'px-1', buttonClassName: 'fa fa-eye', onClick: this.onNavigateTo},
            {buttonType: 'LINK', title: 'Edit Expense', actionType: 'EDIT', pClass: 'px-2',
                buttonClassName: 'fa fa-pencil', onClick: this.onNavigateTo},
            {buttonType: 'LINK', title: 'Delete Expense', actionType: 'DELETE',
                pClass: 'px-2', buttonClassName: 'fa fa-trash', onClick: this.onNavigateTo}
           ];
      }

    onNavigateTo = (type, item) => {
        // console.log(type);
        if ( type === this.CRUD.DELETE) {
            this.deleteExpense(item);
        } else {
            const params = { type: type, data: item};
            this.appRoutingService.navigateToURLParams('layout/expCRUD', params);
        }
    }

    getAllExpensesById = (ID) => {
        // const ID = this.user.ID;
        this.appService.getAllExpensesByUSERID(ID).then((resp) => {
            this.expenses = resp['response'];
            const dataSource = _.cloneDeep(this.options.dataSource) || {data: [], viewData: []};
            dataSource.data =  _.cloneDeep(this.expenses);
            dataSource.originalData = _.cloneDeep(this.expenses);
            const options = _.cloneDeep(this.options);
            options.dataSource = dataSource;
            this.options = options;
        }).catch((ex) => {

        });
    }

    deleteExpense = (data) => {
        this.appService.deleteExpense(data.ID).then(resp => {
            // console.log(resp);
            if ( resp['success'] ) {
              toastr.success(resp['response'], null, {positionClass: 'toast-bottom-right'});
             } else {
              toastr.success(resp['response'], null, {positionClass: 'toast-bottom-right'});
             }
            // this.appRoutingService.reloadSamePage('layout/exp');
            this.getAllExpensesById(this.user.ID);
          }).catch(ex => {
            console.log('Exception due to delete of invoice', ex);
          });
    }

}
