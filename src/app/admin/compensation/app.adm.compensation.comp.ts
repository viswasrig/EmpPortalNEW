import { Component, OnInit, OnChanges, SimpleChanges, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import { AppService } from '../../services/app.service';
import { AppUserAuthService } from '../../services/app.userAuth.service';
import { AppRoutingService } from '../../services/app.routing.service';
import { APP_CONSTANTS } from '../../services/app.constants';
import { AppLoaderService } from '../../services/app.loader.service';
import * as _ from 'lodash';
import { AppGridService } from '../../services/app.grid.service';
declare const utils: any;
declare const toastr: any;
@Component({
    selector: 'app-adm-comp',
    templateUrl: './app.adm.compensation.comp.html',
    styleUrls: [ './app.adm.compensation.comp.scss']
})
export class AppAdminCompensationComponent implements OnInit, OnChanges {
    title = 'Compensation';
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
        this.getAllCompensations();
    }

    ngOnChanges() {

    }

    buildColumns = () => {
        const column1 = this.appGridService.getColumn(0, 'S.No', 'ID', this.DATE_TYPES.NUMBER, true, true, '5%');
        const column2 = this.appGridService.getColumn(1, 'Associate Name', 'FullName', this.DATE_TYPES.STRING, true, true, '15%');
        const column3 = this.appGridService.getColumn(2, 'Percentage', 'Prctg', this.DATE_TYPES.STRING, true, true, '10%');
        const column4 = this.appGridService.getColumn(3, 'Mrkt Exp', 'mrktExp', this.DATE_TYPES.STRING, true, true, '5%');
        const column5 = this.appGridService.getColumn(4, 'Modified Date', 'ModifiedDate', this.DATE_TYPES.STRING, false, false, '7%');
        const column6 = this.appGridService.getColumn(5, 'Modified By', 'ModifiedBy', this.DATE_TYPES.STRING, false, false, '7%');
        const column7 = this.appGridService.getColumn(6, 'Action', 'action', this.DATE_TYPES.ACTION_BUTTONS, false, false, '10%');
        column7['buttons'] = this.getDefaultActionButtons();
        const columns = [column1, column2, column3, column4, column5, column6, column7];
        return columns;
    }

    getDefaultActionButtons = () => {
        return [
            {
                buttonType: 'LINK', title: 'View Compensation', actionType: this.CRUD.VIEW,
                pClass: 'px-1', buttonClassName: 'fa fa-eye', onClick: this.onNavigateTo
            },
            {
                buttonType: 'LINK', title: 'Edit Compensation', actionType: this.CRUD.EDIT, pClass: 'px-2',
                buttonClassName: 'fa fa-pencil', onClick: this.onNavigateTo
            },
            {
                buttonType: 'LINK', title: 'Close Compensation', actionType: this.CRUD.CLOSE,
                pClass: 'px-2', buttonClassName: 'fa fa-times-circle', onClick: this.onNavigateTo
            },
            {
                buttonType: 'LINK', title: 'Delete Compensation', actionType: this.CRUD.DELETE,
                pClass: 'px-1', buttonClassName: 'fa fa-trash', onClick: this.onNavigateTo
            }
        ];
    }

    getAllCompensations = () => {
        this.appService.getAllCompensationsByRecStatus('AU').then(resp => {
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
        if (param === this.CRUD.CLOSE) {
            this.closeCompensation(item);
        } else if ( param === this.CRUD.DELETE ) {
            this.deleteCompensation(item);
        } else {
            const params = { type: param, data: item};
            this.appRoutingService.navigateToURLParams('layout/adm-compCRUD', params);
        }

    }

    closeCompensation = (item) => {
        item['userId'] = this.user['ID'];
        // console.log(item);
        this.appService.closeCompensation(item).then((resp) => {
            if (resp['success']) {
                toastr.success(resp['response'], null, { positionClass: 'toast-bottom-right' });
            } else {
                toastr.error(resp['response'], null, { positionClass: 'toast-bottom-right' });
            }
        this.getAllCompensations();
        }).catch((ex) => {console.log(ex); });
    }

    deleteCompensation = (item) => {
        item['userId'] = this.user['ID'];
        // console.log(item);
        this.appService.deleteCompensation(item).then((resp) => {
            if (resp['success']) {
                toastr.success(resp['response'], null, { positionClass: 'toast-bottom-right' });
            } else {
                toastr.error(resp['response'], null, { positionClass: 'toast-bottom-right' });
            }
        this.getAllCompensations();
        }).catch((ex) => {console.log(ex); });
    }
}
