import { Component, OnInit, OnChanges, SimpleChanges, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from '../services/app.service';
import { AppUserAuthService } from '../services/app.userAuth.service';
import { AppRoutingService } from '../services/app.routing.service';
import { AppGridService } from '../services/app.grid.service';
import { APP_CONSTANTS } from '../services/app.constants';
import * as _ from 'lodash';
declare const utils: any;
declare const toastr: any;
@Component({
    selector: 'app-assign',
    templateUrl: './app.assign.comp.html',
    styleUrls: ['./app.assign.comp.scss']
})
export class AppAssignmentComponent implements OnInit, OnChanges, AfterViewInit {

    title = 'Assignments';
    CRUD = APP_CONSTANTS.CRUD;
    RESPONSE_STATUS = APP_CONSTANTS.ALERT_TYPES;
    statusMsg = { msg: '', type: '', isEnabled: false };
    allAssignments = [];
    options = null;
    DATE_TYPES = APP_CONSTANTS.DATA_TYPES;
    dateOptions = {default: new Date(), format: 'MM/DD/YYYY'};
    constructor(
        private appGridService: AppGridService,
        private appService: AppService,
        private appUserAuthService: AppUserAuthService,
        private appRoutingService: AppRoutingService,
        private cd: ChangeDetectorRef
    ) { }
    ngOnInit() {
        const state = this.appRoutingService.getCurrentState();
        const options = this.appGridService.getTableOptions();
        options.pager = true;
        options.pagination.pageSize = 50;
        options.columns = this.buildColumns();
        this.options = options;
        if (!utils.isEmpty(state)) {
            const params = state.params || null;
            console.log(params);
            if (!utils.isEmpty(params)) {
                this.statusMsg.msg = params.msg;
                this.statusMsg.type = params.type;
                this.statusMsg.isEnabled = true;
                this.appRoutingService.removeParams('layout/assoc');
            }
        }
        this.getAllAssignments();
    }
    ngOnChanges(changes: SimpleChanges) {
        this.cd.detectChanges();
    }

    ngAfterViewInit() {
        this.cd.detectChanges();
    }

    buildColumns = () => {
        const column1 = this.appGridService.getColumn(0, 'S.No', 'ID', this.DATE_TYPES.NUMBER, true, true, '5%');
        const column2 = this.appGridService.getColumn(1, 'Associate Name', 'fullName', this.DATE_TYPES.STRING, true, true, '15%');
        const column3 = this.appGridService.getColumn(2, 'Client Name', 'clientName', this.DATE_TYPES.STRING, true, true, '15%');
        const column4 = this.appGridService.getColumn(3, 'Rate', 'rate', this.DATE_TYPES.STRING, false, false, '7%');
        const column5 = this.appGridService.getColumn(4, 'Unit', 'unit', this.DATE_TYPES.STRING, false, false, '7%');
        const column6 = this.appGridService.getColumn(5, 'Invoice Term', 'invoiceTerm', this.DATE_TYPES.STRING, true, true, '8%');
        const column7 = this.appGridService.getColumn(6, 'Payment Term', 'paymentTerm', this.DATE_TYPES.STRING, true, true, '8%');
        const column8 = this.appGridService.getColumn(7, 'Created Date', 'assignmentDt', this.DATE_TYPES.DATE, false, false, '10%');
        const column9 = this.appGridService.getColumn(8, 'Assignment Start Date', 'assignStartDate', 
        this.DATE_TYPES.DATE, false, false, '10%');
        const column10 = this.appGridService.getColumn(9, 'Action', 'action', this.DATE_TYPES.ACTION_BUTTONS, false, false, '10%');
        column10['buttons'] = this.getDefaultActionButtons();
        const columns = [column1, column2, column3, column4, column5, column6, column7, column8, column9, column10];
        return columns;
    }

    getDefaultActionButtons = () => {
        return [
            {
                buttonType: 'LINK', title: 'View Assignment', actionType: 'VIEW',
                pClass: 'px-1', buttonClassName: 'fa fa-eye', onClick: this.onNavigateTo
            },
            {
                buttonType: 'LINK', title: 'Edit Assignment', actionType: 'EDIT', pClass: 'px-2',
                buttonClassName: 'fa fa-pencil', onClick: this.onNavigateTo
            },
            {
                buttonType: 'LINK', title: 'Delete Assignment', actionType: 'DELETE',
                pClass: 'px-1', buttonClassName: 'fa fa-trash', onClick: this.onNavigateTo
            }
        ];
    }

    getAllAssignments = () => {
        this.appService.getAllAssignments().then(resp => {
            if (resp['success']) {
                this.allAssignments = resp['response'];
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
        if (param === this.CRUD.DELETE) {
            this.deleteAssignment(item);
        } else {
            const params = { type: param, data: item };
            this.appRoutingService.navigateToURLParams('layout/assignCRUD', params);
        }
    }

    deleteAssignment = (item) => {
        // console.log(item);
        this.appService.deleteAssignment(item.ID).then(resp => {
            console.log(resp);
            if (resp['success']) {
                toastr.success(resp['response'], null, { positionClass: 'toast-bottom-right' });
            } else {
                toastr.error(resp['response'], null, { positionClass: 'toast-bottom-right' });
            }
            this.appRoutingService.reloadSamePage('layout/assign');
        }).catch(ex => {
            console.log('Exception due to delete of invoice', ex);
        });
    }

    onClose = (e) => {
        this.statusMsg.isEnabled = false;
        this.statusMsg = this.getStautsMsgObject();
    }

    getStautsMsgObject = () => {
        return { msg: '', type: '', isEnabled: false };
    }

    sizeOfAllAssignments = () => {
        return this.allAssignments.length;
    }
}
