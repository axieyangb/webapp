import { FacebookService, LoginResponse,InitParams  } from 'ngx-facebook';
import {Injectable} from '@angular/core';

@Injectable()
export class FacebookAPI {
 public constructor(private facebookService : FacebookService){
   let initParams: InitParams = {
      appId: '1957139314519171',
      xfbml: true,
      version: 'v2.9'
    };
 
    facebookService.init(initParams);
 }

 public login(): Promise<LoginResponse>{
      return this.facebookService.login();
 }
 public getStatus():Promise<LoginResponse>{
     return this.facebookService.getLoginStatus();
 }

 public logout():Promise<any>{
   return this.facebookService.logout();
 }
}