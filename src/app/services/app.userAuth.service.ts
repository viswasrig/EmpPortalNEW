import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable, pipe } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as _ from 'lodash';

declare const utils: any;
const BASE_URL = 'http://www.e3globalinc.com/EmpPortalNew/'; //'http://localhost:80/';
@Injectable()
export class AppUserAuthService {
    options = null;
    private user = null;
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
              };
    }

}
