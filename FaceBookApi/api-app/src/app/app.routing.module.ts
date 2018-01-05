import { RouterModule, Routes } from '@angular/router';
import { NgModule }              from '@angular/core';

import {HomeComponent} from './home/home.component';
import {PostComponent} from './post/post.component';
const appRoutes :Routes =[
{path:"home", component: HomeComponent},
{path:"post", component: PostComponent}
]

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {}