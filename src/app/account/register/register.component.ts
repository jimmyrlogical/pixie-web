import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { userModel, userModelClass } from '../../model/user';
import { Router } from '@angular/router';

import { WebsocketService } from '../../services/websocket.service';
import { RegisterService } from '../register/register.service';
import { ConnectionMessage } from '../../model/connectionMessage';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [ WebsocketService, RegisterService ]
})
export class RegisterComponent implements OnInit {

  UserModel: userModel;
  UserModelClass: userModelClass;

  fullName : string = "";
  nickName : string = "";
  birthDate : string = "";
  email : string = "";
  phone : string = "";
  password : string = "";
  rePassword : string = "";

  response : any;
  error : any;
  validation : any;
  validationCheck : string = "false";

  iAgree : boolean = false;

  constructor(@Inject(DOCUMENT) private document: Document,private http: HttpClient, private router: Router, private registerSvc: RegisterService) {
    this.UserModel = new userModel();
    this.UserModel.fullName = 'false';
    this.UserModel.nickName = 'false';
    this.UserModel.birthDate = 'false';
    this.UserModel.email = 'false';
    this.UserModel.password = 'false';
    this.UserModel.rePassword = 'false';
    this.UserModel.phone = 'false';

    this.UserModelClass = new userModelClass();
    this.UserModelClass.fullName = false;
    this.UserModelClass.nickName = false;
    this.UserModelClass.birthDate = false;
    this.UserModelClass.email = false;
    this.UserModelClass.password = false;
    this.UserModelClass.rePassword = false;
    this.UserModelClass.phone = false;
    
    registerSvc.registerObservable
    .subscribe((registerResult: ConnectionMessage) => {
      this.processConnectionMessage(registerResult);
      console.log(registerResult);
    });

  }

  ngOnInit() {
    this.document.body.classList.add('login_bg');
  }

  onKeyPress(event) {
    console.log('keyCode: ' + event.keyCode + '  || Value:  ' + event.target.value);
    if(event.keyCode == 13){
      this.getRegister();
    }
  }

  getRegister() {
    this.UserModel = new userModel();
    this.response = null;
    this.error = null;
    this.validation = null;
    this.validationCheck = 'false';

    console.log('fullName: ' + this.fullName + '  nickName: ' + this.nickName + '  birthDate: ' + this.birthDate + '  email: ' + this.email + '  password: ' + this.password + '  rePassword: ' + this.rePassword + '');

    if(this.fullName == ''){
      this.validationCheck = 'true';
      this.UserModelClass.fullName = true;
    }else{ this.UserModelClass.fullName = false; }

    if(this.nickName == ''){
      this.validationCheck = 'true';
      this.UserModelClass.nickName = true;
    }else{ this.UserModelClass.nickName = false; }

    if(this.birthDate == ''){
      this.validationCheck = 'true';
      this.UserModelClass.birthDate = true;
    }else{ this.UserModelClass.birthDate = false; }

    if(this.email == ''){

      this.validationCheck = 'true';
      this.UserModelClass.email = true;
    }else{ 
      if(!this.isEmail(this.email)){
        //console.log('wrong email address format');
        this.validationCheck = 'true';
        this.UserModelClass.email = true;
      }else{
        //console.log('email address is ok');
        this.UserModelClass.email = false;
      }
    }

    if(this.password == ''){
      this.validationCheck = 'true';
      this.UserModelClass.password = true;
    }else{ this.UserModelClass.password = false; }

    if(this.rePassword == ''){
      this.validationCheck = 'true';
      this.UserModelClass.rePassword = true;
    }else{ this.UserModelClass.rePassword = false; }

    if(this.password != '' || this.rePassword != '') {
      if(this.password != this.rePassword){
        this.validationCheck = 'true';
        this.UserModelClass.password = true;
        this.UserModelClass.rePassword = true;
      } else {
        this.UserModelClass.password = false;    
        this.UserModelClass.rePassword = false;    
      }
    }

    if(this.iAgree == false){
      this.validationCheck = 'true';
    }

    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

    if(this.validationCheck == 'false') {


      let myData: any = {
        "full_name": this.fullName,
        "nickname": this.nickName,
        "email": this.email,
        "password": this.password,
        "phone": this.phone,
        "birth_date": this.birthDate
      };
      this.registerSvc.userRegistration(myData);
    }
  }

  isEmail(search:string):boolean
  {
      var  serchfind:boolean;
      var regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      serchfind = regexp.test(search);
      console.log(serchfind)
      return serchfind
  }


  private processConnectionMessage(registerResult: ConnectionMessage) {
    debugger;
      if (registerResult.event == "connect_error") { // No network.
        // TODO:  Just a popup, but we need more specific behavior.
        // if (this.loginerror == false) {
        //   this.error = 'true';
        // }
  
      } else if ((registerResult.event == "/api/user_post") &&
        (registerResult.message == "ok") &&
        registerResult.returnObject.token) {  
          
          console.log('token: ' + registerResult.returnObject.token);
          this.router.navigateByUrl('/setting');

        } else if ((registerResult.event == "/api/user_post") &&
        (registerResult.message != "ok")) { // Login problem.
          this.error = 'true';
        }
  
    }  

    checkUnCheckAgree(event) {
      if (event.target.checked) {
        console.log('Agree checked....');
        this.iAgree = true;
      }else{
        console.log('Agree uncheck....');
        this.iAgree = false;
      }
    }
  
}
