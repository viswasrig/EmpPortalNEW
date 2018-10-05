import { Component, OnInit, OnChanges, SimpleChanges, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { AppService } from '../services/app.service';
import { AppUserAuthService } from '../services/app.userAuth.service';
import { AppRoutingService } from '../services/app.routing.service';
import { APP_CONSTANTS } from '../services/app.constants';
// import { utils, toastr, appConfig} from '../external';
import * as _ from 'lodash';
declare const appConfig: any;
declare const toastr: any;

@Component({
    selector: 'app-client',
    templateUrl: './app.client.comp.html',
    styleUrls: ['./app.client.comp.scss']
  })
export class AppClientsComponent implements OnInit, OnChanges, AfterViewInit {
    title = 'Clients';
    clientList = [];
    CRUD = APP_CONSTANTS.CRUD;
    RESPONSE_STATUS = APP_CONSTANTS.ALERT_TYPES;

    constructor(
        private appService: AppService,
        private appUserAuthService: AppUserAuthService,
        private appRoutingService: AppRoutingService,
        ) {

    }

    ngOnInit() {
        this.getAllClients();
        appConfig.loadModules();
    }

    ngOnChanges( changes: SimpleChanges ) {
    }

    ngAfterViewInit() {
    }

    getAllClients = () => {
        this.appService.getAllClients().then( resp => {
            this.clientList = resp['response'];
        }).catch( (Ex) => {
            console.error('Exception caught on fetching All Clients', Ex);
        });
    }

    onNavigateTo = (type, item) => {
        if ( type === this.CRUD.DELETE) {
            this.deleteClient(item);
          } else {
            const params = { type: type, data: item};
            this.appRoutingService.navigateToURLParams('layout/clientCRUD', params);
          }
    }

    deleteClient = (item) => {
        this.appService.deleteClient(item.ID).then(resp => {
            console.log(resp);
            if ( resp['success'] ) {
              toastr.success(resp['response'], null, {positionClass: 'toast-bottom-right'});
             } else {
              toastr.success(resp['response'], null, {positionClass: 'toast-bottom-right'});
             }
            this.appRoutingService.reloadSamePage('layout/assoc');
          }).catch(ex => {
            console.log('Exception due to delete of Client', ex);
          });
    }

    getClientsSize() {
        return this.clientList.length;
     }

}
