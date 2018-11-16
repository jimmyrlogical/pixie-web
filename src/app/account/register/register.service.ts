import { Injectable } from "@angular/core";
import { WebsocketService } from "../../services/websocket.service";
import { Observable } from "rxjs/Rx";
import { ConnectionMessage } from '../../model/connectionMessage';

@Injectable()
export class RegisterService {
  
  private key: string = "email";
  private key1: string = "registercheck";
  private key2: string = "securitytoken";

  private _registerObservable: Observable<ConnectionMessage>;

  get registerObservable(): Observable<ConnectionMessage> {
    return this._registerObservable;
  }

  set registerObservable(value: Observable<ConnectionMessage>) {
      this._registerObservable = value;
  }

  constructor(private wsService: WebsocketService) {
                          
    this.registerObservable = new Observable<ConnectionMessage>((observer) => {
        this.wsService.connObservable
            .subscribe((result: ConnectionMessage) => {
                                if ((result.event == "/api/user_post") || (result.event == "error") || (result.event == "connect_error")) {
                                    observer.next(result);
                                }
                            });
                        });
   }
  
  public userRegistration(data: any) {
    this.wsService.createUser(data);
  }

}