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
    selector: 'app-adm-inc-assign',
    templateUrl: './app.adm.roles.comp.html',
    styleUrls: [ './app.adm.roles.comp.scss']
})
export class AppRoleAllotmentComponent implements OnInit, OnChanges {
    title = 'Roles';
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
        options.pagination.pageSize = 50;
        options.columns = this.buildColumns();
        this.options = options;
        this.user = this.appUserAuthService.getUser();
        this.getAllAssociatedRoles();
    }
    ngOnChanges() {

    }

    buildColumns = () => {
        const column1 = this.appGridService.getColumn(0, 'Role ID', 'ID', this.DATE_TYPES.NUMBER, true, true, '10%');
        const column2 = this.appGridService.getColumn(1, 'Role Name', 'RoleDesc', this.DATE_TYPES.STRING, true, true, '15%');
        const column3 = this.appGridService.getColumn(2, 'Associate Name', 'FullName', this.DATE_TYPES.STRING, true, true, '15%');
        const column4 = this.appGridService.getColumn(3, 'Role Status', 'RoleAssociatedStatus', this.DATE_TYPES.STRING, false, false, '7%');
        const column5 = this.appGridService.getColumn(4, 'Action', 'action', this.DATE_TYPES.ACTION_BUTTONS, false, false, '10%');
        column5['buttons'] = this.getDefaultActionButtons();
        const columns = [column1, column2, column3, column4, column5];
        return columns;
    }

    getDefaultActionButtons = () => {
        return [
            {
                buttonType: 'LINK', title: 'View Role', actionType: this.CRUD.VIEW,
                pClass: 'px-1', buttonClassName: 'fa fa-eye', onClick: this.onNavigateTo
            },
            {
                buttonType: 'LINK', title: 'Edit Role', actionType: this.CRUD.EDIT, pClass: 'px-2',
                buttonClassName: 'fa fa-pencil', onClick: this.onNavigateTo
            },
            {
                buttonType: 'LINK', title: 'Delete Role', actionType: this.CRUD.DELETE,
                pClass: 'px-1', buttonClassName: 'fa fa-trash', onClick: this.onNavigateTo
            }
        ];
    }

    getAllAssociatedRoles = () => {
        this.appService.getAllAssociatedRoles().then(resp => {
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
        this.appRoutingService.navigateToURLParams('layout/adm-as-role-crud', {type: param, data: item});
    }

}
