import { Observable } from "rxjs";

export class LoggedInUser {

    constructor(private userName: string, private _token: string, private _expirationDate: Date , private _authorizationType:string) { }

    get token(): string {
        if (!this._expirationDate || new Date() > this._expirationDate) {
            return '';
        } else {
            return this._token;
        }
    }

    get authorizationType(): string{
        return this._authorizationType
    }
}
