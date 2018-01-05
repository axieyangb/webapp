import { User } from './user';
import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {
    private _jobLoginUrl: string = "http://35.163.86.156/jobsearch";
    private _optionsJSON = new RequestOptions({
        headers: new Headers
            ({
                "Content-Type": "application/json"
            })
    });
    private _optionsForm = new RequestOptions({
        headers: new Headers
            ({
                "Content-Type": "application/x-www-form-urlencoded"
            })
    });
    constructor(private http: Http) { }
    login(user: User):Observable<any> {
        let params = "username="+user.username+"&password="+user.password+"&grant_type="+user.grant_type;
       return this.http.post(this._jobLoginUrl + "/token", params, this._optionsForm).map(res=>res.json());
    }
    findUser(user:User):Observable<boolean>{
       return this.http.post(this._jobLoginUrl + "/account/finduser", {"username":user.username}, this._optionsJSON).map(res=>res.json()).catch(this.handleError);
    }
    register(user:User):Observable<boolean>{
        return this.http.post(this._jobLoginUrl+"/account/Register",{"UserName":user.username,"Password":user.password,"ConfirmPassword":user.confirmpassword,"Email":user.email,"PhoneNumber":user.phonenumber},this._optionsJSON)
        .map(res=>res.status).catch(this.handleError);
    }

    private handleError(error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

}