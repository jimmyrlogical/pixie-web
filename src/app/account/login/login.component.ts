import { Component, Renderer2, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { userModel, userModelClass } from '../../model/user';

import { WebsocketService } from '../../services/websocket.service';
import { LoginService } from '../login/login.service';
import { ConnectionMessage } from '../../model/connectionMessage';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] ,
  providers: [ WebsocketService, LoginService ]
})
export class LoginComponent implements OnInit {
  
  UserModel: userModel;
  UserModelClass: userModelClass;

  userName : string = ""; //koushikkothagal
  password : string = "";
  setRememberMe : boolean = false;

  response : any;
  error : any;
  validation : any;
  validationCheck : string = "false";

  public loginerror = false;

  constructor(@Inject(DOCUMENT) private document: Document,private http: HttpClient, private router: Router, private loginSvc: LoginService, private renderer: Renderer2) {
    this.UserModel = new userModel();
    this.UserModel.userName = 'false';
    this.UserModel.password = 'false';
    this.UserModel.rememberMe = 'false';

    this.UserModelClass = new userModelClass();
    this.UserModelClass.userName = false;
    this.UserModelClass.password = false;
    this.UserModelClass.rememberMe = false;

    loginSvc.loginObservable
    .subscribe((loginResult: ConnectionMessage) => {
      this.processConnectionMessage(loginResult);
      console.log(loginResult);
    });

  }

  ngOnInit() {

    this.document.body.classList.add('login_bg');

    this.renderer.listen(window, 'scroll', ($event) => {
      console.log('abc');
    });

    if(localStorage.length > 0){
      this.userName = localStorage.PL_name;
      this.password = localStorage.PL_password;
      this.setRememberMe = true;
    } else {
      this.userName = '';
      this.password = '';
      this.setRememberMe = false;
    }
  }
  checkUnCheck(event) {
    if (event.target.checked) {
      console.log('checked....');
      this.setRememberMe = true;
    }else{
      console.log('uncheck....');
      this.setRememberMe = false;
    }
  }

  onKeyPress(event) {
    console.log('keyCode: ' + event.keyCode + '  || Value:  ' + event.target.value);
    if(event.keyCode == 13){
      this.getLogin();
    }
  }

  getLogin() {
    //debugger;
    this.UserModel = new userModel();
    this.response = null;
    this.error = null;
    this.validation = null;

    console.log('userName: ' + this.userName + '  password: ' + this.password + '');
    
    if(this.userName == '' && this.password == '') {
      this.UserModel.userName = 'false';
      this.UserModel.password = 'false';

      this.UserModelClass.userName = true;
      this.UserModelClass.password = true;

      this.validationCheck = 'false';
    }else if(this.userName != '' && this.password != '') {
      this.UserModel.userName = 'true';
      this.UserModel.password = 'true';

      this.UserModelClass.userName = false;
      this.UserModelClass.password = false;
  
      this.validationCheck = 'true';
    }else if(this.userName == '' && this.password != '') {
      this.UserModel.userName = 'false';
      this.UserModel.password = 'true';

      this.UserModelClass.userName = true;
      this.UserModelClass.password = false;

      this.validationCheck = 'false';
    }else if(this.userName != '' && this.password == '') {
      this.UserModel.userName = 'true';
      this.UserModel.password = 'false';

      this.UserModelClass.userName = false;
      this.UserModelClass.password = true;

      this.validationCheck = 'false';
    }

    if(this.validationCheck == "true") {
      
      let myData: any = {
        "email": this.userName,
        "password": this.password
      };
      this.loginSvc.login(myData);
    }

  }


  private processConnectionMessage(loginResult: ConnectionMessage) {
    // debugger;
    if (loginResult.event == "connect_error") { // No network.
      // TODO:  Just a popup, but we need more specific behavior.
      if (this.loginerror == false) {
        this.error = 'true';
      }

    } else if ((loginResult.event == "/api/user/login") &&
      (loginResult.message == "ok") &&
      loginResult.returnObject.token) {
        
        //console.log('token: ' + loginResult.returnObject.token);
        //let strToken: string = this.parseJwt(loginResult.returnObject.token);

        localStorage.setItem('PL_userId', this.parseJwt(loginResult.returnObject.token).id);
        localStorage.setItem('PL_token', loginResult.returnObject.token);

        localStorage.setItem('PL_birthDate', this.parseJwt(loginResult.returnObject.token).user.birth_date);
        localStorage.setItem('PL_connectionPersistence', this.parseJwt(loginResult.returnObject.token).user.connection_persistence);
        localStorage.setItem('PL_email', this.parseJwt(loginResult.returnObject.token).user.email);
        localStorage.setItem('PL_fullName', this.parseJwt(loginResult.returnObject.token).user.full_name);
        localStorage.setItem('PL_lastLoginDate', this.parseJwt(loginResult.returnObject.token).user.last_login_date);
        localStorage.setItem('PL_mode', this.parseJwt(loginResult.returnObject.token).user.mode);
        localStorage.setItem('PL_nickName', this.parseJwt(loginResult.returnObject.token).user.nickname);
        localStorage.setItem('PL_phone', this.parseJwt(loginResult.returnObject.token).user.phone);

        if(this.setRememberMe){
          localStorage.setItem('PL_name', this.userName);
          localStorage.setItem('PL_password', this.password);
        } else {
          localStorage.removeItem('PL_name');
          localStorage.removeItem('PL_password');
        }

        this.router.navigateByUrl('/dashboard');

      } else if ((loginResult.event == "/api/user/login") &&
      (loginResult.message != "ok")) { // Login problem.
        this.error = 'true';
      }
  }  

  private parseJwt(token: string): any {
    let base64Url: string = token.split('.')[1];
    let base64: string = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  }

}
