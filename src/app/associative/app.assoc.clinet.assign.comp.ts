import { Component, OnInit, OnChanges, SimpleChanges, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { AppService } from '../services/app.service';
import { AppUserAuthService } from '../services/app.userAuth.service';
import { AppRoutingService } from '../services/app.routing.service';
import { APP_CONSTANTS } from '../services/app.constants';
import { AppGridService } from '../services/app.grid.service';
import * as _ from 'lodash';
import { collectExternalReferences } from '../../../node_modules/@angular/compiler';
declare const utils: any;
declare const toastr: any;
@Component({
    selector: 'app-aso-p',
    templateUrl: './app.assoc.client.assign.comp.html',
    styleUrls: ['./app.assoc.comp.scss']
  })
  export class AppAssociateClientAssignmentComponent implements OnInit, OnChanges, AfterViewInit {
    title = 'Project Assign Details';
    options = null;
    user = null;
    CRUD = APP_CONSTANTS.CRUD;
    DATE_TYPES = APP_CONSTANTS.DATA_TYPES;
    constructor(private appService: AppService,
      private appUserAuthService: AppUserAuthService,
      private appRoutingService: AppRoutingService,
      private cd: ChangeDetectorRef,
      private appGridService: AppGridService) {}
    ngOnInit() {
      this.user = this.appUserAuthService.getUser();
      const state = this.appRoutingService.getCurrentState();
      const options = this.appGridService.getTableOptions();
      options.pager = false;
      options.pagination.pageSize = 50;
      options.dataSource = this.defaultDataSource();
      options.columns = this.buildColumns();
      this.options = options;
      this.getAllAssociatesByType();
      this.title = 'Project Assign Details of ' + this.user.FirstName + ' ' + this.user.LastName;
    }
    ngOnChanges(changes: SimpleChanges) {

    }
    ngAfterViewInit() {

    }

    buildColumns = () => {
      const column1 = this.appGridService.getColumn(0, 'Associate Name', 'fullName', this.DATE_TYPES.STRING, true, true, '10%');
      const column2 = this.appGridService.getColumn(1, 'Client Name', 'clientName', this.DATE_TYPES.STRING, true, true, '10%');
      const column3 = this.appGridService.getColumn(2, 'Start Date', 'assignStartDate', this.DATE_TYPES.DATE, false, false, '10%');
      const column4 = this.appGridService.getColumn(3, 'End Date', 'assignEndDate', this.DATE_TYPES.DATE, false, false, '10%');
      const column5 = this.appGridService.getColumn(4, 'Technology', 'technology', this.DATE_TYPES.DATE, false, false, '10%');
      const column6 = this.appGridService.getColumn(5, 'Rate', 'calculatedRate', this.DATE_TYPES.DATE, false, false, '6%');
      const column7 = this.appGridService.getColumn(6, 'Unit', 'unit', this.DATE_TYPES.DATE, false, false, '8%');
      const column8 = this.appGridService.getColumn(7, 'Action', 'action', this.DATE_TYPES.ACTION_BUTTONS, false, false, '10%');
      column8['buttons'] = this.getDefaultActionButtons();
      const columns = [column1, column2, column3, column4, column5, column6, column7, column8];
      return columns;
    }


    getDefaultActionButtons = () => {
      return[
        {buttonType: 'LINK', title: 'Edit Associate Assignment', actionType: 'EDIT', pClass: 'px-2',
         visibleIf: 'return (item.assignEndDate == undefined || item.assignEndDate===null || item.assignEndDate==="")',
         buttonClassName: 'fa fa-pencil', onClick: this.onNavigateTo},
       ];
    }

    getAllAssociatesByType = () => {
      const userId = this.user && this.user.ID || null;
      this.appService.getAllAssignmentByUserLogin(userId).then((resp) => {
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

    defaultDataSource = () => {
      const dataSource =  this.options && this.options.dataSource || {data: [], viewData: []};
        dataSource.data =  [];
        dataSource.originalData = [];
        return dataSource;
    }

    onNavigateTo = (param, data) => {
      this.appRoutingService.navigateToURLParams('layout/assoc-stmt-details', {param: param, data: data});
    }
  }
