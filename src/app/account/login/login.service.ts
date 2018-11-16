import { Injectable } from "@angular/core";
import { WebsocketService } from "../../services/websocket.service";
import { Observable } from "rxjs/Rx";
import { ConnectionMessage } from '../../model/connectionMessage';

@Injectable()
export class LoginService {
  
  private key: string = "email";
  private key1: string = "logincheck";
  private key2: string = "securitytoken";

  private _loginObservable: Observable<ConnectionMessage>;

  get loginObservable(): Observable<ConnectionMessage> {
    return this._loginObservable;
  }

  set loginObservable(value: Observable<ConnectionMessage>) {
      this._loginObservable = value;
  }

  constructor(private wsService: WebsocketService) {
                          
    this.loginObservable = new Observable<ConnectionMessage>((observer) => {
        this.wsService.connObservable
            .subscribe((result: ConnectionMessage) => {
                                if ((result.event == "/api/user/login") || (result.event == "error") || (result.event == "connect_error")) {
                                    observer.next(result);
                                }
                            });
                        });
   }
  
  public login(data: any) {
    this.wsService.authenticate(data.email, data.password);
  }

}