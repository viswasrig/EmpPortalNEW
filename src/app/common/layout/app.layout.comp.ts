import { Component, isDevMode, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {AppUserAuthService} from '../../services/app.userAuth.service';
import { Router, ActivatedRoute} from '@angular/router';
import {APP_CONSTANTS} from '../../services/app.constants';
import { AppRoutingService } from '../../services/app.routing.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.layout.comp.html',
  styleUrls: ['./app.layout.comp.scss']
})
export class AppLayoutComponent implements OnInit, OnChanges {
  title = 'app';
  BASE_URL = '';
  user = null;
  ROLE_TYPES = APP_CONSTANTS.ROLE_TYPES;
  RESOURCES = APP_CONSTANTS.RESOURCES;
  RESOURCES_CODES = APP_CONSTANTS.RESOURCES_CODES;
  selectedNavigation = '';
  constructor (private appUserAuthService: AppUserAuthService, private route: ActivatedRoute,
    private router: Router, private appRoutingService: AppRoutingService) {
    if (isDevMode()) {
      this.BASE_URL = '';
    } else {
      this.BASE_URL = '/EmpPortalNew';
    }
  }

  ngOnInit() {
    const flag = this.appUserAuthService.isUserAuthenticated();
   // !isDevMode  &&
    if (!isDevMode  && !flag) {
        this.router.navigate( ['/login']);
    }
    this. user = this.appUserAuthService.getUser();
      this.selectedNavigation = this.RESOURCES_CODES.INVOC;
      this.updateResources();
  }

  updateResources = () => {
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
                {path: '/layout/adm-as-role', title: 'Role Allocation', CODE: this.RESOURCES_CODES.ROLE_ALLOCATE},
                {path: '/layout/adm-income', title: 'Allocate Resources', CODE: this.RESOURCES_CODES.RESOURCE_ALLOCATE}
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
      }
    }
    this.user.resources = [... resources];
  }

  ngOnChanges(changes: SimpleChanges) {

  }

  logout = () => {
    if ( this.appUserAuthService.isUserAuthenticated()) {
        this.appUserAuthService.destroyUserDetails();
    }
    this.router.navigate( ['/login']);
  }

  onNavigationSelect = (resource) => {
    for (let i = 0; i < this.user.resources.length; i++ ) {
      if (resource.ResourceName === this.user.resources[i].ResourceName) {
        resource.enabled = !resource.enabled;
       this.selectedNavigation = resource.ResourceName;
      } else {
        this.user.resources[i].enabled = false;
        this.user.resources[i].subTabs.map((obj, index) => {
          obj.isSelected = false;
        });
      }
    }
  }

  onSubTabSelected(resource, tab) {
    if (resource.subTabs && resource.subTabs.length > 0 ) {
      resource.subTabs.map((object, index) => {
        if ( object.CODE !== tab.CODE ) {
          object.isSelected = false;
        }
      });
    }
    tab.isSelected = true;
  }

}

