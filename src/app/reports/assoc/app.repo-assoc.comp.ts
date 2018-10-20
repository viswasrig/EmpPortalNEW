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
  selector: 'app-repo-assoc',
  templateUrl: './app.repo-assoc.comp.html',
  styleUrls: ['./app.repo-assoc.comp.scss']
})
export class AppReportAssociatesComponent implements OnInit, OnChanges {
  title = 'Reports';
  private user = null;
  loader = false;
  CRUD = APP_CONSTANTS.CRUD;
  options = null;
  DATE_TYPES = APP_CONSTANTS.DATA_TYPES;
  iType = 'A';
  subtitle = 'Associates ';
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
    this.getAllAssociatesByType();
  }

  buildColumns = () => {
    const column1 = this.appGridService.getColumn(0, 'Associate ID', 'ID', this.DATE_TYPES.STRING, true, true, '15%');
    const column2 = this.appGridService.getColumn(1, 'Associate Name', 'FullName', this.DATE_TYPES.STRING, true, true, '45%');
    const column3 = this.appGridService.getColumn(2, 'Balence', 'Balance', this.DATE_TYPES.NUMBER, true, true, '15%');
    const column4 = this.appGridService.getColumn(4, 'Action', 'action', this.DATE_TYPES.ACTION_BUTTONS, false, false, '15%');
    column4['buttons'] = this.getDefaultActionButtons();
    const columns = [column1, column2, column3, column4];
    return columns;
  }

  ngOnChanges(changes: SimpleChanges) {

  }

  getUserAuth = () => {
    this.appUserAuthService.getUser();
  }

  getDefaultActionButtons = () => {
    return[
      {buttonType: 'LINK', title: 'View Associate Details', actionType: 'VIEW',
      pClass: 'px-2', buttonClassName: 'fa fa-eye', onClick: this.onNavigateTo},
      {buttonType: 'LINK', title: 'Edit Associate', actionType: 'EDIT', pClass: 'px-2', visibleIf: 'false',
       buttonClassName: 'fa fa-pencil', onClick: this.onNavigateTo},
      {buttonType: 'LINK', title: 'Delete Associate', actionType: 'DELETE', visibleIf: 'false',
      pClass: 'px-2', buttonClassName: 'fa fa-trash', onClick: this.onNavigateTo}
     ];
  }

  onFilterReports = (e) => {
    this.getAllAssociatesByType();
  }

  getAllAssociatesByType = () => {
    this.appService.getAssociatesByType(this.iType).then((resp) => {
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
    this.appRoutingService.navigateToURLParams('layout/rep-assoc-details', {param: param, data: data});
  }

}

