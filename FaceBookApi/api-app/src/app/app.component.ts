import { Component } from '@angular/core';
import {FacebookAPI} from './facebook/api.facebook';
import {LoginResponse} from 'ngx-facebook';
import { FacebookService } from 'ngx-facebook';

import {HomeComponent} from './home/home.component';
import {PostComponent} from './post/post.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[FacebookAPI,FacebookService]
})
export class AppComponent{
  title = 'My First Angular App';
 private loginResponse :LoginResponse=null;

 public constructor(private api : FacebookAPI){
 }
 public ngOnInit(){
    this.api.getStatus().then((response: LoginResponse) =>{this.loginResponse = response})
    .catch((error:any) => console.error(error));
 }

 public logout():void{
   this.api.logout().then((response)=>{this.loginResponse = response})
    .catch((error:any) => console.error(error));
 }

 public login():void{
    this.api.login().then((response: LoginResponse) =>{this.loginResponse = response})
    .catch((error:any) => console.error(error));
 }
 }