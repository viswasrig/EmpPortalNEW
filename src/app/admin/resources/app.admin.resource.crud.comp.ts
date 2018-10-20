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
    selector: 'app-adm-res-crud',
    templateUrl: './app.admin.resource.crud.comp.html',
    styleUrls: [ './app.admin.resource.comp.scss']
})
export class AppRoleResourceCRUDComponent implements OnInit, OnChanges {
    title = 'Role & Resource';
    subTitle = 'Add Role & Resource Relation';
    state = null;
    CRUD = APP_CONSTANTS.CRUD;
    RESPONSE_STATUS = APP_CONSTANTS.ALERT_TYPES;
    DATE_TYPES = APP_CONSTANTS.DATA_TYPES;
    user = null;
    operationType = APP_CONSTANTS.CRUD.NEW;
    associatesList = [];
    allAvailableRoles = [];
    allAvailableResources = [];
    allRolesResourcesMap = [];
    roleResourceMap = null;
    showAlert = false;
    alert = { title: null, msg: null };
    constructor(
        private appService: AppService,
        private appUserAuthService: AppUserAuthService,
        private appRoutingService: AppRoutingService,
        private appLoaderService: AppLoaderService,
        private appGridService: AppGridService
    ) {
        this.roleResourceMap = this.getRoleResourceMap();
    }
    ngOnInit() {
        const state = this.appRoutingService.getCurrentState();
        this.user = this.appUserAuthService.getUser();
        console.log(state);
        this.getAllAvailableRoles();
        this.getAllRoleResopurceMap();
        this.getAllAvailableResources();
        this.roleResourceMap = this.getRoleResourceMap();
        if (!utils.isEmpty(state)) {
            this.operationType = state.params && state.params.type || this.operationType;
            const data = state.params && state.params.data || null;
            this.state = state;
            if (this.operationType === this.CRUD.EDIT) {
                this.subTitle = 'Edit Role & Resource Relation';
                this.getRoleResourceMapByID(data);
            } else if (this.operationType === this.CRUD.NEW) {
                this.subTitle = 'Add Role & Resource Relation';
            } else if (this.operationType === this.CRUD.VIEW) {
                this.subTitle = 'View Role & Resource Relation';
                this.getViewRoleAndResourceRecord(data);
            } else if (this.operationType === this.CRUD.DELETE) {
                // Need to develop
            } else {
                this.operationType = this.CRUD.NEW;
                this.subTitle = 'Add Role & Resource Relation';
            }
        }
    }

    ngOnChanges() {

    }

    getRoleResourceMap = () => {
        return {
            ID: '', associateName: '', RoleName: '', RoleID: '',
             userId: '', associateID: '', RoleDesc: '', RRID: '',
             ResourceID: '', ResourceName: '', ResourceDesc: ''
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
        this.roleResourceMap.associateName = assoc.FirstName + ' ' + assoc.LastName;
        this.roleResourceMap.associateID = assoc.ID;
        this.associatesList = [];
    }

    getAllRoleResopurceMap = () => {
        this.appService.allResourcesMappedToRole().then(res => {
            if ( res['success'] ) {
                this.allRolesResourcesMap = res['response'] || [];
            }
        }).catch( (ex) => {
            console.log(ex);
        });
    }

    roleResourceMapSubmit = (e: NgForm) => {
        this.showAlert = false;
        this.alert = { title: '', msg: ''};
        if ( e.valid) {
            const flag = this.isRoleResourceMapped(this.roleResourceMap);
            if ( flag) {
                this.showAlert = true;
                this.alert = { title: 'Info', msg: 'Already Resource is mapped with ' + this.roleResourceMap.RoleName};
            } else {
                const data = _.cloneDeep(this.roleResourceMap);
                this.roleResourceMap = this.getRoleResourceMap();
                data['userId'] = this.user.ID;
                this.appService.newRoleResourceAdd(data).then((resp) => {
                    // console.log(resp);
                    if ( resp['success'] ) {
                        toastr.success( resp['response'], null, {positionClass: 'toast-bottom-right'});
                    } else {
                        toastr.error( resp['response'], null, {positionClass: 'toast-bottom-right'});
                    }
                    this.appRoutingService.navigateToURL( 'layout/adm-role-res' );
                }).catch((ex) => {
                    console.log('Exception Caught due to Create Assignment', ex);
                });
            }
        }
    }

    isRoleResourceMapped = (obj) => {
        let flag = false;
        for ( let i = 0; i < this.allRolesResourcesMap.length; i++ ) {
            if ( this.allRolesResourcesMap[i].RoleID === obj.RoleID  && this.allRolesResourcesMap[i].ResourceID === obj.ResourceID) {
                flag = true;
                break;
            }
        }
        return flag;
    }

    closeModel = () => {
        this.showAlert = false;
    }

    resourceMapCancel = () => {
        this.appRoutingService.navigateToURL('layout/adm-role-res');
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

    getAllAvailableResources = () => {
        this.appService.getAllResources().then((res) => {
            if ( res['success'] ) {
                this.allAvailableResources = res['response'] || [];
            }
        }).catch((ex) => {
            console.log('Fetching All Roles ', ex);
        });
    }

    onResourceChange = (e) => {
    }

    onRoleChange = () => {
        for ( let i = 0; i < this.allAvailableRoles.length; i++) {
            if ( this.allAvailableRoles[i].ID ===  this.roleResourceMap.RoleID ) {
                this.roleResourceMap.RoleName = this.allAvailableRoles[i].RoleName;
                break;
            }
        }
    }
    newResourceFormSubmit = (e) => {
        // console.log(e.value);
        if (e.valid) {
            const data = _.cloneDeep(this.roleResourceMap);
            this.roleResourceMap = this.getRoleResourceMap();
           //  console.log(data);
            this.appService.newResourceAdd(data).then((res) => {
                if (res['success']) {
                    toastr.success(res['response'], null, {positionClass: 'toast-bottom-right'});
                    const {RoleID, ResourceName , ResourceDesc} = data;
                    this.appService.getAllResources().then((resp) => {
                        if ( resp['success'] ) {
                            let ResourceID = '';
                            const list = resp['response'] || [];
                            for (let i = 0; i < list.length; i++) {
                                if (list[i].ResourceName === ResourceName && list[i].ResorceDesc === ResourceDesc) {
                                    ResourceID = list[i]['ID'] + '';
                                    break;
                                }
                            }
                            this.roleResourceMap = {...this.roleResourceMap, ResourceName, ResourceID, RoleID};
                            this.allAvailableResources = list;
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

    getRoleResourceMapByID = (item) => {
        const ID = item['RRID'] || null;
        this.appService.getRoleResouceMapByID(ID).then(res => {
            if ( res['success'] ) {
                this.roleResourceMap = this.getRoleResourceMap();
                this.roleResourceMap = {...this.roleResourceMap, ...res['response']};
            }
         }).catch((ex) => {
            console.log(ex);
        });
    }

    updateRoleResource = (e) => {
        // console.log(e.value);
        this.showAlert = false;
        this.alert = null;
        if ( e.valid ) {
            const flag = this.isRoleResourceMapped(this.roleResourceMap);
            if ( flag) {
                this.showAlert = true;
                this.alert = { title: 'Info', msg: 'Already Resource is mapped with ' + this.roleResourceMap.RoleName};
            } else {
            const data = _.cloneDeep(this.roleResourceMap);
            this.roleResourceMap = this.getRoleResourceMap();
            data['userId'] = this.user.ID;
            this.appService.updateRoleResouceMap(data).then((resp) => {
            // console.log(resp);
                if ( resp['success'] ) {
                    toastr.success( resp['response'], null, {positionClass: 'toast-bottom-right'});
                } else {
                    toastr.error( resp['response'], null, {positionClass: 'toast-bottom-right'});
                }
                this.appRoutingService.navigateToURL( 'layout/adm-role-res' );
            }).catch((ex) => {
                console.log('Exception Caught due to Create Assignment', ex);
            });
        }
     }
    }

    getViewRoleAndResourceRecord = (item) => {
        this.appService.viewRoleAndResource(item).then(res => {
            if (res['success']) {
                const resRole = res['response'][0];
                this.roleResourceMap = { ...this.roleResourceMap, ...resRole };
            }
        }).catch((ex) => {console.log(ex); });
    }

}
