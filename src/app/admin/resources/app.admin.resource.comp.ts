import { Component, OnInit, OnChanges, SimpleChanges, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import { AppService } from '../../services/app.service';
import { AppUserAuthService } from '../../services/app.userAuth.service';
import { AppRoutingService } from '../../services/app.routing.service';
import { APP_CONSTANTS } from '../../services/app.constants';
import { AppLoaderService } from '../../services/app.loader.service';
import { AppGridService } from '../../services/app.grid.service';
import * as _ from 'lodash';
declare const toastr: any;
@Component({
    selector: 'app-adm-resource-assign',
    templateUrl: './app.admin.resource.comp.html',
    styleUrls: [ './app.admin.resource.comp.scss']
})
export class AppRoleResourceAllotmentComponent implements OnInit, OnChanges {
    title = 'Role & Resource Mapping';
    CRUD = APP_CONSTANTS.CRUD;
    RESPONSE_STATUS = APP_CONSTANTS.ALERT_TYPES;
    options = null;
    DATE_TYPES = APP_CONSTANTS.DATA_TYPES;
    dateOptions = {default: new Date(), format: 'MM/DD/YYYY'};
    user = null;
    constructor(
        private appService: AppService,
        private appUserAuthService: AppUserAuthService,
        private appRoutingService: AppRoutingService,
        private appLoaderService: AppLoaderService,
        private appGridService: AppGridService
    ) {

    }
    ngOnInit() {
        const state = this.appRoutingService.getCurrentState();
        const options = this.appGridService.getTableOptions();
        options.pager = true;
        options.pagination.pageSize = 30;
        options.columns = this.buildColumns();
        this.options = options;
        this.user = this.appUserAuthService.getUser();
        this.getAllResourcesBasedOnRole();
    }
    ngOnChanges() {

    }

    buildColumns = () => {
        const column1 = this.appGridService.getColumn(0, 'ID', 'RRID', this.DATE_TYPES.NUMBER, true, true, '4%');
        const column2 = this.appGridService.getColumn(1, 'Resource Name', 'ResourceName', this.DATE_TYPES.STRING, true, true, '5%');
        const column3 = this.appGridService.getColumn(2, 'Resource Desc', 'ResorceDesc', this.DATE_TYPES.STRING, false, false, '18%');
        const column4 = this.appGridService.getColumn(3, 'Role Name', 'RoleDesc', this.DATE_TYPES.STRING, true, true, '8%');
        const column5 = this.appGridService.getColumn(4, 'Resource Status', 'ResourceRoleStatus',
        this.DATE_TYPES.STRING, false, false, '7%');
        const column6 = this.appGridService.getColumn(5, 'Created By', 'CreatedByName',
        this.DATE_TYPES.STRING, false, true, '10%');
        const column7 = this.appGridService.getColumn(6, 'Created Date', 'CreatedDate',
        this.DATE_TYPES.STRING, false, false, '7%');
        const column8 = this.appGridService.getColumn(7, 'Modified By', 'ModifiedByName',
        this.DATE_TYPES.STRING, false, true, '10%');
        const column9 = this.appGridService.getColumn(8, 'Modified Date', 'ModifiedDate',
        this.DATE_TYPES.STRING, false, false, '7%');
        const column10 = this.appGridService.getColumn(9, 'Action', 'action', this.DATE_TYPES.ACTION_BUTTONS, false, false, '9%');
        column10['buttons'] = this.getDefaultActionButtons();
        const columns = [column1, column2, column3, column4, column5, column6, column7, column8, column9, column10];
        return columns;
    }

    getDefaultActionButtons = () => {
        return [
            {
                buttonType: 'LINK', title: 'View Role & Resource Mapping', actionType: this.CRUD.VIEW,
                pClass: 'px-1', buttonClassName: 'fa fa-eye', onClick: this.onNavigateTo
            },
            {
                buttonType: 'LINK', title: 'Edit Role & Resource Mapping', actionType: this.CRUD.EDIT, pClass: 'px-2',
                buttonClassName: 'fa fa-pencil', onClick: this.onNavigateTo, visibleIf: 'return item.Status!="D"'
            },
            {
                buttonType: 'LINK', title: 'Delete Role & Resource Mapping', actionType: this.CRUD.DELETE,
                pClass: 'px-1', buttonClassName: 'fa fa-trash', onClick: this.onNavigateTo, visibleIf: 'return item.Status!="D"'
            }
        ];
    }

    getAllResourcesBasedOnRole = () => {
        this.appService.allResourcesMappedToRole().then(resp => {
            if (resp['success']) {
               const list = resp['response'];
                const dataSource = _.cloneDeep(this.options.dataSource) || {data: [], viewData: []};
                dataSource.data =  _.cloneDeep(list);
                dataSource.originalData = _.cloneDeep(list);
                const options = _.cloneDeep(this.options);
                options.dataSource = dataSource;
                this.options = options;
            } else {

            }
        }).catch((ex) => {
            console.log('Exception Caught due to error', ex);
        });

    }

    onNavigateTo = (param, item) => {
        if ( param === this.CRUD.DELETE) {
            this.deleteRoleResourceMap(item);
        } else {
            this.appRoutingService.navigateToURLParams('layout/adm-res-crud', {type: param, data: item});
        }
    }

    deleteRoleResourceMap = (item) => {
        const ID = item['RRID'] || null;
        item['userId'] = this.user.ID || '';
        this.appService.deleteRoleResouceMap(item).then(res => {
            console.log(res);
            if ( res['success'] ) {
                toastr.success( res['response'], null, {positionClass: 'toast-bottom-right'});
            } else {
                toastr.error( res['response'], null, {positionClass: 'toast-bottom-right'});
            }
            this.getAllResourcesBasedOnRole();
        }).catch(ex => {
            console.log(ex);
        });
    }

}
