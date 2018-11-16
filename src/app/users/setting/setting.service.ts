import { Injectable } from "@angular/core";
import { WebsocketService } from "../../services/websocket.service";
import { Observable, Subject } from "rxjs/Rx";
import { ConnectionMessage } from '../../model/connectionMessage';

@Injectable()
export class settingService {
  
    public user: Subject<any>;

    private _settingObservable: Observable<ConnectionMessage>;
  
    get settingObservable(): Observable<ConnectionMessage> {
      return this._settingObservable;
    }
  
    set settingObservable(value: Observable<ConnectionMessage>) {
        this._settingObservable = value;
    }
  
    /**
     * @description Our constructor calls our wsService connect method.  If there exists 
     *                a valid token, connect with it.
     * @param wsService 
     * @param storage 
     */
    constructor(private wsService: WebsocketService) {
    
      // Listen for connections.  When connected, ACT.
      
      this.settingObservable = new Observable<ConnectionMessage>((observer) => {
          this.wsService.connObservable
              .subscribe((result: ConnectionMessage) => {
                                  // Only pass up events that are error, connection error and user_put.
                                  if ((result.event == "/api/user_put") ||
                                      (result.event == "error") ||
                                      (result.event == "connect_error")) {
                                      observer.next(result);
                                  }
                                  
  
                              });
                          });
     }
  
      /**
      * Create the user.
      * @param data 
      */
     public settingputUser(user: any) {
  
      this.wsService.settingputUser(user);
  }
  
}