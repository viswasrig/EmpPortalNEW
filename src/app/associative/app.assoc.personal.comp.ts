import { Component, OnInit, OnChanges, SimpleChanges, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { AppService } from '../services/app.service';
import { AppUserAuthService } from '../services/app.userAuth.service';
import { AppRoutingService } from '../services/app.routing.service';
import { APP_CONSTANTS } from '../services/app.constants';
import { AppGridService } from '../services/app.grid.service';
import * as _ from 'lodash';
import { collectExternalReferences } from '../../../node_modules/@angular/compiler';
import { NgForm } from '../../../node_modules/@angular/forms';
declare const utils: any;
declare const toastr: any;
@Component({
    selector: 'app-aso-p',
    templateUrl: './app.assoc.personal.comp.html',
    styleUrls: ['./app.assoc.comp.scss']
  })
  export class AppAssociatePersonalComponent implements OnInit, OnChanges, AfterViewInit {
    title = 'Associate Personel Details';
    user = null;
    CRUD = APP_CONSTANTS.CRUD;
    options = null;
    DATE_TYPES = APP_CONSTANTS.DATA_TYPES;
    PCONST = {
      PERSONEL: 'PERSONEL',
      CONTACT: 'CONTACT',
      PHONE_EMAIL: 'PHONE_EMAIL',
      CHANGE_PWD: 'CHANGE_PWD',
    };
    DEF_TYPES = {
      'associate': 'Employee',
      'client': 'Client',
      'current': 'Primary',
      'old': 'Secondary'
    };

    contack_Key = '';
    security_Key = '';
    PE_Key = '';
    assoc = null;
    isPersonEditable = false;
    isContactEditable = false;
    isEmailPhoneEditable = false;
    isSecurityEditable = false;
    userId = null;
    constructor(private appService: AppService,
      private appUserAuthService: AppUserAuthService,
      private appRoutingService: AppRoutingService,
      private cd: ChangeDetectorRef,
      private appGridService: AppGridService) {}

    ngOnInit() {
      this.user = this.appUserAuthService.getUser();
      const state = this.appRoutingService.getCurrentState();
      this.assoc = this.getAssociate();
      this.userId = this.user.ID;
      this.getAssociateById(this.user.ID);
      this.getAddressDetails();
      this.getPhoneAndEmailDetails();
     }

    ngOnChanges(changes: SimpleChanges) {

    }
    ngAfterViewInit() {

    }

    getAssociate = () => {
      return{
        ID: '', firstName: '', middleName: '', lastName: '', dateOfBirth: '', ssn: '', employerName: '', DateOfjoining: '',
        address1: '', address2: '', city: '', state: '', zip: '', country: '', addressType: 'current',
        entityID: '', addressID: '', typeOfEntity: 'associate', phone: '', pType: '', phoneID: '',
        email: '', eType: '',  emailID: ''
      };
    }

    enablePersonEdit = () => {
      this.isPersonEditable = !this.isPersonEditable;
    }

    isPersonEditEnabled = () => {
      return this.isPersonEditable;
    }

    enableContactInfoEdit = () => {
      this.isContactEditable = !this.isContactEditable;
    }

    isContactInfoEditEnabled = () => {
      return this.isContactEditable;
    }

    enableEmailPhoneEditable = () => {
      this.isEmailPhoneEditable = !this.isEmailPhoneEditable;
    }
    isPhoneEmailEditabled = () => {
      return this.isEmailPhoneEditable;
    }

    enableSecurityKeyEditable = () => {
      this.isSecurityEditable = !this.isSecurityEditable;
    }

    isSecurityKeyEditabled = () => {
      return this.isSecurityEditable;
    }


    enableSection = (sectionName) => {
      switch (sectionName) {
        case this.PCONST.PERSONEL:
            break;
        case this.PCONST.CONTACT:
          this.contack_Key = sectionName;
          break;
        case this.PCONST.CHANGE_PWD:
            this.security_Key = sectionName;
            break;
        case this.PCONST.PHONE_EMAIL:
            this.PE_Key = sectionName;
            break;
      }
    }

    getAssociateById = (Id) => {
      this.appService.getAssociateById(Id).then( (resp) => {
          // console.log(resp);
          if ( resp['success'] ) {
             const data = resp['response'];
             this.assoc = this.assoc || this.getAssociate();
             this.assoc = { ...this.assoc, ...data};
             // console.log(this.assoc);
          } else {
             // this.appRoutingService.navigateToURLParams('layout/assoc', {type: this.RESPONSE_STATUS.ERROR, msg: resp['response']});
          }
      }).catch(ex => {
          console.log(' Exception Caught by getting Associate ', ex);
      });
    }

    assocPNewFormSubmit = (e: NgForm) => {
      if (e.valid) {
        const data = _.cloneDeep( this.assoc );
        this.assoc = this.getAssociate();
        this.appService.updateAssocById(data).then(resp => {
            if ( resp['success'] ) {
                toastr.success(resp['response'], null, {positionClass: 'toast-bottom-right'});
                this.enablePersonEdit();
            } else {
                toastr.error(resp['response'], null, {positionClass: 'toast-bottom-right'});
            }
         }).catch((ex) => {
            console.log('Exception caught due to adding of assoc', ex);
         });
      }
    }

    getAddressDetails = () => {
      this.appService.getAddressDetailsByUserId('ADDR', this.userId).then((resp) => {
        if ( resp['success'] ) {
          const address = resp['response'][0];
          const {address1, address2, city, state, zip, country, typeOfEntity, addressType, addressID, entityID} = address;
          this.assoc = {... this.assoc, address1, address2, city, state, zip, country, typeOfEntity, addressType, addressID, entityID};
          // console.log(this.assoc);
        } else {
          this.isContactEditable = true;
        }
      }).catch((ex) => {
        console.log('Exception caught due to fetch Address Details', ex);
      });
    }

    updateAddressDetails = (e: NgForm) => {
      if ( e.valid ) {
        const data = _.cloneDeep( this.assoc );
        data['userId'] = this.userId;
        this.assoc = this.assoc || this.getAssociate();
        data['PTYPE'] = 'ADDR';
        this.appService.updateAddressDetails(data).then((resp) => {
            if ( resp['success'] ) {
                toastr.success(resp['response'], null, {positionClass: 'toast-bottom-right'});
                this.getAddressDetails();
                this.enableContactInfoEdit();
            } else {
                toastr.error(resp['response'], null, {positionClass: 'toast-bottom-right'});
            }
        }).catch((ex) => {
          console.log('Exception caught due to update Address details', ex);
        });
      }
    }

    getPhoneAndEmailDetails = () => {
      this.appService.getPhoneAndEmailDetailsByUserID('PHONE_EMAIL', this.userId).then((resp) => {
        if ( resp['success'] ) {
          for (let i = 0 ; i < resp['response'].length; i++) {
            if (resp['response'][i]['type'] === 'Email' ) {
              const {email, eType,  emailID} = resp['response'][i];
              this.assoc = {... this.assoc, email, eType,  emailID };
            } else {
              const {phone, pType,  phoneID} = resp['response'][i];
              this.assoc = {... this.assoc, phone, pType,  phoneID };
            }
          }
          // console.log(this.assoc);
        } else {
          this.isEmailPhoneEditable = true;
        }
      }).catch((ex) => {
        console.log('Exception caught due to fetching of Phone and Email', ex);
      });
    }

    updateEmailAndPhoneDetails = (e: NgForm) => {
      if ( e.valid ) {
        const data = _.cloneDeep(this.assoc);
        data['userId'] = this.userId;
        data['PTYPE'] = 'PHONE_EMAIL';
        this.assoc = this.assoc || this.getAssociate();
        this.appService.updateAddressDetails(data).then((resp) => {
            if ( resp['success'] ) {
                toastr.success(resp['response'], null, {positionClass: 'toast-bottom-right'});
                this.getPhoneAndEmailDetails();
                this.enableEmailPhoneEditable();
            } else {
                toastr.error(resp['response'], null, {positionClass: 'toast-bottom-right'});
            }
        }).catch((ex) => {
          console.log('Exception caught due to update Address details', ex);
        });
      }
    }

  }
