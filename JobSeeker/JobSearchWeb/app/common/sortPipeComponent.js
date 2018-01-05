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
var OrderPipe = (function () {
    function OrderPipe() {
    }
    OrderPipe.prototype.transform = function (arr, orderFields) {
        arr.sort(function (currentJob, comparedJob) {
            var field = "";
            var type = 0;
            var a_time;
            var b_time;
            var splits = orderFields.split(' ');
            console.log(orderFields);
            if (splits.length == 0)
                return arr;
            field = splits[0];
            if (splits.length == 1)
                type = 1;
            else
                type = splits[1] == 'desc' ? -1 : 1;
            if (field == "id") {
                if (currentJob.Id > comparedJob.Id)
                    return type;
                else if (currentJob.Id < comparedJob.Id)
                    return 0 - type;
                return 0;
            }
            else if (field == "url") {
                if (currentJob.URL > comparedJob.URL)
                    return type;
                else if (currentJob.URL < comparedJob.URL)
                    return 0 - type;
                return 0;
            }
            else if (field == "createdate") {
                a_time = new Date(currentJob.CreateDate);
                b_time = new Date(comparedJob.CreateDate);
                if (currentJob.CreateDate > comparedJob.CreateDate)
                    return type;
                else if (currentJob.CreateDate < comparedJob.CreateDate)
                    return 0 - type;
                return 0;
            }
            else if (field == "lastupdatedate") {
                a_time = new Date(currentJob.LastUpdateDate);
                b_time = new Date(comparedJob.LastUpdateDate);
                if (currentJob.LastUpdateDate > comparedJob.LastUpdateDate)
                    return type;
                else if (currentJob.LastUpdateDate < comparedJob.LastUpdateDate)
                    return 0 - type;
                return 0;
            }
            else
                return 0;
        });
        return arr;
    };
    OrderPipe = __decorate([
        core_1.Pipe({
            name: 'orderPipe'
        }), 
        __metadata('design:paramtypes', [])
    ], OrderPipe);
    return OrderPipe;
}());
exports.OrderPipe = OrderPipe;
//# sourceMappingURL=sortPipeComponent.js.map