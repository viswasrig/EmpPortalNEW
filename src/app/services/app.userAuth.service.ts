import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable, pipe } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import {APP_CONSTANTS} from './app.constants';

declare const utils: any;
const BASE_URL = 'http://www.e3globalinc.com/EmpPortalNew/'; //'http://localhost:80/';
@Injectable()
export class AppUserAuthService {
    options = null;
    private user = null;
    ROLE_TYPES = APP_CONSTANTS.ROLE_TYPES;
  RESOURCES = APP_CONSTANTS.RESOURCES;
  RESOURCES_CODES = APP_CONSTANTS.RESOURCES_CODES;
    constructor(
        private http: Http,  private httpp: HttpClient
    ) {
        const headers = new HttpHeaders();
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Request-Headers', '*');
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
        this.options = { headers: headers };
     }

    checkLogin = (data) => {
        const url = BASE_URL + 'api/userAuth.php';
        return this.httpp.post(url, data, this.options).toPromise();
    }

    private extractData(res: Response) {
        const body = res.json();
        return body;
    }

    setUser = (user) => {
        if ( utils.isEmpty(this.user) ) {
            this.user = user;
        }
    }

    destroyUserDetails = () => {
        this.user = _.noop();
    }

    getUser = () => {
        return _.cloneDeep(this.user) || this.getTempUser();
    }

    isUserAuthenticated = (): boolean => {
        return !utils.isEmpty(this.user);
    }

    registerNewUser = (data): any => {
        const url = BASE_URL + 'api/signup.php';
        return this.httpp.post(url, data, this.options).toPromise();
    }

    getTempUser = () => {
      return {
        'ID': '1098',
        'FirstName': 'Test7',
        'MiddleName': '',
        'LastName': 'User7',
        'UserID': 'user7',
        'RoleID': '3',
        'RoleName': 'BILL_ASSOC',
        'resources': [
          {
            'ResourceID': '12',
            'ResourceName': 'SDTL'
          },
          {
            'ResourceID': '13',
            'ResourceName': 'PDTL'
          },
          {
            'ResourceID': '14',
            'ResourceName': 'ADTL'
          }
        ]
      };
      
      /*{
        'ID': '1009',
        'FirstName': 'Lawin Babu',
        'MiddleName': '',
        'LastName': 'Bunga',
        'UserID': 'bsunny',
        'RoleID': '3',
        'RoleName': 'BILL_ASSOC',
        'resources': [
          {
            'ResourceID': '13',
            'ResourceName': 'PDTL'
          },
          {
            'ResourceID': '12',
            'ResourceName': 'SDTL'
          },
          {
            'ResourceID': '14',
            'ResourceName': 'ADTL'
          }
        ]
      };*/
       /* return {
                'ID': '1001',
                'FirstName': 'Venkat',
                'MiddleName': 'Reddy',
                'LastName': 'Gujja',
                'UserID': 'vgujja',
                'RoleID': '1',
                'RoleName': 'SUP_ADM',
                'resources': [
                  {
                    'ResourceID': '1',
                    'ResourceName': 'ASSOC'
                  },
                  {
                    'ResourceID': '2',
                    'ResourceName': 'INVOC'
                  },
                  {
                    'ResourceID': '3',
                    'ResourceName': 'ASGMT'
                  },
                  {
                    'ResourceID': '4',
                    'ResourceName': 'CLIENT'
                  },
                  {
                    'ResourceID': '5',
                    'ResourceName': 'ADMIN'
                  },
                  {
                    'ResourceID': '6',
                    'ResourceName': 'RPRTS'
                  },
                  {
                    'ResourceID': '7',
                    'ResourceName': 'TMSHT'
                  },
                  {
                    'ResourceID': '8',
                    'ResourceName': 'ACCT_RECEIVE'
                  }
                ]
              };*/
    }

    updateResources = () => {
      if ( isDevMode ) {
        this.user = this.getUser();
      }
        const resources = this.user.resources;
        let path = '';
        resources.splice(0, 0, {path: '', icon: 'fa fa-dashboard', ResourceName: 'DASH', ResourceID: '0', subTabs: []});
        for ( let i = 0; i < resources.length; i++ ) {
          path = '';
          switch ( resources[i].ResourceName ) {
            case this.RESOURCES_CODES.ASSOC:
            resources[i]['path'] = '/layout/assoc';
            resources[i]['icon'] = 'fa fa-users';
            resources[i]['selectedTab'] = this.RESOURCES_CODES.HOME;
            resources[i]['subTabs'] = [
              {path: resources[i]['path'], title: 'Home', CODE: this.RESOURCES_CODES.HOME},
              {path: resources[i]['path'], title: 'View', CODE: this.RESOURCES_CODES.ASSOC},
                {path: resources[i]['path'], title: 'Edit', CODE: this.RESOURCES_CODES.ASSOC}];
                break;
            case this.RESOURCES_CODES.ADMIN:
            resources[i]['path'] = '/layout/admin';
            resources[i]['icon'] = 'fa fa-user-circle-o';
            resources[i]['selectedTab'] = this.RESOURCES_CODES.HOME;
            resources[i]['subTabs'] = [
                    {path: '/layout/adm-compen', title: 'Home',  CODE: this.RESOURCES_CODES.HOME},
                    {path: '/layout/adm-compen', title: 'Compensation', CODE: this.RESOURCES_CODES.ADMIN_COMPEN},
                    {path: '/layout/adm-income', title: 'Income Assignment', CODE: this.RESOURCES_CODES.ADMIN_INCOME_ASSIGN},
                    {path: '/layout/adm-expenses', title: 'Employee Expenses', CODE: this.RESOURCES_CODES.ADMIN_EXPENSES},
                    {path: '/layout/adm-as-role', title: 'Role Allocation', CODE: this.RESOURCES_CODES.ROLE_ALLOCATE},
                    {path: '/layout/adm-role-res', title: 'Resource Allocation', CODE: this.RESOURCES_CODES.RESOURCE_ALLOCATE}
                    ];
                break;
            case this.RESOURCES_CODES.ASGMT:
            resources[i]['path'] = '/layout/assign';
            resources[i]['icon'] = 'fa fa-link';
            resources[i]['selectedTab'] = this.RESOURCES_CODES.HOME;
            resources[i]['subTabs'] = [
              {path: resources[i]['path'], title: 'Home', CODE: this.RESOURCES_CODES.HOME},
              {path: resources[i]['path'], title: 'View', CODE: this.RESOURCES_CODES.ASGMT},
            {path: resources[i]['path'], title: 'Edit', CODE: this.RESOURCES_CODES.ASGMT}];
              break;
            case this.RESOURCES_CODES.CLIENT:
            resources[i]['path'] = '/layout/clients';
            resources[i]['icon'] = 'fa fa-sitemap';
            resources[i]['selectedTab'] = this.RESOURCES_CODES.HOME;
            resources[i]['subTabs'] = [
              {path: resources[i]['path'], title: 'Home', CODE: this.RESOURCES_CODES.HOME},
              {path: resources[i]['path'], title: 'View', CODE: this.RESOURCES_CODES.CLIENT},
            {path: resources[i]['path'], title: 'Edit', CODE: this.RESOURCES_CODES.CLIENT}];
              break;
            case this.RESOURCES_CODES.INVOC:
            resources[i]['path'] = '/layout/invoice';
            resources[i]['icon'] = 'fa fa-files-o';
            resources[i]['selectedTab'] = this.RESOURCES_CODES.HOME;
            resources[i]['subTabs'] = [
              {path: resources[i]['path'], title: 'Home', CODE: this.RESOURCES_CODES.HOME},
              {path: resources[i]['path'], title: 'View', CODE: this.RESOURCES_CODES.INVOC},
            {path: resources[i]['path'], title: 'Edit', CODE: this.RESOURCES_CODES.INVOC}];
              break;
            case this.RESOURCES_CODES.RPRTS:
            resources[i]['path'] = '/layout/repo';
            resources[i]['icon'] = 'fa fa-files-o';
            resources[i]['selectedTab'] = this.RESOURCES_CODES.HOME;
            resources[i]['subTabs'] = [
              {path: resources[i]['path'], title: 'Home', CODE: this.RESOURCES_CODES.HOME},
              {path: '/layout/rep-exp', title: 'Expenses', CODE: this.RESOURCES_CODES.REPORT_EXP},
              {path: '/layout/rep-assoc', title: 'Associates', CODE: this.RESOURCES_CODES.REPORT_ASSOC},
            ];
              break;
            case this.RESOURCES_CODES.TMSHT:
            resources[i]['path'] = '/layout/tmsht';
            resources[i]['icon'] = 'fa fa-calendar';
            resources[i]['selectedTab'] = this.RESOURCES_CODES.HOME;
            resources[i]['subTabs'] = [
              {path: resources[i]['path'], title: 'Home', CODE: this.RESOURCES_CODES.HOME},
              {path: '', title: 'View', CODE: this.RESOURCES_CODES.TMSHT}];
              break;
            case this.RESOURCES_CODES.ACCT_RECEIVE:
            resources[i]['icon'] = 'fa fa-money';
              resources[i]['path'] = '/layout/actreciv';
              resources[i]['selectedTab'] = this.RESOURCES_CODES.HOME;
              resources[i]['subTabs'] = [
                {path: resources[i]['path'], title: 'Home', CODE: this.RESOURCES_CODES.HOME},
                {path: '/layout/actreciv', title: 'Recieve Payements', CODE: this.RESOURCES_CODES.ACCT_RECEIVE},
                {path: '/layout/exp', title: 'Expensess', CODE: this.RESOURCES_CODES.ACCT_RECEIVE_EXPENSES},
              ];
              break;
            case this.RESOURCES_CODES.SDTL:
              resources[i]['icon'] = 'fa fa-user-circle';
              resources[i]['path'] = '/layout/assoc-stmt';
              resources[i]['selectedTab'] = this.RESOURCES_CODES.HOME;
              resources[i]['subTabs'] = [];
              break;
            case this.RESOURCES_CODES.PDTL:
              resources[i]['icon'] = 'fa fa-address-card';
              resources[i]['path'] = '/layout/assoc-per';
              resources[i]['selectedTab'] = this.RESOURCES_CODES.HOME;
              resources[i]['subTabs'] = [];
              break;
            case this.RESOURCES_CODES.ADTL:
              resources[i]['icon'] = 'fa fa-wheelchair';
              resources[i]['path'] = '/layout/assoc-pro';
              resources[i]['selectedTab'] = this.RESOURCES_CODES.HOME;
              resources[i]['subTabs'] = [];
              break;
          }
    }
    this.user.resources = [... resources];
}


}

