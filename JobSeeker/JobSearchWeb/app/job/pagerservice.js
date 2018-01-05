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
var pager_1 = require('./pager');
var PagerService = (function () {
    function PagerService() {
    }
    PagerService.prototype.getPager = function (totalNum, currentPage, pageSize) {
        if (currentPage === void 0) { currentPage = 1; }
        if (pageSize === void 0) { pageSize = 10; }
        var pager = new pager_1.Pager();
        pager.currentPage = currentPage;
        pager.totalNum = totalNum;
        pager.pageSize = pageSize;
        pager.totalPages = Math.ceil(totalNum / pageSize);
        if (pager.totalPages <= 10) {
            pager.startPage = 1;
            pager.endPage = pager.totalPages;
        }
        else {
            if (currentPage <= 6) {
                pager.startPage = 1;
                pager.endPage = 10;
            }
            else if (currentPage + 4 >= pager.totalPages) {
                pager.startPage = pager.totalPages - 9;
                pager.endPage = pager.totalPages;
            }
            else {
                pager.startPage = currentPage - 5;
                pager.endPage = currentPage + 4;
            }
        }
        pager.startIndex = (currentPage - 1) * pageSize;
        pager.endIndex = Math.min(pager.startIndex + pageSize - 1, totalNum - 1);
        pager.pages = [];
        for (var i = pager.startPage; i < pager.endPage + 1; i++) {
            pager.pages[i - pager.startPage] = i;
        }
        return pager;
    };
    PagerService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], PagerService);
    return PagerService;
}());
exports.PagerService = PagerService;
//# sourceMappingURL=pagerservice.js.map