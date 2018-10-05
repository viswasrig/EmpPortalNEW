import { Location } from '@angular/common';
import { Injectable} from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { AppLoaderService } from './app.loader.service';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/observable/empty';
// import {tap, map, catchError, share} from 'rxjs/Operators';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import {tap} from 'rxjs/operators/tap';
import {catchError} from 'rxjs/operators/catchError';
// import 'rxjs/internal/observable/fromPromise';
/*import {do, map, catch,throw} 'rxjs/Operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';*/

declare const utils: any;

@Injectable()
export class AppHTTPInterceptorService implements HttpInterceptor {

    constructor(private loaderService: AppLoaderService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // const ObservableSrc = from(Observable);
       this.loaderService.setLoadState(true);
        const handleObs: Observable<HttpEvent<any>> = next.handle(request);
        return handleObs.pipe(
            tap((event: HttpEvent<any>) => {
                // console.log(event);
                if (event instanceof HttpResponse) {
                    this.loaderService.setLoadState(false);
                }
            }),
            catchError((err: HttpErrorResponse) => {
               // console.log(event);
                this.loaderService.setLoadState(false);
                if ((err.status === 400) || (err.status === 401)) {
                    // this.interceptorRedirectService.getInterceptedSource().next(err.status);
                    return Observable.empty();
                } else {
                    return Observable.throw(err);
                }
            })
        );
      }
      private async handleAccess(request: HttpRequest<any>, next: HttpHandler):
          Promise<HttpEvent<any>> {
        /**const token = await this.msalService.getAccessToken();
        let changedRequest = request;
        // HttpHeader object immutable - copy values
        const headerSettings: {[name: string]: string | string[]; } = {};
        for (const key of request.headers.keys()) {
          headerSettings[key] = request.headers.getAll(key);
        }
        if (token) {
          headerSettings['Authorization'] = 'Bearer ' + token;
        }
        headerSettings['Content-Type'] = 'application/json';
        const newHeader = new HttpHeaders(headerSettings);
        changedRequest = request.clone({
          headers: newHeader});
          **/
         this.loaderService.setLoadState(true);
        return next.handle(request).toPromise().then((resp) => {
            this.loaderService.setLoadState(false);
            return resp;
        }).catch(ex => {
            this.loaderService.setLoadState(false);
            throw ex;
        });
      }

}

