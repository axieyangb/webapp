import { Job } from './job';
import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class JobService {
    private _jobsourceUrl: string = "http://35.163.86.156/jobsearch/jobs";
    private _jobsourceUrlLogged:string="http://35.163.86.156/jobsearch/user";
    private _options = new RequestOptions({
        headers: new Headers
            ({
                "Content-Type": "application/json"
            })
    });

    constructor(private http: Http) { }
    buildAuthorizationHeader(headers:Headers,token:string)
    {
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer '+token);
    }
    getAllJobs(): Observable<Job[]> {
        return this.http.get(this._jobsourceUrl, this._options)
            .map(res => res.json()).catch(this.handleError);
    }

    searchJobs(searchJobs: string) {
        let params = "?keywords=" + encodeURIComponent(searchJobs);
        return this.http.get(this._jobsourceUrl + params, this._options)
            .map(res => res.json()).catch(this.handleError);
    }
    searchJobsLogged(searchJobs:string ,token:string)
    {
       
        let params = "?keywords=" + encodeURIComponent(searchJobs);
         let headers = new Headers();
        this.buildAuthorizationHeader(headers,token);
        return this.http.get(this._jobsourceUrlLogged + params, {headers:headers})
            .map(res => res.json()).catch(this.handleError);
    }

    getJobById(id: number) {
        return this.http.get(this._jobsourceUrl + "/" + id, this._options)
            .map(res => res.json()).catch(this.handleError);
    }

    thumbsUp(id: number) {
        return this.http.put(this._jobsourceUrl + "/" + id + "/thumbsup",'', this._options);
    }
    thumbsUpLogged(id: number,token:string) {
        let headers = new Headers();
        this.buildAuthorizationHeader(headers,token);
        return this.http.put(this._jobsourceUrlLogged + "/" + id + "/thumbsup",'',{headers:headers});
    }
    visitedNumUpdate(id: number) {
        return this.http.put(this._jobsourceUrl + "/" + id + "/visited", this._options);
    }
     visitedNumUpdateLogged(id: number,token:string) {
         let headers = new Headers();
        this.buildAuthorizationHeader(headers,token);
        return this.http.put(this._jobsourceUrlLogged + "/" + id + "/visited",'', {headers:headers});
    }
    invalidNumUpdate(id:number)
    {
          return this.http.put(this._jobsourceUrl + "/" + id + "/unavailable",'', this._options);
    }
    invalidNumUpdateLogged(id:number,token:string)
    {
          let headers = new Headers();
        this.buildAuthorizationHeader(headers,token);
          return this.http.put(this._jobsourceUrlLogged + "/" + id + "/unavailable",'', {headers:headers});
    }

    markAsApplied(id:number,token:string)
    {
        let headers = new Headers();
        this.buildAuthorizationHeader(headers,token);
          return this.http.put(this._jobsourceUrlLogged + "/" + id + "/applied",'', {headers:headers});
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