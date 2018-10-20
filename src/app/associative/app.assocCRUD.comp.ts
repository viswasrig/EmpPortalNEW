import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from '../services/app.service';
import { AppUserAuthService } from '../services/app.userAuth.service';
import { AppRoutingService } from '../services/app.routing.service';
import { APP_CONSTANTS } from '../services/app.constants';
import {AppLoaderService} from '../services/app.loader.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { NgForm} from '@angular/forms';
declare const utils: any;
declare const toastr: any;

@Component({
    selector: 'app-assoc',
    templateUrl: './app.assocCRUD.comp.html',
    styleUrls: ['./app.assoc.comp.scss']
})
export class AppAssociativeCRUDComponent implements OnInit, OnChanges {
    title = 'Associates';
    subTitle = 'Create New Associate';
    assoc = null;
    operationType = APP_CONSTANTS.CRUD.NEW;
    CRUD = APP_CONSTANTS.CRUD;
    RESPONSE_STATUS  = APP_CONSTANTS.ALERT_TYPES;
    user = null;
    state = null;
    dateOptions = {default: new Date(), format: 'MM/DD/YYYY'};
    constructor(private appService: AppService,
        private appRoutingService: AppRoutingService,
        private appUserAuthService: AppUserAuthService,
        private appLoaderService: AppLoaderService
    ) {
        this.assoc = this.getAssociativeObject();
    }

    ngOnInit(): void {
        this.user = this.appUserAuthService.getUser();
        const state = this.appRoutingService.getCurrentState();
        if (!utils.isEmpty(state)) {
            this.operationType = state.params && state.params.type || this.operationType;
            const data = state.params && state.params.data || null;
            this.state = state;
            if (this.operationType === this.CRUD.EDIT) {
                this.subTitle = 'Edit Associate';
                this.getAssociateById(data.ID);
                this.dateOptions.default = null;
            } else if (this.operationType === this.CRUD.NEW) {
                this.subTitle = 'Create New Associate';
            } else if (this.operationType === this.CRUD.VIEW) {
                this.subTitle = 'View Associate';
            } else if (this.operationType === this.CRUD.DELETE) {
                // Need to develop
            } else {
                this.operationType = this.CRUD.NEW;
                this.subTitle = 'Create New Associate';
            }

        }
    }

    ngOnChanges(changes: SimpleChanges) {

    }

    getAssociativeObject = () => {
        return {
            firstName: '', middleName: '', lastName: '', ssn: '', dateOfJoining: '', dateOfBirth: '',
            employerName: '', userID: '', password: '', associateType: '', dateOfLeaving: ''
        };
    }

    associateCancel = () => {
        this.appRoutingService.navigateToURL('layout/assoc');
    }

    assocNewFormSubmit = (e: NgForm) => {
        console.log(e.value);
        if ( e.valid ) {
            const data = _.cloneDeep( this.assoc );
            this.assoc = this.getAssociativeObject();
            this.appService.createNewAssociate(data).then(resp => {
                console.log(resp);
                if ( resp['success'] ) {
                    toastr.success(resp['response'], null, {positionClass: 'toast-bottom-right'});
                    /* this.appRoutingService.navigateToURLParams('layout/assoc',
                     {type: this.RESPONSE_STATUS.SUCCESS , msg: resp['response']}); */
                } else {
                    toastr.error(resp['response'], null, {positionClass: 'toast-bottom-right'});
                    /* this.appRoutingService.navigateToURLParams('layout/assoc',
                    {type: this.RESPONSE_STATUS.ERROR, msg: resp['response']}); */
                }
                this.appRoutingService.navigateToURL('layout/assoc');
            }).catch((ex) => {
                console.log('Exception caught due to adding of assoc', ex);
            });
        }
    }

    getAssociateById = (Id) => {
        this.appService.getAssociateById(Id).then( (resp) => {
            // console.log(resp);
            if ( resp['success'] ) {
               const data = resp['response'];
               this.assoc = this.getAssociativeObject();
               this.assoc = { ...this.assoc, ...data};
               console.log(this.assoc);
            } else {
                this.appRoutingService.navigateToURLParams('layout/assoc', {type: this.RESPONSE_STATUS.ERROR, msg: resp['response']});
            }
        }).catch(ex => {
            console.log(' Exception Caught by getting Associate ', ex);
        });
    }

    assocEditFormSubmit = ( e: NgForm ) => {
        console.log( e.value );
        if (e.valid) {
            const data = _.cloneDeep( this.assoc );
            this.assoc = this.getAssociativeObject();
            this.appService.updateAssocById(data).then(resp => {
                if ( resp['success'] ) {
                    toastr.success(resp['response'], null, {positionClass: 'toast-bottom-right'});
                } else {
                    toastr.error(resp['response'], null, {positionClass: 'toast-bottom-right'});
                }
                this.appRoutingService.navigateToURL('layout/assoc');
            }).catch((ex) => {
                console.log('Exception caught due to adding of assoc', ex);
            });
        }
    }


}

