import { OrderByPipe } from './../common/orderPipeComponent';

import { JobService } from './../job/jobservice';
import { Job } from './../job/job';
import { Pager } from './../job/pager';
import { User } from './../user/User';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PagerService } from './../job/pagerservice'
const enum OrderType {
    Relevance = 0,
    Date = 1
}

@Component({
    moduleId: module.id,
    selector: 'job-list',
    templateUrl: 'jobListComponent.html',
    styleUrls: ['jobListComponent.css']
})

export class JobListComponent implements OnInit {
    jobs: Job[];
    filteredJobs:Job[];
    pagerObj: Pager;
    pagedJobs: Job[];
    oneJob: Job;
    keywords: string;
    listValid: boolean;
    orderType: OrderType = OrderType.Relevance;
    orderString: string = '';
    hasLoggedIn:boolean=false;
    filteredByVisitedStatus:boolean=false;
    fitleredByReportedStatus:boolean=false;
    constructor(
        private jobservice: JobService,
        private route: ActivatedRoute,
        private router: Router,
        private pagerservice: PagerService,
        private order: OrderByPipe
    ) {
        this.listValid = true;
        this.keywords = "";
        this.jobs = [];
        this.oneJob = new Job();
    }
    ngOnInit() {
        this.route.params.map(a => a["keywords"]).subscribe(a => { this.keywords = a });
        if (this.keywords != null)
            this.searchJobs();
        let _user = new User();
        if(_user.token!=null) this.hasLoggedIn=true;
    }

    getAllJobs(): void {
        this.jobservice.getAllJobs().subscribe(jobs => { this.jobs = jobs; this.setPager(this.jobs.length) });
    }
    searchJobs(): void {
        this.router.navigate(['/list', { 'keywords': this.keywords }]);
        if (this.keywords != "") {
            this.listValid = false;
            let user = new User();
            if (user.token != null) {
                this.jobservice.searchJobsLogged(this.keywords, user.token).subscribe(jobs => { this.jobs = jobs;this.listValid = true; this._filter();this.setPager(1) });
                this.hasLoggedIn=true;
            }
            else {
                this.jobservice.searchJobs(this.keywords).subscribe(jobs => { this.jobs = jobs; this.listValid = true; this._filter(); this.setPager(1) });
            }
        }
    }
    markAsApplied(targetJob:Job):void
    {
            if (this.hasLoggedIn) {
                this.jobservice.markAsApplied(targetJob.Id, new User().token).subscribe(res=>{targetJob.IsUserApplied=1});
            }
    }
    showMoreDescription(targetJob: Job): void {
        this.jobservice.getJobById(targetJob.Id).subscribe(oneJob => { targetJob.JobDescription = oneJob.JobDescription; });
        targetJob.IsFullDescriptionShow = true;
    }
    hideMoreDescription(targetJob: Job): void {
        targetJob.JobDescription = (targetJob.JobDescription.length > 100 ? targetJob.JobDescription.substring(0, 100) + "..." : targetJob.JobDescription);
        targetJob.IsFullDescriptionShow = false;
    }
    highlightKeywords(content: string) {
        content = content.replace(/</g, "").replace(/>/g, "").replace(/\//g, "").replace(/<mark>/g, "").replace(/<\/mark>/g, "");
        let splits: string[] = this.keywords.split(' ');
        for (var index = 0; index < splits.length; index++) {
            let keyItem = splits[index];
            if (keyItem.length > 0) {
                let regex = new RegExp(keyItem, "g");
                content = content.replace(regex, "<mark>" + keyItem + "</mark>");
            }
        }
        return content;
    }
    orderByDate() {
        this.orderString = 'createdate desc';
        this.filteredJobs = this.order.transform(this.filteredJobs, this.orderString);     
        this.orderType = OrderType.Date;
        this.setPager(1);

    }
    orderByRelevent(): void {
        this.orderString = 'rank desc';
        this.filteredJobs = this.order.transform(this.filteredJobs, this.orderString);       
        this.orderType = OrderType.Relevance;
        this.setPager(1);
    }
    isNewPosted(dateStr: string): boolean {
        let todayStr: string = new Date().toJSON().toString();
        return dateStr.substring(0, 10) == todayStr.substring(0, 10);
    }

    UpdateThumbsUp(oneJob: Job) {
        if (!oneJob.HasThumbsUp) {
            oneJob.HasThumbsUp = true;
            let user = new User();
            if (user.token != null) {
                this.jobservice.thumbsUpLogged(oneJob.Id, user.token).subscribe(res => oneJob.ThumbsUpNum++);
            }
            else {
                this.jobservice.thumbsUp(oneJob.Id).subscribe(res => oneJob.ThumbsUpNum++);
            }
        }
    }
    UpdateVistedNum(oneJob: Job) {
        let user = new User();
        if (user.token != null) {
            this.jobservice.visitedNumUpdateLogged(oneJob.Id, user.token).subscribe(res => {oneJob.VisitedNum++;oneJob.IsUserVisited=1});
        }
        else {
            this.jobservice.visitedNumUpdate(oneJob.Id).subscribe(res => {oneJob.VisitedNum++;oneJob.IsUserVisited=1});
        }
    }
    updateInvalidNum(oneJob: Job) {
        if (!oneJob.IsReportInValid) {
            oneJob.IsReportInValid = 1;
            let user = new User();
            if (user.token != null) {
                this.jobservice.invalidNumUpdateLogged(oneJob.Id, user.token).subscribe(res => oneJob.InValidNum++);
            }
            else {
                this.jobservice.invalidNumUpdate(oneJob.Id).subscribe(res => oneJob.InValidNum++);
            }
        }
    }
    setPager(currentPage: number) {
        this.pagerObj = this.pagerservice.getPager(this.filteredJobs.length, currentPage, 10);
        this.pagedJobs = this.filteredJobs.slice(this.pagerObj.startIndex, this.pagerObj.endIndex + 1);
    }
    backtoIndex() {
        this.router.navigate(['/index']);
    }

    _filter()
    {
        if(this.filteredByVisitedStatus && !this.fitleredByReportedStatus)
        {
          this.filteredJobs= this.order.filter(this.jobs,1);
        }
        else if(!this.filteredByVisitedStatus && this.fitleredByReportedStatus){
            this.filteredJobs= this.order.filter(this.jobs,2);
        }
        else if(this.filteredByVisitedStatus && this.fitleredByReportedStatus){
            this.filteredJobs= this.order.filter(this.jobs,1);
            this.filteredJobs= this.order.filter(this.filteredJobs,2);
        }
        else {
            this.filteredJobs=this.jobs.slice(0);
        }
    }
    filterByVisitedStatus()
    {
        this.filteredByVisitedStatus=true;
        this._filter();
         this.filteredJobs = this.order.transform(this.filteredJobs, this.orderString);   
         this.setPager(1);
    }
   fitlerByReportedStatus()
    {
        this.fitleredByReportedStatus=true;
        this._filter();
         this.filteredJobs = this.order.transform(this.filteredJobs, this.orderString);   
         this.setPager(1);
    }
    cancelFilterByVisitedStatus()
    {
        this.filteredByVisitedStatus=false;
        this._filter();
         this.filteredJobs = this.order.transform(this.filteredJobs, this.orderString);   
         this.setPager(1);
    }
    cancelFitlerByReportedStatus(){
        this.fitleredByReportedStatus=false;
        this._filter();
         this.filteredJobs = this.order.transform(this.filteredJobs, this.orderString);   
         this.setPager(1);
    }
}