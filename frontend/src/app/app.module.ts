import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Imports all the different user made pages */
// App imports
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// Authentication imports
import { LoginComponent } from './account-details/login/login.component';
import { RegisterComponent } from './account-details/register/register.component';
import { LogoutComponent } from './modals/logout/logout.component';
// Account imports
import { AccountComponent } from './account-details/account/account.component';
import { AccountInformationFormComponent } from './account-details/account-information-form/account-information-form.component';
import { EditAccountSettingsComponent } from './account-details/edit-account-settings/edit-account-settings.component';
import { AccountChangePasswordComponent } from './account-details/account-change-password/account-change-password.component';
import { AccountInformationComponent } from './account-details/account-information/account-information.component';
// Home page imports
import { HomePageComponent } from './home/home-page/home-page.component';
import { ProjectCreationComponent } from './home/project-creation/project-creation.component';
import { AddUsersModalComponent } from './modals/add-users-modal/add-users-modal.component';
import { ProjectSettingsComponent } from './project/project-settings/project-settings.component';
// Navigation menu import
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component';
import { ProjectComponent } from './project/project-page/project.component';
// Statistic page import
import { StatsComponent } from './stats/stats.component';
// Labelling page import
import { LabellingPageComponent } from './labelling/labelling-page/labelling-page.component';
// Label page imports
import { LabelFormComponent } from './modals/label-form/label-form.component';
import { LabelManagementComponent } from './label/label-management/label-management.component';
import { MergeLabelFormComponent } from './modals/merge-label-form/merge-label-form.component';
import { IndividualLabelComponent } from './label/individual-label/individual-label.component';
// Artifact pages imports
import { ArtifactManagementPageComponent } from './artifact/artifact-management-page/artifact-management-page.component';
import { SingleArtifactViewComponent } from './artifact/single-artifact-view/single-artifact-view.component';
import { AddArtifactComponent } from './modals/add-artifact/add-artifact.component';
// Conflict page imports
import { ConflictPageComponent } from './conflict/conflict-page/conflict-page.component';
import { ConflictResolutionComponent } from './conflict/conflict-resolution/conflict-resolution.component';
// Theme page imports
import { ThemeManagementComponent } from './theme/theme-management/theme-management.component';
import { SingleThemeViewComponent } from './theme/single-theme-view/single-theme-view.component';
import { ThemeInfoComponent } from './theme/theme-info/theme-info.component';

/* Imports bootstrap */
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IndividualLabellingForm } from './labelling/individual-labelling-form/individual-labelling-form.component';

@NgModule({
  declarations: [
    // App components
    AppComponent,
    // Authentication components
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    // Account components
    AccountComponent,
    AccountInformationFormComponent,
    EditAccountSettingsComponent,
    AccountChangePasswordComponent,
    AccountInformationComponent,
    // Home page components
    HomePageComponent,
    ProjectCreationComponent,
    AddUsersModalComponent,
    ProjectSettingsComponent,
    // Conflic page components
    ConflictPageComponent,
    ConflictResolutionComponent,
    // Navigation menu components
    NavigationMenuComponent,
    ProjectComponent,
    // Stats page components
    StatsComponent,
    // Labelling page components
    LabellingPageComponent,
    LabelFormComponent,
    // Artifact page component
    ArtifactManagementPageComponent,
    SingleArtifactViewComponent,
    AddArtifactComponent,
    // Label page component
    LabelManagementComponent,
    IndividualLabelComponent,
    MergeLabelFormComponent,
    // Theme page component
    ThemeManagementComponent,
    SingleThemeViewComponent,
    IndividualLabellingForm,
    ThemeInfoComponent,
    SingleThemeViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [
    AppComponent]
})
export class AppModule { }
