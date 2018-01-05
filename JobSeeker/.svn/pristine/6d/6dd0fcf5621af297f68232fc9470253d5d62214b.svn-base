import { User } from './../user/user';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DropdownModule } from 'ng2-dropdown'
@Component({
    moduleId: module.id,
    selector: 'job-index',
    templateUrl: 'indexComponent.html',
    styleUrls: ['indexComponent.css']
})
export class IndexComponent implements OnInit {
    private keywords: string;
   

    constructor(private router: Router) {
        this.keywords = "";
        
    }

    ngOnInit() { }
    redirectToList() {
        if (this.keywords.length > 0)
            this.router.navigate(['/list', { 'keywords': this.keywords }]);
    }


}