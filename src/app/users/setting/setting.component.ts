import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
// import { userInformation } from '../../model/user';

import { WebsocketService } from '../../services/websocket.service';
import { settingService } from '../setting/setting.service';
import { ConnectionMessage } from '../../model/connectionMessage';
import { Observable, Subject } from 'rxjs/Rx';

/*
set function for setting to call set design
*/
declare function setSetting(): any;

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css'],
  // providers: [ WebsocketService, settingService ]
  providers: [WebsocketService, settingService]
})
export class SettingComponent implements OnInit {

  error: any;

  userName: string = "";
  nickName: string = "";
  fullName: string = "";
  email: string = "";
  phone: string = "";

  constructor(@Inject(DOCUMENT) private document: Document, private router: Router, private settingSvc: settingService, private wsService: WebsocketService) {

    settingSvc.settingObservable
      .subscribe((registerResult: ConnectionMessage) => {
        this.processConnectionMessage(registerResult);
        console.log(registerResult);
      });


    // debugger;
    // '5b84d96fe4a063320be938fc'
    // this.getUserData(localStorage.PL_userId);


  }

  ngOnInit() {
    this.document.body.classList.remove('login_bg');
    // this.document.body.classList.add('navSmall');



    /*
     for get user information from user id
    */


    let myData: any = {
      "id": '5b84d96fe4a063320be938fc'
    };
    this.settingSvc.settingGetUser(myData);
    debugger;
    if (localStorage.length > 0) {
      this.userName = localStorage.PL_name;
      this.nickName = localStorage.PL_nickName;
      this.fullName = localStorage.PL_fullName;
      this.email = localStorage.PL_email;
      this.phone = localStorage.PL_phone;
    } else {
      this.userName = '';
      this.nickName = '';
      this.fullName = '';
      this.email = '';
      this.phone = '';
    }

    /*
    set function for setting to call set design
    */
    setSetting();

  }

  private processConnectionMessage(settingResult: ConnectionMessage) {
    debugger;
    if (settingResult.event == "connect_error") { // No network.
      // TODO:  Just a popup, but we need more specific behavior.
      // if (this.loginerror == false) {
      //   this.error = 'true';
      // }

    } else if ((settingResult.event == "/api/user_get") &&
      (settingResult.message == "ok") &&
      settingResult.returnObject.token) {

      console.log('token: ' + settingResult.returnObject.token);
      this.router.navigateByUrl('/setting');

    } else if ((settingResult.event == "/api/user_get") &&
      (settingResult.message != "ok")) { // Login problem.
      this.error = 'true';
    }
  }

  private getUserData(id): void {
    debugger;
    let i;
    let channelXmit: Subject<any> = <Subject<any>>this.wsService
      .exec("/api/user_get")
      .map((response: any): any => {
        debugger;
        console.log(response);
      },
        (error) => {
          debugger;
          console.log(error);
        });
    channelXmit.subscribe();
    channelXmit.next({ "id": "5b84d96fe4a063320be938fc" });

  }
}
