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
require('./rxjs-operators');
var user_1 = require('./user/user');
var router_1 = require('@angular/router');
var AppComponent = (function () {
    function AppComponent(router) {
        var _this = this;
        this.router = router;
        this.user = new user_1.User();
        this.currentRouter = "";
        router.events.subscribe(function (res) { _this.currentRouter = res.url; _this.refreshLoginStatus(); });
    }
    ;
    AppComponent.prototype.refreshLoginStatus = function () {
        this.user = new user_1.User();
        var iconNames = [];
        for (var i = 1; i < 10; i++) {
            iconNames.push("man" + i);
            iconNames.push("woman" + i);
        }
        var num = Math.floor(Math.random() * 10 + 1);
        this.iconUrl = "content/imgs/usericons/" + iconNames[num] + ".png";
    };
    AppComponent.prototype.logout = function () {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        this.user = new user_1.User();
        location.reload();
    };
    AppComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'jobs-app',
            templateUrl: 'app.component.html',
            styleUrls: ['app.component.css']
        }), 
        __metadata('design:paramtypes', [router_1.Router])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map