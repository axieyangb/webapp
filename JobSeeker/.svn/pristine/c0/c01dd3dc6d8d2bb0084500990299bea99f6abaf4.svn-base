import { DashboardComponent } from './dashboard/dashboardComponent';
import { AppComponent } from './app.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobListComponent } from './list/jobListComponent';
import {IndexComponent} from './index/IndexComponent';
import{LoginComponent} from './account/loginComponent';
const routes: Routes = [
  { path:'',
  pathMatch:'prefix',
redirectTo:'index'},
  {path: 'index', component: IndexComponent },
  { path: 'list', component: JobListComponent},
  {path:'login', component:LoginComponent},
  {path:'dashboard',component:DashboardComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
