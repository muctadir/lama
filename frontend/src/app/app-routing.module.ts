import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestingComponent } from './testing/testing.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountComponent } from './account/account.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ProjectCreationComponent } from './project-creation/project-creation.component';
import { ArtifactManagementPageComponent } from './artifact-management-page/artifact-management-page.component';
import { SingleArtifactViewComponent } from './single-artifact-view/single-artifact-view.component';

const routes: Routes = [{path: '', component: LoginComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'testing', component: TestingComponent},
    {path: 'account', component: AccountComponent},
    {path: 'home', component: HomePageComponent},
    {path: 'createProject', component:ProjectCreationComponent},
    {path: 'artifactmanagement', component:ArtifactManagementPageComponent},
    {path: 'singleartifact', component:SingleArtifactViewComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
