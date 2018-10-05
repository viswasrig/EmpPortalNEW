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
    templateUrl: './app.adm.income.assign.comp.html',
    styleUrls: [ './app.adm.income.assign.comp.scss']
})
export class AppAdminIncomeAssignmentComponent implements OnInit, OnChanges {
    title = 'Income Assignment';
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
        this.getAllPaidInvoices();
    }
    ngOnChanges() {

    }

    buildColumns = () => {
        const column1 = this.appGridService.getColumn(0, 'Invoice ID', 'ID', this.DATE_TYPES.NUMBER, true, true, '5%');
        const column2 = this.appGridService.getColumn(1, 'Associate Name', 'FullName', this.DATE_TYPES.STRING, true, true, '15%');
        const column3 = this.appGridService.getColumn(2, 'Client Name', 'ClientName', this.DATE_TYPES.STRING, true, true, '15%');
        const column4 = this.appGridService.getColumn(3, 'Amount', 'ReceivedAmount', this.DATE_TYPES.STRING, false, false, '7%');
        const column5 = this.appGridService.getColumn(4, 'Action', 'action', this.DATE_TYPES.ACTION_BUTTONS, false, false, '10%');
        column5['buttons'] = this.getDefaultActionButtons();
        const columns = [column1, column2, column3, column4, column5];
        return columns;
    }

    getDefaultActionButtons = () => {
        return [
            {
                buttonType: 'LINK', title: 'Assign Income', actionType: this.CRUD.ASSIGN,
                pClass: 'px-1', buttonClassName: 'fa fa-arrow-right', onClick: this.onNavigateTo
            }
        ];
    }

    getAllPaidInvoices = () => {
        this.appService.getAllPaidInvoices().then(resp => {
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
        // console.log(item);
        this.appService.assignIncome(item).then(resp => {
            if (resp['success']) {
                toastr.success( resp['response'], null, {positionClass: 'toast-bottom-right'});
            } else {
                alert(resp['response']);
            }
        }).catch(ex => {
            console.log('Exception Caught due to Error', ex);
        });
    }

}
