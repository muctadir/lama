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
import { IndividualLabellingForm } from './labelling/individual-labelling-form/individual-labelling-form.component';
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
// History imports
import { HistoryComponent } from './modals/history/history.component';
import { ThemeVisualComponent } from './theme/theme-visual/theme-visual.component';
// Toast imports
import { ToastGlobalComponent } from './modals/toast-global/toast-global.component';
import { ToastsContainer } from './modals/toast-global/toast-container.component';
import { ToastCommService } from './services/toast-comm.service';
// Account moderation imports
import { ModerationComponent } from './account-details/moderation/moderation.component';
import { ConfirmModalComponent } from './modals/confirm-modal/confirm-modal.component';

/* Imports bootstrap */
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    // App components
    AppComponent,
    // Authentication components
    LoginComponent,
    RegisterComponent,
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
    IndividualLabellingForm,
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
    ThemeInfoComponent,
    SingleThemeViewComponent,    
    ThemeVisualComponent,
    // Other components
    ModerationComponent,
    HistoryComponent,
    ToastGlobalComponent,
    ToastsContainer,
    ConfirmModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [ToastCommService],
  bootstrap: [AppComponent]
})
export class AppModule { }
