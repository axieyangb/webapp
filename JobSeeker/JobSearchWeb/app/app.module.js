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
var dashboardComponent_1 = require('./dashboard/dashboardComponent');
var orderPipeComponent_1 = require('./common/orderPipeComponent');
var jobservice_1 = require('./job/jobservice');
var pagerservice_1 = require('./job/pagerservice');
var jobListComponent_1 = require('./list/jobListComponent');
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var http_1 = require('@angular/http');
var forms_1 = require('@angular/forms');
var app_component_1 = require('./app.component');
var app_routing_1 = require('./app.routing'); //TODO: Create app.routing
var IndexComponent_1 = require('./index/IndexComponent');
var loginComponent_1 = require('./account/loginComponent');
var userService_1 = require('./user/userService');
var ng2_dropdown_1 = require('ng2-dropdown');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                http_1.HttpModule,
                app_routing_1.AppRoutingModule,
                forms_1.FormsModule,
                ng2_dropdown_1.DropdownModule
            ],
            declarations: [app_component_1.AppComponent, IndexComponent_1.IndexComponent, jobListComponent_1.JobListComponent, loginComponent_1.LoginComponent, dashboardComponent_1.DashboardComponent],
            providers: [jobservice_1.JobService, pagerservice_1.PagerService, userService_1.UserService, orderPipeComponent_1.OrderByPipe],
            bootstrap: [app_component_1.AppComponent],
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map