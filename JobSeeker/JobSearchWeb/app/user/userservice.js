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
var UserService = (function () {
    function UserService(http) {
        this.http = http;
        this._jobLoginUrl = "http://35.163.86.156/jobsearch";
        this._optionsJSON = new http_1.RequestOptions({
            headers: new http_1.Headers({
                "Content-Type": "application/json"
            })
        });
        this._optionsForm = new http_1.RequestOptions({
            headers: new http_1.Headers({
                "Content-Type": "application/x-www-form-urlencoded"
            })
        });
    }
    UserService.prototype.login = function (user) {
        var params = "username=" + user.username + "&password=" + user.password + "&grant_type=" + user.grant_type;
        return this.http.post(this._jobLoginUrl + "/token", params, this._optionsForm).map(function (res) { return res.json(); });
    };
    UserService.prototype.findUser = function (user) {
        return this.http.post(this._jobLoginUrl + "/account/finduser", { "username": user.username }, this._optionsJSON).map(function (res) { return res.json(); }).catch(this.handleError);
    };
    UserService.prototype.register = function (user) {
        return this.http.post(this._jobLoginUrl + "/account/Register", { "UserName": user.username, "Password": user.password, "ConfirmPassword": user.confirmpassword, "Email": user.email, "PhoneNumber": user.phonenumber }, this._optionsJSON)
            .map(function (res) { return res.status; }).catch(this.handleError);
    };
    UserService.prototype.handleError = function (error) {
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
    UserService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
//# sourceMappingURL=userservice.js.map