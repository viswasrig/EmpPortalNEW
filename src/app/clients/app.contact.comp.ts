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
    selector: 'app-client-contact',
    templateUrl: './app.contact.comp.html',
    styleUrls: ['./app.contact.comp.scss']
  })
export class AppClientContactComponent implements OnInit, OnChanges, AfterViewInit {
    title = 'Client Contact';
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
    }

    ngOnChanges( changes: SimpleChanges ) {
    }

    ngAfterViewInit() {
    }
}
