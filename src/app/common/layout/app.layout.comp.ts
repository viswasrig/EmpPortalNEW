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
    this.user = this.appUserAuthService.getUser();
    this.updateResources();
    // console.log(this.user.resources[1].ResourceName);
      this.selectedNavigation = this.user.resources[1].ResourceName;
      console.log(this.user);
  }

  updateResources = () => {
    this.appUserAuthService.updateResources();
    this.user = this.appUserAuthService.getUser();
    // console.log(this.user);
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
    // console.log(resource.ResourceName + '============' + resource.subTabs.length);
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

