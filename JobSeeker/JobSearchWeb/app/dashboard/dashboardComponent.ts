import { Component, OnInit } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'dashboard',
    templateUrl: 'dashboardComponent.html',
    styleUrls:['dashboardComponent.css']
})
export class DashboardComponent implements OnInit {
    constructor() { }

    ngOnInit() { 
        if(localStorage["token"]==null)
        {
            location.replace("/login");
        }
    }
}