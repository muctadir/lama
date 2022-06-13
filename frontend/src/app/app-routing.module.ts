import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

// Authentication imports
import { LoginComponent } from './account-details/login/login.component';
import { RegisterComponent } from './account-details/register/register.component';
// Account page imports
import { AccountComponent } from './account-details/account/account.component';
// Home page imports
import { HomePageComponent } from './home/home-page/home-page.component';
import { ProjectCreationComponent } from './home/project-creation/project-creation.component';
// Conflict page imports
import { ConflictPageComponent } from './conflict/conflict-page/conflict-page.component';
import { ConflictResolutionComponent } from './conflict/conflict-resolution/conflict-resolution.component';
// Navigation menu imports
import { ProjectComponent} from './project/project-page/project.component';
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component';
// Stats page imports
import { StatsComponent } from './stats/stats.component';
// Labelling page imports
import { LabellingPageComponent } from './labelling-page/labelling-page.component';
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
import { ProjectSettingsComponent } from './project/project-settings/project-settings.component';
/* All the routes within the application */
const routes: Routes = [
  // Default path to login
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  // Authentication routes
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  // Account route
  {path: 'account', component: AccountComponent},
  // Home page route
  {path: 'home', component: HomePageComponent},
  // Project creation route
  {path: 'createProject', component:ProjectCreationComponent},
  // Inside the project routes
  {path: 'project/:projectId', component: ProjectComponent, children: [
    // Default is stats page
    {path: '', redirectTo: 'stats', pathMatch: 'full'},
    // Stats page route
    {path: 'stats', component: StatsComponent},
    // Labelling page route
    {path: 'labelling-page', component: LabellingPageComponent},
    // Create label route
    {path: 'create-label', component: LabelFormComponent},
    // Artifact management route
    {path: 'artifactmanagement', component: ArtifactManagementPageComponent},
    // Single artifact route
    {path: 'singleartifact/:artifactId', component: SingleArtifactViewComponent},
    // Label manegement route
    {path: 'labelmanagement', component: LabelManagementComponent},
    // Single label route
    {path: 'singlelabel/:labelId', component: IndividualLabelComponent},
    // Theme manegement route
    {path: 'thememanagement', component: ThemeManagementComponent},
    // Create theme route
    {path: 'createTheme', component: ThemeInfoComponent},
    // Single theme route
    {path: 'singleTheme/:themeId', component: SingleThemeViewComponent},
    // Edit theme route
    {path: 'editTheme/:themeId', component: ThemeInfoComponent},
    // Conflict route
    {path: 'conflict', component: ConflictPageComponent},
    // Conflict resolution route
    {path: 'conflictResolution', component: ConflictResolutionComponent},
    // Load navigarion menu for every link in project
    {path: '', outlet: 'side-nav', component: NavigationMenuComponent}
  ]},
  {path: '**', redirectTo: 'login', pathMatch: 'full'}];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
