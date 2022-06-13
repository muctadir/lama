import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { TestingComponent } from './testing/testing.component';
import { LoginComponent } from './account-details/login/login.component';
import { RegisterComponent } from './account-details/register/register.component';
import { AccountComponent } from './account-details/account/account.component';
import { HomePageComponent } from './home/home-page/home-page.component';
import { ProjectCreationComponent } from './home/project-creation/project-creation.component';
import { ConflictPageComponent } from './conflict/conflict-page/conflict-page.component';
import { ConflictResolutionComponent } from './conflict/conflict-resolution/conflict-resolution.component';
import { ProjectComponent} from './project/project.component';
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component';
import { StatsComponent } from './stats/stats.component';
import { LabellingPageComponent } from './labelling-page/labelling-page.component';
import { LabelFormComponent } from './modals/label-form/label-form.component';
import { ArtifactManagementPageComponent } from './artifact/artifact-management-page/artifact-management-page.component';
import { SingleArtifactViewComponent } from './artifact/single-artifact-view/single-artifact-view.component';
import { LabelManagementComponent } from './label/label-management/label-management.component';
import { IndividualLabelComponent } from './label/individual-label/individual-label.component';
import { ThemeManagementComponent } from './theme/theme-management/theme-management.component';
import { SingleThemeViewComponent } from './theme/single-theme-view/single-theme-view.component';
import { ThemeInfoComponent } from './theme/theme-info/theme-info.component';
import { LoginGuardService } from './login-guard.service';

/* All the routes within the application */
const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'testing', component: TestingComponent},
    {path: 'account', component: AccountComponent, canActivate: [LoginGuardService]},
    {path: 'home', component: HomePageComponent, canActivate: [LoginGuardService]},
    {path: 'createProject', component:ProjectCreationComponent, canActivate: [LoginGuardService]},
    {path: 'project/:projectId', component: ProjectComponent, canActivate: [LoginGuardService], children: [
      {path: '', redirectTo: 'stats', pathMatch: 'full'},
      {path: 'stats', component: StatsComponent, canActivate: [LoginGuardService]},
      {path: 'labelling-page', component: LabellingPageComponent, canActivate: [LoginGuardService]},
      {path: 'create-label', component: LabelFormComponent, canActivate: [LoginGuardService]},
      {path: 'artifactmanagement', component: ArtifactManagementPageComponent, canActivate: [LoginGuardService]},
      {path: 'singleartifact/:artifactId', component: SingleArtifactViewComponent, canActivate: [LoginGuardService]},
      {path: 'labelmanagement', component: LabelManagementComponent, canActivate: [LoginGuardService]},
      {path: 'singlelabel/:labelId', component: IndividualLabelComponent, canActivate: [LoginGuardService]},
      {path: 'thememanagement', component: ThemeManagementComponent, canActivate: [LoginGuardService]},
      {path: 'createTheme', component: ThemeInfoComponent, canActivate: [LoginGuardService]},
      {path: 'singleTheme/:themeId', component: SingleThemeViewComponent, canActivate: [LoginGuardService]},
      {path: 'editTheme/:themeId', component: ThemeInfoComponent, canActivate: [LoginGuardService]},
      {path: 'conflict', component: ConflictPageComponent, canActivate: [LoginGuardService]},
      {path: 'conflictResolution', component: ConflictResolutionComponent, canActivate: [LoginGuardService]},
      {path: '', outlet: 'side-nav', component: NavigationMenuComponent}
    ]},
    {path: '**', redirectTo: 'login', pathMatch: 'full'}];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
