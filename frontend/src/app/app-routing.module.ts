import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginGuardService } from './services/login-guard.service';

// Authentication imports
import { LoginComponent } from './account-details/login/login.component';
import { RegisterComponent } from './account-details/register/register.component';
// Account page imports
import { AccountComponent } from './account-details/account/account.component';
// Home page imports
import { HomePageComponent } from './home/home-page/home-page.component';
// Project creation imports
import { ProjectCreationComponent } from './home/project-creation/project-creation.component';
// Project edit imports
import { ProjectSettingsComponent } from './project/project-settings/project-settings.component';
// Conflict page imports
import { ConflictPageComponent } from './conflict/conflict-page/conflict-page.component';
import { ConflictResolutionComponent } from './conflict/conflict-resolution/conflict-resolution.component';
// Navigation menu imports
import { ProjectComponent} from './project/project-page/project.component';
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component';
// Stats page imports
import { StatsComponent } from './stats/stats.component';
// Labelling page imports
import { LabellingPageComponent } from './labelling/labelling-page/labelling-page.component';
// Label page imports
import { LabelFormComponent } from './modals/label-form/label-form.component';
import { LabelManagementComponent } from './label/label-management/label-management.component';
import { IndividualLabelComponent } from './label/individual-label/individual-label.component';
// Artifact page imports
import { ArtifactManagementPageComponent } from './artifact/artifact-management-page/artifact-management-page.component';
import { SingleArtifactViewComponent } from './artifact/single-artifact-view/single-artifact-view.component';
// Theme page imports
import { ThemeManagementComponent } from './theme/theme-management/theme-management.component';
import { SingleThemeViewComponent } from './theme/single-theme-view/single-theme-view.component';
import { ThemeInfoComponent } from './theme/theme-info/theme-info.component';


/* All the routes within the application */
const routes: Routes = [
    // Default path to login
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    // Authentication routes
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    // Account route
    {path: 'account', component: AccountComponent, canActivate: [LoginGuardService]},
    // Home page route
    {path: 'home', component: HomePageComponent, canActivate: [LoginGuardService]},
    // Project creation route
    {path: 'createProject', component:ProjectCreationComponent, canActivate: [LoginGuardService]},
    // Inside the project routes
    {path: 'project/:projectId', component: ProjectComponent, canActivate: [LoginGuardService], children: [
      // Default is stats page
      {path: '', redirectTo: 'stats', pathMatch: 'full'},
      // Project settings page
      {path: 'settings', component: ProjectSettingsComponent},
      // Stats page route
      {path: 'stats', component: StatsComponent, canActivate: [LoginGuardService]},
      // Labelling page route
      {path: 'labelling-page', component: LabellingPageComponent, canActivate: [LoginGuardService]},
      // Create label route
      {path: 'create-label', component: LabelFormComponent, canActivate: [LoginGuardService]},
      // Artifact management route
      {path: 'artifactmanagement', component: ArtifactManagementPageComponent, canActivate: [LoginGuardService]},
      // Single artifact route
      {path: 'singleartifact/:artifactId', component: SingleArtifactViewComponent, canActivate: [LoginGuardService]},
      // Label management route
      {path: 'labelmanagement', component: LabelManagementComponent, canActivate: [LoginGuardService]},
      // Single label route
      {path: 'singlelabel/:labelId', component: IndividualLabelComponent, canActivate: [LoginGuardService]},
      // Theme management route
      {path: 'thememanagement', component: ThemeManagementComponent, canActivate: [LoginGuardService]},
      // Create theme route
      {path: 'createTheme', component: ThemeInfoComponent, canActivate: [LoginGuardService]},
      // Single theme route
      {path: 'singleTheme/:themeId', component: SingleThemeViewComponent, canActivate: [LoginGuardService]},
      // Edit theme route
      {path: 'editTheme/:themeId', component: ThemeInfoComponent, canActivate: [LoginGuardService]},
      // Conflict route
      {path: 'conflict', component: ConflictPageComponent, canActivate: [LoginGuardService]},
      // Conflict resolution route
      {path: 'conflictResolution', component: ConflictResolutionComponent, canActivate: [LoginGuardService]},
      // Load navigarion menu for every link in project
      {path: '', outlet: 'side-nav', component: NavigationMenuComponent}
    ]},
    {path: '**', redirectTo: 'login', pathMatch: 'full'}];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
