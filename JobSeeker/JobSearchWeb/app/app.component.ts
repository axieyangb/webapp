import { Component,OnInit } from '@angular/core';
import './rxjs-operators';
import { User } from './user/user';
import { Router } from '@angular/router';
@Component({
    moduleId: module.id,
    selector: 'jobs-app',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css']
})
export class AppComponent {
    keywords: string;
    private user: User = new User();;
    private iconUrl: string;
    private currentRouter:string="";
    constructor(
        private router: Router
    ) 
    {
        router.events.subscribe((res)=>
        {this.currentRouter=res.url;this.refreshLoginStatus();});
       
    }
    private refreshLoginStatus()
    {
         this.user = new User();
        let iconNames = [];
        for (var i = 1; i < 10; i++) {
            iconNames.push("man" + i);
            iconNames.push("woman" + i);
        }
        let num = Math.floor(Math.random() * 10 + 1);
        this.iconUrl = "content/imgs/usericons/" + iconNames[num] + ".png";
    }
    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        this.user = new User();
        location.reload();
    }
}
