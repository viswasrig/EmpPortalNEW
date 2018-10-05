import {Injectable} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
declare const utils: any;
import {APP_CONSTANTS} from './app.constants';

@Injectable()
export class AppRoutingService {
    private routerStates: any[] ;
    private currentState: any;

    constructor(private route: ActivatedRoute, private router: Router) {
        this.routerStates = [] ;
    }

    addRouterState = (path, params) => {
       let state = this.getRouterState();
        state = { path, url: path, ...params};
        this.routerStates.push(state);
    }

    navigateToURLParams = (URL, params) => {
        for ( let i = 0; i < this.routerStates.length; i++ ) {
                const state = this.routerStates[i];
             if ( !utils.isEmpty(state) && state.path === URL ) {
                state.params = { ...params };
                this.currentState = { ...state } ;
                this.routerStates[i] = { ...state };
                break;
             }
        }
        // console.log(APP_CONSTANTS.ROUTE.BASE_PATH + URL);
        this.router.navigate([APP_CONSTANTS.ROUTE.BASE_PATH + URL], { relativeTo: this.route });
        //console.log(APP_CONSTANTS.ROUTE.BASE_PATH + URL);
        //this.router.navigateByUrl(URL);
    }

    navigateToURL = (URL) => {
        for ( let i = 0; i < this.routerStates.length; i++ ) {
            const state = this.routerStates[i];
            if ( !utils.isEmpty(state) && state.path === URL ) {
                this.currentState = {...state};
                this.routerStates[i] = { ...state };
                break;
            }
        }
        this.router.navigate([APP_CONSTANTS.ROUTE.BASE_PATH + URL], { relativeTo: this.route });
    }

    getCurrentState = () => {
        return this.currentState;
    }

    totalRouterStates = () => {
        console.log(this.routerStates);
    }

    removeParams = (URL) => {
        for ( let i = 0; i < this.routerStates.length; i++ ) {
            const state = this.routerStates[i];
            if ( !utils.isEmpty(state) && state.path === URL ) {
                state.params = null ;
                this.currentState.params = null;
                break;
            }
        }
    }

    reloadSamePage = (route) => {
        setTimeout(() => {
            this.navigateToURL(route);
        }, 1000);
    }

    getRouterState = () => {
         return {
             url: '',
             name: '',
             Component: null,
             params: null,
             path: '',
             redirectTo: '',
             pathMatch: 'full'
        };
    }


}
