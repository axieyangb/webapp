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
var orderPipeComponent_1 = require('./../common/orderPipeComponent');
var jobservice_1 = require('./../job/jobservice');
var job_1 = require('./../job/job');
var User_1 = require('./../user/User');
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var pagerservice_1 = require('./../job/pagerservice');
var JobListComponent = (function () {
    function JobListComponent(jobservice, route, router, pagerservice, order) {
        this.jobservice = jobservice;
        this.route = route;
        this.router = router;
        this.pagerservice = pagerservice;
        this.order = order;
        this.orderType = 0 /* Relevance */;
        this.orderString = '';
        this.hasLoggedIn = false;
        this.filteredByVisitedStatus = false;
        this.fitleredByReportedStatus = false;
        this.listValid = true;
        this.keywords = "";
        this.jobs = [];
        this.oneJob = new job_1.Job();
    }
    JobListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.map(function (a) { return a["keywords"]; }).subscribe(function (a) { _this.keywords = a; });
        if (this.keywords != null)
            this.searchJobs();
        var _user = new User_1.User();
        if (_user.token != null)
            this.hasLoggedIn = true;
    };
    JobListComponent.prototype.getAllJobs = function () {
        var _this = this;
        this.jobservice.getAllJobs().subscribe(function (jobs) { _this.jobs = jobs; _this.setPager(_this.jobs.length); });
    };
    JobListComponent.prototype.searchJobs = function () {
        var _this = this;
        this.router.navigate(['/list', { 'keywords': this.keywords }]);
        if (this.keywords != "") {
            this.listValid = false;
            var user = new User_1.User();
            if (user.token != null) {
                this.jobservice.searchJobsLogged(this.keywords, user.token).subscribe(function (jobs) { _this.jobs = jobs; _this.listValid = true; _this._filter(); _this.setPager(1); });
                this.hasLoggedIn = true;
            }
            else {
                this.jobservice.searchJobs(this.keywords).subscribe(function (jobs) { _this.jobs = jobs; _this.listValid = true; _this._filter(); _this.setPager(1); });
            }
        }
    };
    JobListComponent.prototype.markAsApplied = function (targetJob) {
        if (this.hasLoggedIn) {
            this.jobservice.markAsApplied(targetJob.Id, new User_1.User().token).subscribe(function (res) { targetJob.IsUserApplied = 1; });
        }
    };
    JobListComponent.prototype.showMoreDescription = function (targetJob) {
        this.jobservice.getJobById(targetJob.Id).subscribe(function (oneJob) { targetJob.JobDescription = oneJob.JobDescription; });
        targetJob.IsFullDescriptionShow = true;
    };
    JobListComponent.prototype.hideMoreDescription = function (targetJob) {
        targetJob.JobDescription = (targetJob.JobDescription.length > 100 ? targetJob.JobDescription.substring(0, 100) + "..." : targetJob.JobDescription);
        targetJob.IsFullDescriptionShow = false;
    };
    JobListComponent.prototype.highlightKeywords = function (content) {
        content = content.replace(/</g, "").replace(/>/g, "").replace(/\//g, "").replace(/<mark>/g, "").replace(/<\/mark>/g, "");
        var splits = this.keywords.split(' ');
        for (var index = 0; index < splits.length; index++) {
            var keyItem = splits[index];
            if (keyItem.length > 0) {
                var regex = new RegExp(keyItem, "g");
                content = content.replace(regex, "<mark>" + keyItem + "</mark>");
            }
        }
        return content;
    };
    JobListComponent.prototype.orderByDate = function () {
        this.orderString = 'createdate desc';
        this.filteredJobs = this.order.transform(this.filteredJobs, this.orderString);
        this.orderType = 1 /* Date */;
        this.setPager(1);
    };
    JobListComponent.prototype.orderByRelevent = function () {
        this.orderString = 'rank desc';
        this.filteredJobs = this.order.transform(this.filteredJobs, this.orderString);
        this.orderType = 0 /* Relevance */;
        this.setPager(1);
    };
    JobListComponent.prototype.isNewPosted = function (dateStr) {
        var todayStr = new Date().toJSON().toString();
        return dateStr.substring(0, 10) == todayStr.substring(0, 10);
    };
    JobListComponent.prototype.UpdateThumbsUp = function (oneJob) {
        if (!oneJob.HasThumbsUp) {
            oneJob.HasThumbsUp = true;
            var user = new User_1.User();
            if (user.token != null) {
                this.jobservice.thumbsUpLogged(oneJob.Id, user.token).subscribe(function (res) { return oneJob.ThumbsUpNum++; });
            }
            else {
                this.jobservice.thumbsUp(oneJob.Id).subscribe(function (res) { return oneJob.ThumbsUpNum++; });
            }
        }
    };
    JobListComponent.prototype.UpdateVistedNum = function (oneJob) {
        var user = new User_1.User();
        if (user.token != null) {
            this.jobservice.visitedNumUpdateLogged(oneJob.Id, user.token).subscribe(function (res) { oneJob.VisitedNum++; oneJob.IsUserVisited = 1; });
        }
        else {
            this.jobservice.visitedNumUpdate(oneJob.Id).subscribe(function (res) { oneJob.VisitedNum++; oneJob.IsUserVisited = 1; });
        }
    };
    JobListComponent.prototype.updateInvalidNum = function (oneJob) {
        if (!oneJob.IsReportInValid) {
            oneJob.IsReportInValid = 1;
            var user = new User_1.User();
            if (user.token != null) {
                this.jobservice.invalidNumUpdateLogged(oneJob.Id, user.token).subscribe(function (res) { return oneJob.InValidNum++; });
            }
            else {
                this.jobservice.invalidNumUpdate(oneJob.Id).subscribe(function (res) { return oneJob.InValidNum++; });
            }
        }
    };
    JobListComponent.prototype.setPager = function (currentPage) {
        this.pagerObj = this.pagerservice.getPager(this.filteredJobs.length, currentPage, 10);
        this.pagedJobs = this.filteredJobs.slice(this.pagerObj.startIndex, this.pagerObj.endIndex + 1);
    };
    JobListComponent.prototype.backtoIndex = function () {
        this.router.navigate(['/index']);
    };
    JobListComponent.prototype._filter = function () {
        if (this.filteredByVisitedStatus && !this.fitleredByReportedStatus) {
            this.filteredJobs = this.order.filter(this.jobs, 1);
        }
        else if (!this.filteredByVisitedStatus && this.fitleredByReportedStatus) {
            this.filteredJobs = this.order.filter(this.jobs, 2);
        }
        else if (this.filteredByVisitedStatus && this.fitleredByReportedStatus) {
            this.filteredJobs = this.order.filter(this.jobs, 1);
            this.filteredJobs = this.order.filter(this.filteredJobs, 2);
        }
        else {
            this.filteredJobs = this.jobs.slice(0);
        }
    };
    JobListComponent.prototype.filterByVisitedStatus = function () {
        this.filteredByVisitedStatus = true;
        this._filter();
        this.filteredJobs = this.order.transform(this.filteredJobs, this.orderString);
        this.setPager(1);
    };
    JobListComponent.prototype.fitlerByReportedStatus = function () {
        this.fitleredByReportedStatus = true;
        this._filter();
        this.filteredJobs = this.order.transform(this.filteredJobs, this.orderString);
        this.setPager(1);
    };
    JobListComponent.prototype.cancelFilterByVisitedStatus = function () {
        this.filteredByVisitedStatus = false;
        this._filter();
        this.filteredJobs = this.order.transform(this.filteredJobs, this.orderString);
        this.setPager(1);
    };
    JobListComponent.prototype.cancelFitlerByReportedStatus = function () {
        this.fitleredByReportedStatus = false;
        this._filter();
        this.filteredJobs = this.order.transform(this.filteredJobs, this.orderString);
        this.setPager(1);
    };
    JobListComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'job-list',
            templateUrl: 'jobListComponent.html',
            styleUrls: ['jobListComponent.css']
        }), 
        __metadata('design:paramtypes', [jobservice_1.JobService, router_1.ActivatedRoute, router_1.Router, pagerservice_1.PagerService, orderPipeComponent_1.OrderByPipe])
    ], JobListComponent);
    return JobListComponent;
}());
exports.JobListComponent = JobListComponent;
//# sourceMappingURL=jobListComponent.js.map