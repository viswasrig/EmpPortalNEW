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
    selector: 'app-actrec',
    templateUrl: './app.acctreceive.comp.html',
    styleUrls: ['./app.acctreceive.comp.scss']
})
export class AppAccountReceivableComponent implements OnInit, OnChanges {
  title = 'Recieve Payements';
  private user = null;
  receivePayments: any[];
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
    this.getAllReceivePayments();
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
    const column2 = this.appGridService.getColumn(1, 'Invoice Number', 'AltID', this.DATE_TYPES.NUMBER, true, true, '13%');
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

  ngOnChanges(changes: SimpleChanges) {

  }

  getUserAuth = () => {
    this.appUserAuthService.getUser();
  }

  getDefaultActionButtons = () => {
    return[
      {buttonType: 'LINK', title: 'Receive Payment', actionType: 'REPAY',
       pClass: 'px-2', buttonClassName: 'fa fa-usd', onClick: this.onNavigateTo}
     ];
  }

  getAllReceivePayments = () => {
    this.appService.getInvoices().then((resp) => {
      this.receivePayments = resp['response'];
      const dataSource = _.cloneDeep(this.options.dataSource) || {data: [], viewData: []};
      dataSource.data =  _.cloneDeep(this.receivePayments);
      dataSource.originalData = _.cloneDeep(this.receivePayments);
      const options = _.cloneDeep(this.options);
      options.dataSource = dataSource;
      this.options = options;
    }).catch((ex) => {
      console.log('Exception: ', ex);
    });
  }

  onNavigateTo = (param, data) => {
    const params = { type: param, data: data};
    this.appRoutingService.navigateToURLParams('layout/actrecivCRUD', params);
  }
}
