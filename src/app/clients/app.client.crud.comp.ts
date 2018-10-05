import { Component, OnInit, OnChanges, SimpleChanges, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { NgForm } from '@angular/forms';
import { AppService } from '../services/app.service';
import { AppUserAuthService } from '../services/app.userAuth.service';
import { AppRoutingService } from '../services/app.routing.service';
import { APP_CONSTANTS } from '../services/app.constants';
import { AppLoaderService } from '../services/app.loader.service';
import * as _ from 'lodash';
declare const utils: any;
declare const toastr: any;
@Component({
    selector: 'app-client-curd',
    templateUrl: './app.client.crud.comp.html',
    styleUrls: ['./app.client.comp.scss']
  })
export class AppClientCRUDComponent implements OnInit, OnChanges, AfterViewInit {
    title = 'Clients';
    subTitle = 'Create New Client';
    client = null;
    operationType = APP_CONSTANTS.CRUD.NEW;
    CRUD = APP_CONSTANTS.CRUD;
    RESPONSE_STATUS = APP_CONSTANTS.ALERT_TYPES;
    user = null;
    state = null;
    constructor(
        private appService: AppService,
        private appUserAuthService: AppUserAuthService,
        private appRoutingService: AppRoutingService,
        private appLoaderService: AppLoaderService
        ) {

    }

    ngOnInit() {
        this.user = this.appUserAuthService.getUser();
        const state = this.appRoutingService.getCurrentState();
        this.client = this.getClientObject();
        if (!utils.isEmpty(state)) {
            this.operationType = state.params && state.params.type || this.operationType;
            const data = state.params && state.params.data || null;
            this.state = state;
            if (this.operationType === this.CRUD.EDIT) {
                this.subTitle = 'Edit Client';
                this.getClientById(data.ID);
            } else if (this.operationType === this.CRUD.NEW) {
                this.subTitle = 'Create New Client';
            } else if (this.operationType === this.CRUD.VIEW) {
                this.subTitle = 'View Client';
                this.getClientById(data.ID);
            } else if (this.operationType === this.CRUD.DELETE) {
                // Need to develop
            } else {
                this.operationType = this.CRUD.NEW;
                this.subTitle = 'Create New Client';
            }
        }
    }

    ngOnChanges( changes: SimpleChanges ) {
    }

    ngAfterViewInit() {
        return { };
    }

    getClientObject = () => {
        return {
            name: '', type: 'Vendor', lineOfBusiness: '', fein: '', fax: '', url: '', ID: ''
        };
    }

    clientCancel = () => {
        this.appRoutingService.navigateToURL('layout/clients');
    }

    getClientById = (id) => {
        this.appService.getClientByID(id).then(resp => {
            if ( resp['success'] ) {
                this.client = resp['response'];
            }
        }).catch(ex => {
            console.log('Exception caught by Creating Client', ex);
        });
    }

    clientNewFormSubmit = (e: NgForm) => {
       // console.log(e.value);
        if ( e.valid ) {
           const data = _.cloneDeep(this.client);
           this.client = this.getClientObject();
            this.appService.createClient(data).then(resp => {
                if ( resp['success'] ) {
                    toastr.success(resp['response'], null, {positionClass: 'toast-bottom-right'});
                } else {
                    toastr.success(resp['response'], null, {positionClass: 'toast-bottom-right'});
                }
                this.appRoutingService.reloadSamePage('layout/clients');
            }).catch(ex => {
                console.log('Exception caught by Creating Client', ex);
            });
        }
    }


    onAddConcat = () => {
        this.appRoutingService.navigateToURL('layout/contact');
    }

}
