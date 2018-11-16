
/**
 * @description DTO for return message from server concerning connections.
 */
export class ConnectionMessage {
  
    private _message: string;
    private _connectionStatus: ConnectionStatus;
    private _event: string;
    private _returnObject: any;

    /**
     * @description Result message of the event.
     * TODO:  Possibly make this an enum.
     */
    get message(): string {
        return this._message;
    }

    set message(value: string) {
        this._message = value;
    }

    /**
     * @description The current state of the socket.io connection.
     */
    get connectionStatus(): ConnectionStatus {
        return this._connectionStatus;
    }

    set connectionStatus(value: ConnectionStatus) {
        this._connectionStatus = value;
    }

    /**
     * @description The event triggering the message. 
     */
    get event(): string {
        return this._event;
    }

    set event(value: string) {
        this._event = value;
    }

    /**
     * @description Object, if any, returned by server.
     */
    get returnObject(): any {
        return this._returnObject;
    }

    set returnObject(value: any) {
        this._returnObject = value;
    }

    constructor(message: string, connectionStatus: ConnectionStatus, event: string) {
        this.message = message;
        this.connectionStatus = connectionStatus;
        this.event = event
    }
}

export enum ConnectionStatus {
    Connected,
    Disconnected
}