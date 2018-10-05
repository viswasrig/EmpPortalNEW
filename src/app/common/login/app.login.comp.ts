import { Component, OnInit, OnChanges, SimpleChanges, AfterViewInit,
  ViewChild, AfterViewChecked, ElementRef} from '@angular/core';
import { AppService } from '../../services/app.service';
import {NgForm} from '@angular/forms';
import * as _ from 'lodash';
import * as v4 from 'uuid';
import * as moment from 'moment';
import { AppUserAuthService } from '../../services/app.userAuth.service';
import { Router, ActivatedRoute} from '@angular/router';
declare const staffValidate: any;
declare const jQuery: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.login.comp.html',
  styleUrls: ['./app.login.comp.scss']
})
export class AppLoginComponent implements OnInit, OnChanges, AfterViewInit, AfterViewChecked {
  title = 'Login';
  BUTTONS  = {LOGIN: 'LOGIN', SIGNUP: 'SIGNUP'};
  loginModel = {userid: '', password: '', rememberme: false};
  isSelectedBtn = '';
  error = {isResponseError: false, text: '', type: 'Error'};
  user = {fname: '', mname: '', lname: '', dob: '', ssn: '',
  gender: '', userid: '', pwd: '', email: '', mobileNumber: ''};

  @ViewChild('dob', {read: ElementRef}) dob: ElementRef;
  dobElementLoaded = false;

  constructor(private userAuthSerrvice: AppUserAuthService, private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {
    this.isSelectedBtn = this.BUTTONS.LOGIN;
    this.title = 'log in to e3Global.com';
    this.loginModel = {userid: '', password: '', rememberme: false};
  }


  showForms = (btnType) => {
      if ( btnType === this.BUTTONS.LOGIN) {
        this.isSelectedBtn = this.BUTTONS.LOGIN;
        this.title = 'log in to e3Global.com';
        staffValidate.onLoad();
      } else {
        this.isSelectedBtn = this.BUTTONS.SIGNUP;
        this.title = 'Sign Up in to e3Global.com';
        staffValidate.onLoad();
      }
  }

  ngOnChanges( changes: SimpleChanges ) {

  }

  ngAfterViewInit() {

  }

  ngAfterViewChecked() {
    // staffValidate.onLoad();
    this.initializeDatePicker(this.dob);
  }

  initializeDatePicker = (ele) => {
    if (ele && !this .dobElementLoaded) {
      const id = ele.nativeElement.id;
      jQuery('#' + id).datepicker({format: 'mm/dd/yyyy', container: '.date', autoclose: true});
      this .dobElementLoaded = false;
      jQuery('#' + id).on('changeDate', (e) => {
        let date = e.date;
        date = moment(date).format('MM/DD/YYYY');
        this.user.dob = date;
        });
    }
  }

  isCloseAlert = () => {
    this.error.isResponseError = false;
  }

  getUser = () => {
    return {fname: '', mname: '', lname: '', dob: '', ssn: '',
    gender: '', userid: '', pwd: '', email: '', mobileNumber: ''};
  }

  onSubmit = (e: NgForm) => {
    // console.log(e);
    if ( e.valid ) {
      this.userAuthSerrvice.checkLogin(this.loginModel).then(resp => {
        // console.log(resp);
        if ( resp['success'] ) {
          const user = resp['response']['user'];
          this.userAuthSerrvice.setUser(user);
          this.router.navigate( ['/layout/invoice']);
        } else {
          this.error.isResponseError = true;
          this.error.text = resp['errors']['error'];
        }
      }).catch(ex => {
        console.log('User Authentication Failed', ex);
      });
    }
  }


  signUpFormSubmit = (e: NgForm) => {
    console.log(e);
    if ( e.valid ) {
     this.userAuthSerrvice.registerNewUser(this.user).then(resp => {
        console.log(resp);
        if ( resp.success ) {
            this.error = {type: 'Success', text: 'Your registration is done. Please login your account.',
            isResponseError: true };
            this.user = this.getUser();
        } else {

        }
      }).catch(ex => {
        console.log('User Authentication Failed', ex);
      });
    }
  }

}

