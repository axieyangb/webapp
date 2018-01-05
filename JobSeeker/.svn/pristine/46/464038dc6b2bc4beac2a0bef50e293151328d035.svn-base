import { DashboardComponent } from './dashboard/dashboardComponent';
import { OrderByPipe } from './common/orderPipeComponent';

import { JobService } from './job/jobservice';
import { PagerService } from './job/pagerservice';
import { JobListComponent } from './list/jobListComponent';
import { NgModule } from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { HttpModule  } from '@angular/http';
import{FormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing'; //TODO: Create app.routing
import{IndexComponent} from './index/IndexComponent';
import{LoginComponent} from './account/loginComponent';
import {UserService} from './user/userService';
import {DropdownModule} from'ng2-dropdown';
@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        AppRoutingModule,
        FormsModule,
        DropdownModule
    ],
    declarations: [AppComponent,IndexComponent,JobListComponent,LoginComponent,DashboardComponent],
    providers: [JobService,PagerService,UserService,OrderByPipe],
    bootstrap: [AppComponent],
})
export class AppModule { }
