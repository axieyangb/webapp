"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
var JobService = (function () {
    function JobService(http) {
        this.http = http;
        this._jobsourceUrl = "http://35.163.86.156/jobsearch/jobs";
        this._jobsourceUrlLogged = "http://35.163.86.156/jobsearch/user";
        this._options = new http_1.RequestOptions({
            headers: new http_1.Headers({
                "Content-Type": "application/json"
            })
        });
    }
    JobService.prototype.buildAuthorizationHeader = function (headers, token) {
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + token);
    };
    JobService.prototype.getAllJobs = function () {
        return this.http.get(this._jobsourceUrl, this._options)
            .map(function (res) { return res.json(); }).catch(this.handleError);
    };
    JobService.prototype.searchJobs = function (searchJobs) {
        var params = "?keywords=" + encodeURIComponent(searchJobs);
        return this.http.get(this._jobsourceUrl + params, this._options)
            .map(function (res) { return res.json(); }).catch(this.handleError);
    };
    JobService.prototype.searchJobsLogged = function (searchJobs, token) {
        var params = "?keywords=" + encodeURIComponent(searchJobs);
        var headers = new http_1.Headers();
        this.buildAuthorizationHeader(headers, token);
        return this.http.get(this._jobsourceUrlLogged + params, { headers: headers })
            .map(function (res) { return res.json(); }).catch(this.handleError);
    };
    JobService.prototype.getJobById = function (id) {
        return this.http.get(this._jobsourceUrl + "/" + id, this._options)
            .map(function (res) { return res.json(); }).catch(this.handleError);
    };
    JobService.prototype.thumbsUp = function (id) {
        return this.http.put(this._jobsourceUrl + "/" + id + "/thumbsup", '', this._options);
    };
    JobService.prototype.thumbsUpLogged = function (id, token) {
        var headers = new http_1.Headers();
        this.buildAuthorizationHeader(headers, token);
        return this.http.put(this._jobsourceUrlLogged + "/" + id + "/thumbsup", '', { headers: headers });
    };
    JobService.prototype.visitedNumUpdate = function (id) {
        return this.http.put(this._jobsourceUrl + "/" + id + "/visited", this._options);
    };
    JobService.prototype.visitedNumUpdateLogged = function (id, token) {
        var headers = new http_1.Headers();
        this.buildAuthorizationHeader(headers, token);
        return this.http.put(this._jobsourceUrlLogged + "/" + id + "/visited", '', { headers: headers });
    };
    JobService.prototype.invalidNumUpdate = function (id) {
        return this.http.put(this._jobsourceUrl + "/" + id + "/unavailable", '', this._options);
    };
    JobService.prototype.invalidNumUpdateLogged = function (id, token) {
        var headers = new http_1.Headers();
        this.buildAuthorizationHeader(headers, token);
        return this.http.put(this._jobsourceUrlLogged + "/" + id + "/unavailable", '', { headers: headers });
    };
    JobService.prototype.markAsApplied = function (id, token) {
        var headers = new http_1.Headers();
        this.buildAuthorizationHeader(headers, token);
        return this.http.put(this._jobsourceUrlLogged + "/" + id + "/applied", '', { headers: headers });
    };
    JobService.prototype.handleError = function (error) {
        // In a real world app, we might use a remote logging infrastructure
        var errMsg;
        if (error instanceof http_1.Response) {
            var body = error.json() || '';
            var err = body.error || JSON.stringify(body);
            errMsg = error.status + " - " + (error.statusText || '') + " " + err;
        }
        else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable_1.Observable.throw(errMsg);
    };
    JobService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], JobService);
    return JobService;
}());
exports.JobService = JobService;
//# sourceMappingURL=jobservice.js.map