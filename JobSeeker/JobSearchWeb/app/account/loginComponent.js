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
var user_1 = require('../user/user');
var userservice_1 = require('../user/userservice');
var router_1 = require('@angular/router');
var LoginComponent = (function () {
    function LoginComponent(userservice, router) {
        this.userservice = userservice;
        this.router = router;
        this.user = new user_1.User();
        this.inputPassword = false;
        this.isExisted = true;
        this.errorType = 0;
        this.isInProgress = false;
        this.iconNames = [];
        for (var i = 1; i < 10; i++) {
            this.iconNames.push("man" + i);
            this.iconNames.push("woman" + i);
        }
        this.iconUrl = "content/imgs/user.png";
    }
    LoginComponent.prototype.ngOnInit = function () {
    };
    LoginComponent.prototype.generateIcon = function () {
        if (this.inputPassword) {
            var num = Math.floor(Math.random() * 10 + 1);
            this.iconUrl = "content/imgs/usericons/" + this.iconNames[num] + ".png";
        }
        else {
            this.iconUrl = "content/imgs/user.png";
        }
    };
    LoginComponent.prototype.login = function () {
        var _this = this;
        this.isInProgress = true;
        this.userservice.login(this.user).subscribe(function (res) {
            localStorage.setItem("token", res.access_token);
            localStorage.setItem("username", _this.user.username);
            _this.user.token = res.access_token;
            _this.errorType = 0;
            _this.router.navigate(['/index']);
            _this.isInProgress = false;
        }, function (err) {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            if (err.status == 400) {
                _this.errorType = 1;
            }
            else {
                _this.errorType = 2;
            }
            _this.isInProgress = false;
        });
    };
    LoginComponent.prototype.next = function () {
        if (this.user.username.length > 0) {
            this.findUser();
        }
    };
    LoginComponent.prototype.back = function () {
        this.inputPassword = false;
        this.generateIcon();
        this.errorType = 0;
    };
    LoginComponent.prototype.findUser = function () {
        var _this = this;
        this.isInProgress = true;
        this.userservice.findUser(this.user).subscribe(function (res) { _this.isExisted = res; _this.inputPassword = res; _this.generateIcon(); _this.isInProgress = false; });
    };
    LoginComponent.prototype.GetBtnContent = function (defaultName) {
        if (this.isInProgress)
            return "Verifying...";
        else
            return defaultName;
    };
    LoginComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'job-account',
            templateUrl: 'loginComponent.html',
            styleUrls: ['loginComponent.css'],
            providers: [userservice_1.UserService]
        }), 
        __metadata('design:paramtypes', [userservice_1.UserService, router_1.Router])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=loginComponent.js.map