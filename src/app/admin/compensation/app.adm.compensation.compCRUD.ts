import { Component, OnInit, OnChanges, SimpleChanges, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import { AppService } from '../../services/app.service';
import { AppUserAuthService } from '../../services/app.userAuth.service';
import { AppRoutingService } from '../../services/app.routing.service';
import { APP_CONSTANTS } from '../../services/app.constants';
import { AppLoaderService } from '../../services/app.loader.service';
import * as _ from 'lodash';
import { AppGridService } from '../../services/app.grid.service';
import { NgForm } from '@angular/forms';
declare const utils: any;
declare const toastr: any;
@Component({
    selector: 'app-adm-comp-crud',
    templateUrl: './app.adm.compensation.compCRUD.html',
    styleUrls: [ './app.adm.compensation.comp.scss']
})
export class AppAdminCompensationCRUDComponent implements OnInit, OnChanges {
    title = 'Compensation';
    subTitle = 'Create New Compensation';
    state = null;
    CRUD = APP_CONSTANTS.CRUD;
    RESPONSE_STATUS = APP_CONSTANTS.ALERT_TYPES;
    DATE_TYPES = APP_CONSTANTS.DATA_TYPES;
    user = null;
    operationType = APP_CONSTANTS.CRUD.NEW;
    associatesList = [];
    compensation = null;
    constructor(
        private appService: AppService,
        private appUserAuthService: AppUserAuthService,
        private appRoutingService: AppRoutingService,
        private appLoaderService: AppLoaderService,
        private appGridService: AppGridService
    ) {
        this.compensation = this.getCompensation();
    }
    ngOnInit() {
        const state = this.appRoutingService.getCurrentState();
        this.user = this.appUserAuthService.getUser();
        console.log(state);
        this.compensation = this.getCompensation();
        if (!utils.isEmpty(state)) {
            this.operationType = state.params && state.params.type || this.operationType;
            const data = state.params && state.params.data || null;
            this.state = state;
            if (this.operationType === this.CRUD.EDIT) {
                this.subTitle = 'Edit Compensation';
                this.getCompensationByID(data);
            } else if (this.operationType === this.CRUD.NEW) {
                this.subTitle = 'Create New Compensation';
            } else if (this.operationType === this.CRUD.VIEW) {
                this.subTitle = 'View Compensation Details';
                this.getCompensationByID(data);
            } else if (this.operationType === this.CRUD.DELETE) {
                // Need to develop
            } else {
                this.operationType = this.CRUD.NEW;
                this.subTitle = 'Create New Compensation';
            }
        }
    }

    ngOnChanges() {

    }

    getCompensation = () => {
        return {
            ID: '', associateName: '', percentage: '',
             userId: '', associateID: '', RecStatus: '',
             ModifiedBy: '', ModifiedDate: '', ModifiedName: '', mrktExp: '0.00'
        };
    }

    onAssociateNameChange = (associateName) => {
        this.associatesList = [];
        if (associateName && associateName.trim().length > 2 ) {
            const param = {'query': associateName.trim()};
            this.appLoaderService.setLoaderDisable(true);
            this.appService.associateSearchByName(param).then(resp => {
                this.associatesList = resp['response'];
                this.appLoaderService.setLoaderDisable(false);
            }).catch((ex) => {
                this.appLoaderService.setLoaderDisable(false);
                console.log(' Exception due to Search Association', ex);
            });
        }
    }

    selectAssociativeId = (assoc) => {
        this.compensation.associateName = assoc.FirstName + ' ' + assoc.LastName;
        this.compensation.associateID = assoc.ID;
        this.associatesList = [];
    }

    compenNewFormSubmit = (e: NgForm) => {
        if ( e.valid ) {
            const data = _.cloneDeep(this.compensation);
            this.compensation = this.getCompensation();
            data['userId'] = this.user.ID;
            this.appService.createCompensation(data).then((resp) => {
                console.log(resp);
                if ( resp['success'] ) {
                    toastr.success( resp['response'], null, {positionClass: 'toast-bottom-right'});
                } else {
                    toastr.error( resp['response'], null, {positionClass: 'toast-bottom-right'});
                }
                this.appRoutingService.navigateToURL( 'layout/adm-compen' );
            }).catch((ex) => {
                console.log('Exception Caught due to Create Assignment', ex);
            });
        }
    }

    compensationCancel = () => {
        this.appRoutingService.navigateToURL('layout/adm-compen');
    }

    getCompensationByID = (item) => {
        const ID = item['ID'];
        this.appService.getCompensationByID(ID).then((resp) => {
            if (resp['success']) {
                const compensation = resp['response'];
                this.compensation = {...this.compensation, ...compensation};
            } else {
                toastr.error( resp['response'], null, {positionClass: 'toast-bottom-right'});
            }
        }).then(ex => {

        });
    }

}
