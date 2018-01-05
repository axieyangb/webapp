import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { User } from '../user/user';
import { UserService } from '../user/userservice';
import { Router } from '@angular/router';
@Component({
    moduleId: module.id,
    selector: 'job-account',
    templateUrl: 'loginComponent.html',
    styleUrls: ['loginComponent.css'],
    providers: [UserService]
})
export class LoginComponent implements OnInit {
    private user: User = new User();
    private inputPassword: boolean = false;
    private isExisted: boolean = true;
    private errorType = 0;
    private iconNames: string[];
    private iconUrl: string;
    private isInProgress:boolean=false;
    constructor(private userservice: UserService, private router: Router) {
        this.iconNames = [];
        for (var i = 1; i < 10; i++) {
            this.iconNames.push("man" + i);
            this.iconNames.push("woman" + i);
        }
        this.iconUrl = "content/imgs/user.png";

    }

    ngOnInit() {

    }
    generateIcon() {
        if (this.inputPassword) {
            let num = Math.floor(Math.random() * 10 + 1);
            this.iconUrl = "content/imgs/usericons/" + this.iconNames[num] + ".png";
        }
        else {
            this.iconUrl = "content/imgs/user.png";
        }
    }
    login() {
        this.isInProgress=true;
        this.userservice.login(this.user).subscribe(
            res => {
                localStorage.setItem("token", res.access_token);
                localStorage.setItem("username", this.user.username);
                this.user.token = res.access_token;
                this.errorType = 0;
                this.router.navigate(['/index']);
                this.isInProgress=false;
            },
            err => {
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                if (err.status == 400) {
                    this.errorType = 1;
                }
                else {
                    this.errorType = 2;
                }
                this.isInProgress=false;
            }
        );
    }

    next() {
        if (this.user.username.length > 0) {
            this.findUser();
        }
    }

    back() {
        this.inputPassword = false;
        this.generateIcon();
        this.errorType = 0;
    }
    findUser() {
          this.isInProgress=true;
        this.userservice.findUser(this.user).subscribe(res => { this.isExisted = res; this.inputPassword = res; this.generateIcon();this.isInProgress=false; });
    }
    GetBtnContent(defaultName:string):string
    {
       if(this.isInProgress)
       return "Verifying...";
       else 
       return defaultName;

    }

}