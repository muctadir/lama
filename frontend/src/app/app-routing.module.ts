import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { TestingComponent } from './testing/testing.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountComponent } from './account/account.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ProjectCreationComponent } from './project-creation/project-creation.component';


const routes: Routes = [{path: '', component: LoginComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'testing', component: TestingComponent},
    {path: 'account', component: AccountComponent},
    {path: 'home', component: HomePageComponent},
    {path: 'createProject', component:ProjectCreationComponent}];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
