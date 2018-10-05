import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from '../services/app.service';
import { AppUserAuthService } from '../services/app.userAuth.service';
import { AppRoutingService } from '../services/app.routing.service';
import { APP_CONSTANTS } from '../services/app.constants';
import { AppLoaderService } from '../services/app.loader.service';
import * as _ from 'lodash';
import { NgForm } from '@angular/forms';
declare const utils: any;
declare const toastr: any;
@Component({
    selector: 'app-assoc',
    templateUrl: './app.assign.CRUD.comp.html',
    styleUrls: ['./app.assign.comp.scss']
})
export class AppAssignmentCRUDComponent implements OnInit, OnChanges {
    title = 'Assignments';
    subTitle = 'Create New Assignment';
    assignment = null;
    associatesList = [];
    clientsList = [];
    operationType = APP_CONSTANTS.CRUD.NEW;
    CRUD = APP_CONSTANTS.CRUD;
    RESPONSE_STATUS = APP_CONSTANTS.ALERT_TYPES;
    user = null;
    state = null;
    constructor(private appService: AppService,
        private appUserAuthService: AppUserAuthService,
        private appRoutingService: AppRoutingService,
        private appLoaderService: AppLoaderService
    ) { }

    ngOnInit() {
        this.user = this.appUserAuthService.getUser();
        const state = this.appRoutingService.getCurrentState();
        this.assignment = this.getAssignmentObject();
        if (!utils.isEmpty(state)) {
            this.operationType = state.params && state.params.type || this.operationType;
            const data = state.params && state.params.data || null;
            this.state = state;
            if (this.operationType === this.CRUD.EDIT) {
                this.subTitle = 'Edit Assignment';
                this.getAssignmentById(data.ID);
            } else if (this.operationType === this.CRUD.NEW) {
                this.subTitle = 'Create New Assignment';
            } else if (this.operationType === this.CRUD.VIEW) {
                this.subTitle = 'View Assignment';
            } else if (this.operationType === this.CRUD.DELETE) {
                // Need to develop
            } else {
                this.operationType = this.CRUD.NEW;
                this.subTitle = 'Create New Assignment';
            }

            // this.getAllAssignments();
        }
    }

    ngOnChanges(changes: SimpleChanges) {

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
        this.assignment.associateName = assoc.FirstName + ' ' + assoc.LastName;
        this.assignment.associateID = assoc.ID;
        this.associatesList = [];
    }

    onClientNameChange = (clientName) => {
        this.clientsList = [];
        if (clientName && clientName.trim().length > 2 ) {
            const param = {'query': clientName.trim()};
            this.appLoaderService.setLoaderDisable(true);
            this.appService.searchClientsByName(param).then(resp => {
                this.clientsList = resp['response'];
                this.appLoaderService.setLoaderDisable(false);
            }).catch((ex) => {
                this.appLoaderService.setLoaderDisable(false);
                console.log(' Exception due to Search Association', ex);
            });
        }
    }

    selectClient = (client) => {
        this.assignment.clientName = client.Name;
        this.assignment.clientID = client.ID;
        this.clientsList = [];
    }

    getAssignmentById = (id) => {
        this.appService.getAssignmentByID(id).then(resp => {
            if ( resp['success'] ) {
               this.assignment = resp['response'];
            } else {
                toastr.error(resp['response'], 'ERROR', {positionClass: 'toast-bottom-right'});
            }
         }).catch(ex => {
            console.log('Exception caught by get Assignment', ex);
        });
    }

    getAssignmentObject = () => {
        return { ID: '', startDate: '', associateName: '', clientName: '', technology: '',
        rate: '', unit: 'Hour', invoiceTerm: 'Monthly', paymentTerm: 'Net 30',
        endClientName: '', associateID: '', clientID: ''};
    }

    assignmentCancel = () => {
        this.appRoutingService.navigateToURL('layout/assign');
    }

    assignmentNewFormSubmit = (e: NgForm) => {
        // console.log(e.value);
        if ( e.valid ) {
            const data = _.cloneDeep(this.assignment);
            this.assignment = this.getAssignmentObject();
            this.appService.createAssignment(data).then((resp) => {
                // console.log(resp);
                if ( resp['success'] ) {
                    toastr.success( resp['response'], null, {positionClass: 'toast-bottom-right'});
                } else {
                    toastr.error( resp['response'], null, {positionClass: 'toast-bottom-right'});
                }
                this.appRoutingService.navigateToURL( 'layout/assign' );
            }).catch((ex) => {
                console.log('Exception Caught due to Create Assignment', ex);
            });
        }
    }

    assignmentEditFormSubmit = (e: NgForm) => {
        // console.log(e.value);
        if ( e.valid ) {
            const data = _.cloneDeep(this.assignment);
            this.assignment = this.getAssignmentObject();
            this.appService.updateAssignment(data).then( resp => {
                if ( resp['success'] ) {
                    toastr.success( resp['response'], null, {positionClass: 'toast-bottom-right'});
                } else {
                    toastr.error( resp['response'], null, {positionClass: 'toast-bottom-right'});
                }
                this.appRoutingService.navigateToURL( 'layout/assign' );
            }).catch(ex => {
                console.log( 'Exception caught update of Assignment', ex);
            });
        }
    }

}

