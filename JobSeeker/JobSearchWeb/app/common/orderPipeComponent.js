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
var OrderByPipe = (function () {
    function OrderByPipe() {
    }
    OrderByPipe.prototype.transform = function (arr, orderFields) {
        arr.sort(function (currentJob, comparedJob) {
            var field = "";
            var type = 0;
            var a_time;
            var b_time;
            var splits = orderFields.split(' ');
            if (splits.length == 0)
                return 0;
            field = splits[0];
            if (splits.length == 1)
                type = 1;
            else
                type = splits[1] == 'desc' ? -1 : 1;
            if (field == "id") {
                if (currentJob.Id > comparedJob.Id)
                    return type;
                else if (currentJob.Id < comparedJob.Id)
                    return -type;
                return 0;
            }
            else if (field == "url") {
                if (currentJob.URL > comparedJob.URL)
                    return type;
                else if (currentJob.URL < comparedJob.URL)
                    return -type;
                return 0;
            }
            else if (field == "createdate") {
                a_time = new Date(currentJob.CreateDate);
                b_time = new Date(comparedJob.CreateDate);
                if (currentJob.CreateDate > comparedJob.CreateDate)
                    return type;
                else if (currentJob.CreateDate < comparedJob.CreateDate)
                    return -type;
                return 0;
            }
            else if (field = "rank") {
                if (currentJob.Rank > comparedJob.Rank)
                    return type;
                else if (currentJob.Rank < comparedJob.Rank)
                    return -type;
                return 0;
            }
            else
                return 0;
        });
        return arr;
    };
    /*
    1: filter by visited status,
    2: filter by invalid status
     */
    OrderByPipe.prototype.filter = function (arr, filterType) {
        if (filterType == 1) {
            return arr.filter(function (item) { return item.IsUserVisited == 0; }).splice(0);
        }
        if (filterType == 2) {
            return arr.filter(function (item) { return item.IsReportInValid == 0; }).splice(0);
        }
        return arr;
    };
    OrderByPipe = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], OrderByPipe);
    return OrderByPipe;
}());
exports.OrderByPipe = OrderByPipe;
//# sourceMappingURL=orderPipeComponent.js.map