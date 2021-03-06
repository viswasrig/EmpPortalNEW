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
    allAssociateRolesMap = [];
    roleMap = null;
    showAlert = false;
    alert = { title: null, msg: null }; 
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
        this.getAllAssociateRoleMaps();
        this.getAllAvailableRoles();
        this.roleMap = this.getRoleMap();
        if (!utils.isEmpty(state)) {
            this.operationType = state.params && state.params.type || this.operationType;
            const data = state.params && state.params.data || null;
            this.state = state;
            if (this.operationType === this.CRUD.EDIT) {
                this.subTitle = 'Edit Role & Associate Relation';
                this.getRoleMapByID(data);
            } else if (this.operationType === this.CRUD.NEW) {
                this.subTitle = 'Add Role & Associate Relation';
            } else if (this.operationType === this.CRUD.VIEW) {
                this.subTitle = 'View Role & Associate Relation';
                this.getViewRoleAndAssociateRecord(data);
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
             userId: '', associateID: '', RoleDesc: '', RID: ''
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

    getAllAssociateRoleMaps = () => {
        this.appService.getAllAssociatedRoles().then(res => {
            if ( res['success'] ) {
                this.allAssociateRolesMap = res['response'] || [];
            }
        }).catch( (ex) => {
            console.log(ex);
        });
    }

    roleAssociateMapSubmit = (e: NgForm) => {
        this.showAlert = false;
        this.alert = { title: '', msg: ''};
        if ( e.valid) {
            const flag = this.isAlreadyAssociated(this.roleMap);
            if ( flag) {
                this.showAlert = true;
                this.alert = { title: 'Info', msg: 'Already Role is mapped with ' + this.roleMap.associateName};
            } else {
                const data = _.cloneDeep(this.roleMap);
                this.roleMap = this.getRoleMap();
                data['userId'] = this.user.ID;
                this.appService.createRoleAssociateMap(data).then((resp) => {
                    console.log(resp);
                    if ( resp['success'] ) {
                        toastr.success( resp['response'], null, {positionClass: 'toast-bottom-right'});
                    } else {
                        toastr.error( resp['response'], null, {positionClass: 'toast-bottom-right'});
                    }
                    this.appRoutingService.navigateToURL( 'layout/adm-as-role' );
                }).catch((ex) => {
                    console.log('Exception Caught due to Create Assignment', ex);
                });
            }
        }
    }

    isAlreadyAssociated = (obj) => {
        let flag = false;
        for ( let i = 0; i < this.allAssociateRolesMap.length; i++ ) {
            if ( this.allAssociateRolesMap[i].AssociateID === obj.associateID ) {
                flag = true;
                break;
            }
        }
        return flag;
    }

    closeModel = () => {
        this.showAlert = false;
    }
    roleMapCancel = () => {
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
    }

    newRoleFormSubmit = (e) => {
        // console.log(e.value);
        if (e.valid) {
            const data = _.cloneDeep(this.roleMap);
            this.roleMap = this.getRoleMap();
           //  console.log(data);
            this.appService.addNewRole(data).then((res) => {
                if (res['success']) {
                    toastr.success(res['response'], null, {positionClass: 'toast-bottom-right'});
                    const {associateName, associateID, RoleName , RoleDesc} = data;
                    this.appService.getAllRoles().then((resp) => {
                        if ( resp['success'] ) {
                            let RoleID = '';
                            const list = resp['response'] || [];
                            for (let i = 0; i < list.length; i++) {
                                if (list[i].RoleName === RoleName && list[i].RoleDesc === RoleDesc) {
                                    RoleID = list[i]['ID'];
                                    break;
                                }
                            }
                            this.roleMap = {...this.roleMap, associateName, associateID, RoleID};
                            this.allAvailableRoles = list;
                        }
                    }).catch((ex) => {});
                } else {
                    toastr.error(res['response'], null, {positionClass: 'toast-bottom-right'});
                }
            }).catch((ex) => {
                console.log('Create a Role getting exception', ex);
            });
        }
    }

    getRoleMapByID = (item) => {
        const ID = item['RID'] || null;
        this.appService.getRoleAssociateMapByID(ID).then(res => {
            if ( res['success'] ) {
                this.roleMap = this.getRoleMap();
                this.roleMap = {...this.roleMap, ...res['response']};
            }
         }).catch((ex) => {
            console.log(ex);
        });
    }

    updateRoleAssociate = (e) => {
        // console.log(e.value);
        if ( e.valid ) {
            const data = _.cloneDeep(this.roleMap);
            this.roleMap = this.getRoleMap();
            data['userId'] = this.user.ID;
            this.appService.updateRoleAssociateMap(data).then((resp) => {
                console.log(resp);
                if ( resp['success'] ) {
                    toastr.success( resp['response'], null, {positionClass: 'toast-bottom-right'});
                } else {
                    toastr.error( resp['response'], null, {positionClass: 'toast-bottom-right'});
                }
                this.appRoutingService.navigateToURL( 'layout/adm-as-role' );
            }).catch((ex) => {
                console.log('Exception Caught due to Create Assignment', ex);
            });
        }
    }

    getViewRoleAndAssociateRecord = (item) => {
        this.appService.viewRoleAndAssociate(item).then(res => {
            if (res['success']) {
                const resRole = res['response'][0];
                this.roleMap = { ...this.roleMap, ...resRole };
            }
        }).catch((ex) => {console.log(ex); });
    }

}
