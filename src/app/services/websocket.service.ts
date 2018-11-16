import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs';
import { ConnectionMessage, ConnectionStatus } from '../model/connectionMessage';

@Injectable()
export class WebsocketService {

  // Our socket connection
  private socket: io;
  // private SERVER_URL: string = "http://www.intercorpamerica.com:8000";
  private SERVER_URL: string = "http://ec2-18-191-175-89.us-east-2.compute.amazonaws.com:8000";

  private _connObservable: Observable<ConnectionMessage>;

  get connObservable(): Observable<ConnectionMessage> {
    return this._connObservable;
  }

  set connObservable(value: Observable<ConnectionMessage>) {
    this._connObservable = value;
  }

  /**
   * @description Default constructor:  Define socket and events, but don't connect.
   */
  constructor() {
    
    this.socket = io(this.SERVER_URL, {
      autoConnect: false,
      reconnection: true
    });


    // Listen to events from socket.
    this.connObservable = new Observable<ConnectionMessage>((observer) => {
      let returnMessage: ConnectionMessage;
      // Authenticated correctly.  Return token in returnObject.          
      this.socket.on("/api/user/login", (result: any) => {
        // If successful, reset the token in the query for future authentication
        if (result.token) {
          if (!this.socket.io.opts.query.token) {
            this.socket.io.opts.query = { token: result.token };
          }
          returnMessage = new ConnectionMessage(result.message, this.SocketConnectionStatus(), "/api/user/login");
          returnMessage.returnObject = result;
        } else {
          returnMessage = new ConnectionMessage(result.message, this.SocketConnectionStatus(), "/api/user/login");
        }

        observer.next(returnMessage);
      });
      // Create user.
      this.socket.on("/api/user_post", (result: any) => {
        // If successful, DON'T log in, just say so and close connection.
        if (result.message == "New document created.") {
          returnMessage = new ConnectionMessage(result.message, this.SocketConnectionStatus(), "/api/user_post");
          returnMessage.returnObject = result;
        } else {
          returnMessage = new ConnectionMessage(result.message, this.SocketConnectionStatus(), "/api/user_post");
        }
        //                                this.socket.io.disconnect();                                
        observer.next(returnMessage);
      });
      // Forget password request.
      this.socket.on("/api/user/forgot-password", (result: any) => {
        console.log(result);
        // If successful, DON'T log in, just say so and close connection.
        /*
        if (result.message == "New document created.") {
          returnMessage = new ConnectionMessage(result.message, this.SocketConnectionStatus(), "/api/user_post"); 
          returnMessage.returnObject = result;
        } else {
          */
        returnMessage = new ConnectionMessage(result.message, this.SocketConnectionStatus(), "/api/user_post");
        //}
        observer.next(returnMessage);
      });
      // Can't connect.
      this.socket.on("connect_error", () => {
        returnMessage = new ConnectionMessage("CONNECTION ERROR", this.SocketConnectionStatus(), "connect_error");
        observer.next(returnMessage);
      });
      // Connection successful.
      this.socket.on("connect", () => {
        console.log("getting this");
        returnMessage = new ConnectionMessage("CONNECTED", this.SocketConnectionStatus(), "connect");
        // TODO:  Listen for notifications!
        observer.next(returnMessage);
      });
      // Connection lost.
      this.socket.on("disconnect", () => {
        returnMessage = new ConnectionMessage("DISCONNECTED", this.SocketConnectionStatus(), "disconnect");
        observer.next(returnMessage);
      });
      // Error from server.  
      this.socket.on("error", (err) => {
        returnMessage = new ConnectionMessage("ERROR", this.SocketConnectionStatus(), "error");
        returnMessage.returnObject = err;
        observer.next(returnMessage);
      });
    });
  }

  /**
   * @description Attempt to connect, but this time carry email/password and listen for
   *              successful authentication.
   * @param email 
   * @param password 
   */
  public authenticate(email: string, password: string): void {

    debugger;
    // this.disconnect();

    if (this.SocketConnectionStatus() == ConnectionStatus.Connected) {
      this.disconnect();
    }

    this.socket.io.opts.query = { email: email, password: password };
    // .open() will trigger events defined in cosntructor.
    this.socket.open();
  }

  public userRegistration(full_name: string, nickname: string, email: string, password: string, phone: string, birth_date: string): void {

    // this.disconnect();

    if (this.SocketConnectionStatus() == ConnectionStatus.Connected) {
      this.disconnect();
    }

    this.socket.io.opts.query = { full_name: full_name, nickname: nickname, email: email, password: password, phone: phone, birth_date: birth_date };
    // .open() will trigger events defined in cosntructor.
    this.socket.open();
  }


  /**
   * @description Attempt to open socketconnection.
   *              Attempt to use stored token, if successful return true.  
   *              If there is no token, leave socket disconnected and return false. 
   */
  public connect(token: string): ConnectionMessage {

    let returnMessage: ConnectionMessage;
    // Reject with error if no socket or socket not connected.
    if (!this.socket) {
      returnMessage = new ConnectionMessage("No socket", ConnectionStatus.Disconnected, "");
      return returnMessage;
    } else if (!this.socket.connected) {
      try {
        if (token) {
          this.socket.io.opts.query = { token: token };
          // .open() will trigger events defined in cosntructor.
          this.socket.open();
          returnMessage = new ConnectionMessage("Connecting", this.SocketConnectionStatus(), "");
          return returnMessage;
        } else {
          returnMessage = new ConnectionMessage("No token", this.SocketConnectionStatus(), "");
          return returnMessage;
        }
      } catch (err) {
        returnMessage = new ConnectionMessage(err, this.SocketConnectionStatus(), "");
        return returnMessage;
      }

    } else {
      returnMessage = new ConnectionMessage("Already connected", this.SocketConnectionStatus(), "");
      return returnMessage;
    }
  }

  /**
   * @description Disconnect socket.
   */
  public disconnect(): void {
    this.socket.close();
  }

  /**
   * @description Because no authorization or authentication is required for
   * 
   * @param newUser 
   */
  public createUser(newUser: any): void {

    //if (this.SocketConnectionStatus() == ConnectionStatus.Connected) {
    this.disconnect();
    //}
    this.socket.io.opts.query = { command: "/api/user_post", user: JSON.stringify(newUser) };
    // .open() will trigger events defined in cosntructor.
    this.socket.open();
  }

  public getUser(newUser: any): void {
    debugger;

    //if (this.SocketConnectionStatus() == ConnectionStatus.Connected) {
    this.disconnect();
    //}
    this.socket.io.opts.query = { command: "/api/user_get", user: JSON.stringify(newUser) };
    // .open() will trigger events defined in cosntructor.
    this.socket.open();
  }

  public settingSet(setting: any): void {

    //if (this.SocketConnectionStatus() == ConnectionStatus.Connected) {
    this.disconnect();
    //}
    this.socket.io.opts.query = { command: "/api/user_put", user: JSON.stringify(setting) };
    // .open() will trigger events defined in cosntructor.
    this.socket.open();
  }

  /**
   * @description Because no authorization or authentication is required fo
   * 
   * @param settingputUser 
   */
  public settingputUser(settingdata: any): void {

    //if (this.SocketConnectionStatus() == ConnectionStatus.Connected) {
    this.disconnect();
    //}
    this.socket.io.opts.query = { command: "/api/user_put", user: JSON.stringify(settingdata) };
    // .open() will trigger events defined in cosntructor.
    this.socket.open();
  }

  /**
     * @description Because no authorization or authentication is required for
     * 
     * @param newRequestdata 
     */
  public requestsend(newRequestdata: any): void {

    //if (this.SocketConnectionStatus() == ConnectionStatus.Connected) {
    this.disconnect();
    //}
    this.socket.io.opts.query = { command: "/api/connection_post", user: JSON.stringify(newRequestdata) };
    // .open() will trigger events defined in cosntructor.
    this.socket.open();
  }

  /**
   * @description Return current connection state of instance socket.
   */
  private SocketConnectionStatus(): ConnectionStatus {
    return this.socket.connected ? ConnectionStatus.Connected : ConnectionStatus.Disconnected;
  }

  /**
   * @description Execute passed method, usually in the form /api/entity_verb.
   * @example wsService.exec("/api/users_get")
   * @param method 
   */

  public exec(method: string): Rx.Subject<MessageEvent> {

    let observable;
    let observer;

    if ((!this.socket)) {
      console.log("Cannot execute.");
    } else {
      // We define our observable which will observe any incoming messages
      // from our socket.io server.
      observable = new Observable((observer: any) => {
        this.socket.on(method, (data) => {
          console.log("Received message from Websocket Server");
          observer.next(data);
        });
      });

      // We define our Observer which will listen to messages
      // from our other components and send messages back to our
      // socket server whenever the `next()` method is called.
      observer = {
        next: (data: Object) => {
          this.socket.emit(method, JSON.stringify(data));
        },
      };
    }

    // we return our Rx.Subject which is a combination
    // of both an observer and observable.
    return Rx.Subject.create(observer, observable);
  }


  
}