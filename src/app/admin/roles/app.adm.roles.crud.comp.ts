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
    templateUrl: './app.adm.roles.crud.comp.html',
    styleUrls: [ './app.adm.roles.comp.scss']
})
export class AppRoleAssociateCRUDComponent implements OnInit, OnChanges {
    title = 'Role and Associate';
    subTitle = 'Add Role & Associate Relation';
    state = null;
    CRUD = APP_CONSTANTS.CRUD;
    RESPONSE_STATUS = APP_CONSTANTS.ALERT_TYPES;
    DATE_TYPES = APP_CONSTANTS.DATA_TYPES;
    user = null;
    operationType = APP_CONSTANTS.CRUD.NEW;
    associatesList = [];
    compensation = null;
    allAvailableRoles = [];
    roleMap = null;
    constructor(
        private appService: AppService,
        private appUserAuthService: AppUserAuthService,
        private appRoutingService: AppRoutingService,
        private appLoaderService: AppLoaderService,
        private appGridService: AppGridService
    ) {
        this.roleMap = this.getRoleMap();
    }
    ngOnInit() {
        const state = this.appRoutingService.getCurrentState();
        this.user = this.appUserAuthService.getUser();
        console.log(state);
        this.getAllAvailableRoles();
        this.roleMap = this.getRoleMap();
        if (!utils.isEmpty(state)) {
            this.operationType = state.params && state.params.type || this.operationType;
            const data = state.params && state.params.data || null;
            this.state = state;
            if (this.operationType === this.CRUD.EDIT) {
                this.subTitle = 'Edit Role & Associate Relation';
                // this.getCompensationByID(data);
            } else if (this.operationType === this.CRUD.NEW) {
                this.subTitle = 'Add Role & Associate Relation';
            } else if (this.operationType === this.CRUD.VIEW) {
                this.subTitle = 'View Role & Associate Relation';
                // this.getCompensationByID(data);
            } else if (this.operationType === this.CRUD.DELETE) {
                // Need to develop
            } else {
                this.operationType = this.CRUD.NEW;
                this.subTitle = 'Add Role & Associate Relation';
            }
        }
    }

    ngOnChanges() {

    }

    getRoleMap = () => {
        return {
            ID: '', associateName: '', RoleName: '', RoleID: '',
             userId: '', associateID: '', RoleDesc: ''
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
        this.roleMap.associateName = assoc.FirstName + ' ' + assoc.LastName;
        this.roleMap.associateID = assoc.ID;
        this.associatesList = [];
    }

    compenNewFormSubmit = (e: NgForm) => {
        if ( e.valid ) {
            const data = _.cloneDeep(this.roleMap);
            this.roleMap = this.getRoleMap();
            data['userId'] = this.user.ID;
            this.appService.createRoleMap(data).then((resp) => {
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
        this.appRoutingService.navigateToURL('layout/adm-as-role');
    }

    getAllAvailableRoles = () => {
        this.appService.getAllRoles().then((res) => {
            if ( res['success'] ) {
                this.allAvailableRoles = res['response'] || [];
            }
        }).catch((ex) => {
            console.log('Fetching All Roles ', ex);
        });
    }

    onRoleIDChange = (e) => {
        if ( e === 'NEW') {

        }
    }

}
