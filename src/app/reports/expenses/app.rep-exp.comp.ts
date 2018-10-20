import { Component, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { AppService } from '../../services/app.service';
import { AppUserAuthService } from '../../services/app.userAuth.service';
import { AppRoutingService } from '../../services/app.routing.service';
import { APP_CONSTANTS } from '../../services/app.constants';
import { AppGridService } from '../../services/app.grid.service';
import * as _ from 'lodash';
declare const toastr: any;


@Component({
  selector: 'app-repo-exp',
  templateUrl: './app.rep-exp.comp.html',
  styleUrls: ['./app.rep-exp.comp.scss']
})
export class AppReportExpensesComponent implements OnInit, OnChanges {
  title = 'Reports';
  private user = null;
  loader = false;
  CRUD = APP_CONSTANTS.CRUD;
  options = null;
  DATE_TYPES = APP_CONSTANTS.DATA_TYPES;
  iType = 'A';
  subtitle = 'Expenses ';
  constructor(private appService: AppService, private appUserAuthService: AppUserAuthService,
  private router: Router, private route: ActivatedRoute, private appRoutingService: AppRoutingService,
  private appGridService: AppGridService
) {
    this.user = this.appUserAuthService.getUser();
  }


  ngOnInit() {
    // this.getUserAuth();
    this.user = this.appUserAuthService.getUser();
    const options = this.appGridService.getTableOptions();
    options.pager = true;
    options.pagination.pageSize = 50;
    options.columns = this.buildColumns();
    this.options = options;
    this.getAllExpensesByType();
  }

  buildColumns = () => {
    const column1 = this.appGridService.getColumn(0, 'ID', 'ID', this.DATE_TYPES.STRING, true, true, '5%');
    const column2 = this.appGridService.getColumn(1, 'Amount', 'Amount', this.DATE_TYPES.NUMBER, true, true, '7%');
    const column3 = this.appGridService.getColumn(2, 'Payee', 'Payee', this.DATE_TYPES.STRING, true, true, '12%');
    const column4 = this.appGridService.getColumn(3, 'Payment Method', 'PaymentMethod', this.DATE_TYPES.STRING, false, true, '15%');
    const column5 = this.appGridService.getColumn(4, 'Expense Header', 'Header', this.DATE_TYPES.STRING, false, true, '10%');
    const column6 = this.appGridService.getColumn(5, 'Reference', 'FullName', this.DATE_TYPES.STRING, true, true, '13%');
    const column7 = this.appGridService.getColumn(6, 'Description', 'Description', this.DATE_TYPES.STRING, false, false, '10%');
    const column8 = this.appGridService.getColumn(7, 'Date', 'Date', this.DATE_TYPES.DATE, false, true, '8%');
    const column9 = this.appGridService.getColumn(8, 'Action', 'action', this.DATE_TYPES.ACTION_BUTTONS, false, false, '10%');
    column9['buttons'] = this.getDefaultActionButtons();
    const columns = [column1, column2, column3, column4, column5, column6, column7, column8, column9];
    return columns;
  }

  ngOnChanges(changes: SimpleChanges) {

  }

  getUserAuth = () => {
    this.appUserAuthService.getUser();
  }

  getDefaultActionButtons = () => {
    return[
      {buttonType: 'LINK', title: 'View Expense', actionType: 'VIEW',
      pClass: 'px-2', buttonClassName: 'fa fa-eye', onClick: this.onNavigateTo},
      {buttonType: 'LINK', title: 'Edit Expense', actionType: 'EDIT', pClass: 'px-2', visibleIf: 'return item.recStatus!="D"',
       buttonClassName: 'fa fa-pencil', onClick: this.onNavigateTo},
      {buttonType: 'LINK', title: 'Delete Expense', actionType: 'DELETE', visibleIf: 'return item.recStatus!="D"',
      pClass: 'px-2', buttonClassName: 'fa fa-trash', onClick: this.onNavigateTo}
     ];
  }

  onFilterReports = (e) => {
    this.getAllExpensesByType();
  }

  getAllExpensesByType = () => {
    this.appService.getAllExpensesByType(this.iType).then((resp) => {
      const list = resp['response'];
      const dataSource = _.cloneDeep(this.options.dataSource) || {data: [], viewData: []};
      dataSource.data =  _.cloneDeep(list);
      dataSource.originalData = _.cloneDeep(list);
      const options = _.cloneDeep(this.options);
      options.dataSource = dataSource;
      this.options = options;
    }).catch((ex) => {
      console.log('Exception: ', ex);
    });
  }

  onNavigateTo = (param, data) => {
  }

}

