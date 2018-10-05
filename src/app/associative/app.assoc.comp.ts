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
    selector: 'app-assoc',
    templateUrl: './app.assoc.comp.html',
    styleUrls: ['./app.assoc.comp.scss']
  })
  export class AppAssociativesComponent implements OnInit, OnChanges, AfterViewInit {
      title = 'Associates';
      associates: any[] = [];
      CRUD = APP_CONSTANTS.CRUD;
      RESPONSE_STATUS = APP_CONSTANTS.ALERT_TYPES;
      statusMsg = { msg: '', type: '', isEnabled: false};
      options = null;
      DATE_TYPES = APP_CONSTANTS.DATA_TYPES;
      constructor( private appService: AppService,
        private appUserAuthService: AppUserAuthService,
        private appRoutingService: AppRoutingService,
        private cd: ChangeDetectorRef,
        private appGridService: AppGridService
        ) { }

      ngOnInit () {
         const state = this.appRoutingService.getCurrentState();
         const options = this.appGridService.getTableOptions();
        options.pager = true;
        options.pagination.pageSize = 50;
        options.columns = this.buildColumns();
        this.options = options;
         if (!utils.isEmpty(state) ) {
            const params = state.params || null;
            console.log(params);
            if ( !utils.isEmpty(params) ) {
                this.statusMsg.msg = params.msg;
                this.statusMsg.type = params.type;
                this.statusMsg.isEnabled = true;
                this.appRoutingService.removeParams('layout/assoc');
            }
         }
         this.getAllAssociates();
      }

      ngOnChanges (changes: SimpleChanges ) {

      }

      ngAfterViewInit() {
          this.cd.detectChanges();
      }

      buildColumns = () => {
        const column1 = this.appGridService.getColumn(0, 'S.No', 'ID', this.DATE_TYPES.NUMBER, true, true, '10%');
        const column2 = this.appGridService.getColumn(1, 'Associate Name', 'FullName', this.DATE_TYPES.STRING, true, true, '40%');
        // column2['customTemplateFun'] = this.getFullName;
        const column3 = this.appGridService.getColumn(2, 'Associate Type', 'AssociateType', this.DATE_TYPES.STRING, true, true, '25%');
        const column4 = this.appGridService.getColumn(3, 'Action', 'action', this.DATE_TYPES.ACTION_BUTTONS, false, false, '20%');
        column4['buttons'] = this.getDefaultActionButtons();
        const columns = [column1, column2, column3, column4];
        return columns;
      }

      getDefaultActionButtons = () => {
        return[
          {buttonType: 'LINK', title: 'View Associate', actionType: 'VIEW',
              pClass: 'px-3', buttonClassName: 'fa fa-eye', onClick: this.onNavigateTo},
          {buttonType: 'LINK', title: 'Edit Associate', actionType: 'EDIT', pClass: 'px-2',
              buttonClassName: 'fa fa-pencil', onClick: this.onNavigateTo},
          {buttonType: 'LINK', title: 'Delete Associate', actionType: 'DELETE',
              pClass: 'px-3', buttonClassName: 'fa fa-trash', onClick: this.onNavigateTo}
         ];
      }

      getFullName = (column, item) => {
        const ele = document.createElement('div');
        ele.setAttribute('ID', item.ID);
        ele.innerHTML = item.FirstName + ' ' + item.LastName;
        return ele;
      }

      onNavigateTo = (param, item) => {
        if ( param === this.CRUD.DELETE) {
            this.deleteAssociate(item);
          } else {
            const params = { type: param, data: item};
            this.appRoutingService.navigateToURLParams('layout/assocCRUD', params);
          }
      }

      deleteAssociate = (item) => {
        // console.log(item);
        this.appService.deleteAssociate(item.ID).then(resp => {
          console.log(resp);
          if ( resp['success'] ) {
            toastr.success(resp['response'], null, {positionClass: 'toast-bottom-right'});
           } else {
            toastr.success(resp['response'], null, {positionClass: 'toast-bottom-right'});
           }
          this.appRoutingService.reloadSamePage('layout/assoc');
        }).catch(ex => {
          console.log('Exception due to delete of invoice', ex);
        });
      }

      onClose = (e) => {
          this.statusMsg.isEnabled = false;
        this.statusMsg = this.getStautsMsgObject();
      }

      getStautsMsgObject = () => {
        return { msg: '', type: '', isEnabled: false};
      }

      getAllAssociates = () => {
        this.appService.getAllAssocites().then((resp) => {
            if (resp['success']) {
                this.associates = resp['response'];
                const dataSource = _.cloneDeep(this.options.dataSource) || {data: [], viewData: []};
                dataSource.data =  _.cloneDeep(this.associates);
                dataSource.originalData = _.cloneDeep(this.associates);
                const options = _.cloneDeep(this.options);
                options.dataSource = dataSource;
                this.options = options;
            } else {

            }
        }).catch((ex) => {
            console.log('Exception caught due to get All Associates', ex);
        });
      }
  }
