import { Component, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { AppService } from '../services/app.service';
import { AppUserAuthService } from '../services/app.userAuth.service';
import { AppRoutingService } from '../services/app.routing.service';
import { APP_CONSTANTS } from '../services/app.constants';
import { AppGridService } from '../services/app.grid.service';
import * as _ from 'lodash';
declare const toastr: any;


@Component({
  selector: 'app-invoice',
  templateUrl: './app.invoice.comp.html',
  styleUrls: ['./app.invoice.comp.scss']
})
export class AppInvoiceComponent implements OnInit, OnChanges {
  title = 'Invoices';
  private user = null;
  invoices: any[];
  loader = false;
  CRUD = APP_CONSTANTS.CRUD;
  options = null;
  DATE_TYPES = APP_CONSTANTS.DATA_TYPES;
  iType = 'O';
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
    this.getAllInvoicesByType();
    const options = this.appGridService.getTableOptions();
    options.pager = true;
    options.pagination.pageSize = 50;
    // const options  = this.appGridService.getTableOptions();
    options.columns = this.buildColumns();
    this.options = options;
  }

  buildColumns = () => {
    // const columns = [];
    const column1 = this.appGridService.getColumn(0, 'ID', 'ID', this.DATE_TYPES.NUMBER, true, true, '5%');
    const column2 = this.appGridService.getColumn(1, 'Invoice Number', 'AltID', this.DATE_TYPES.NUMBER, true, true, '8%');
    const column3 = this.appGridService.getColumn(2, 'Associate Name', 'FullName', this.DATE_TYPES.STRING, true, true, '19%');
    const column4 = this.appGridService.getColumn(3, 'Client Name', 'ClientName', this.DATE_TYPES.STRING, true, true, '18%');
    const column5 = this.appGridService.getColumn(4, 'Amount', 'Amount', this.DATE_TYPES.CURRENCY, true, true, '10%');
    const column6 = this.appGridService.getColumn(5, 'Created Date', 'Date', this.DATE_TYPES.DATE, true, false, '10%');
    column6.sort['format'] = 'MM/DD/YYYY';
    const column7 = this.appGridService.getColumn(6, 'Due Date', 'DueDate', this.DATE_TYPES.DATE, true, false, '10%');
    column7.sort['format'] = 'MM/DD/YYYY';
    const column8 = this.appGridService.getColumn(7, 'Action', 'action', this.DATE_TYPES.ACTION_BUTTONS, false, false, '10%');
    column8.sort['format'] = 'MM/DD/YYYY';
    column8['buttons'] = this.getDefaultActionButtons();
    const columns = [column1, column2, column3, column4, column5, column6, column7, column8];
    return columns;
  }

  getClosedInvoicesColumns = () => {
   const columns =  this.buildColumns();
   const column = this.appGridService.getColumn(5, 'Received Date', 'ReceivedDate', this.DATE_TYPES.DATE, true, false, '10%');
   column.sort['format'] = 'MM/DD/YYYY';
   columns.splice(columns.length - 1, 0, column);
   columns[columns.length - 1].width = '7%';
   return columns;
  }

  ngOnChanges(changes: SimpleChanges) {

  }

  getUserAuth = () => {
    this.appUserAuthService.getUser();
  }

  getDefaultActionButtons = () => {
    return[
      {buttonType: 'LINK', title: 'View Invoice', actionType: 'VIEW',
      pClass: 'px-2', buttonClassName: 'fa fa-eye', onClick: this.onNavigateTo},
      {buttonType: 'LINK', title: 'Edit Invoice', actionType: 'EDIT', pClass: 'px-2',
       buttonClassName: 'fa fa-pencil', onClick: this.onNavigateTo},
      {buttonType: 'LINK', title: 'Delete Invoice', actionType: 'DELETE',
      pClass: 'px-2', buttonClassName: 'fa fa-trash', onClick: this.onNavigateTo}
     ];
  }

  onFilterInvocie = (e) => {
    const options = _.cloneDeep(this.options);
    if (this.iType === 'D') {
      options.columns = this.buildColumns();
      options.columns[options.columns.length - 1].buttons = [];
    } else if ( this.iType === 'C') {
      options.columns = this.getClosedInvoicesColumns();
      options.columns[options.columns.length - 1].buttons = [{buttonType: 'LINK', title: 'Reopen', actionType: this.CRUD.REOPEN,
      pClass: 'px-2', buttonClassName: 'fa fa-eye', onClick: this.onNavigateTo}];
    } else {
      options.columns = this.buildColumns();
      const buttons = this.getDefaultActionButtons();
      options.columns[options.columns.length - 1]['buttons'] = buttons;
    }
    this.options = options;
    this.getAllInvoicesByType();
  }

  getAllInvoices = () => {
    this.appService.getInvoices().then((resp) => {
      this.invoices = resp['response'];
      const dataSource = _.cloneDeep(this.options.dataSource) || {data: [], viewData: []};
      dataSource.data =  _.cloneDeep(this.invoices);
      dataSource.originalData = _.cloneDeep(this.invoices);
      const options = _.cloneDeep(this.options);
      options.dataSource = dataSource;
      this.options = options;
    }).catch((ex) => {
      console.log('Exception: ', ex);
    });
  }

  getAllInvoicesByType = () => {
    this.appService.getAllInvoicesByType(this.iType).then((resp) => {
      this.invoices = resp['response'];
      const dataSource = _.cloneDeep(this.options.dataSource) || {data: [], viewData: []};
      dataSource.data =  _.cloneDeep(this.invoices);
      dataSource.originalData = _.cloneDeep(this.invoices);
      const options = _.cloneDeep(this.options);
      options.dataSource = dataSource;
      this.options = options;
    }).catch((ex) => {

    });
  }


  createNewInvoice = () => {
    this.router.navigate( ['/layout/invnew']);
  }

  onNavigateTo = (param, data) => {
    if ( param === this.CRUD.DELETE) {
      this.deleteInvoice(data);
    } else if (param === this.CRUD.REOPEN) {
      this.reopenInvoice(data);
    } else {
      const params = { type: param, data: data};
      this.appRoutingService.navigateToURLParams('layout/crud', params);
    }
  }

  deleteInvoice = (item) => {
    // console.log(item);
    this.appService.deleteInvoice(item.ID).then(resp => {
      console.log(resp);
      if ( resp['success'] ) {
        toastr.success(resp['response'], null, {positionClass: 'toast-bottom-right'});
       } else {
        toastr.success(resp['response'], null, {positionClass: 'toast-bottom-right'});
       }
      // this.appRoutingService.reloadSamePage('layout/invoice');
      this.getAllInvoicesByType();
    }).catch(ex => {
      console.log('Exception due to delete of invoice', ex);
    });
  }

  reopenInvoice = (item) => {
    console.log(item);
    item = {...item, userId: this.user.ID};
    this.appService.reOpenInvoice(item).then(resp => {
      console.log(resp);
      if ( resp['success'] ) {
        toastr.success(resp['response'], null, {positionClass: 'toast-bottom-right'});
       } else {
        toastr.success(resp['response'], null, {positionClass: 'toast-bottom-right'});
       }
      this.getAllInvoicesByType();
    }).catch(ex => {
      console.log('Exception due to delete of invoice', ex);
    });
  }
}

