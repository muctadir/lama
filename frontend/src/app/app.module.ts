import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Imports all the different user made pages */
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestingComponent } from './testing/testing.component';
import { LoginComponent } from './account-details/login/login.component';
import { RegisterComponent } from './account-details/register/register.component';
import { AccountComponent } from './account-details/account/account.component';
import { AccountInformationFormComponent } from './account-details/account-information-form/account-information-form.component';
import { HomePageComponent } from './home/home-page/home-page.component';
import { ProjectCreationComponent } from './home/project-creation/project-creation.component';
import { AddUsersModalComponent } from './modals/add-users-modal/add-users-modal.component';
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component';
import { ProjectComponent } from './project/project.component';
import { StatsComponent } from './stats/stats.component';
import { LabellingPageComponent } from './labelling-page/labelling-page.component';
import { LabelFormComponent } from './modals/label-form/label-form.component';
import { ArtifactManagementPageComponent } from './artifact/artifact-management-page/artifact-management-page.component';
import { SingleArtifactViewComponent } from './artifact/single-artifact-view/single-artifact-view.component';
import { AddArtifactComponent } from './modals/add-artifact/add-artifact.component';
import { LabelManagementComponent } from './label/label-management/label-management.component';
import { MergeLabelFormComponent } from './modals/merge-label-form/merge-label-form.component';
import { IndividualLabelComponent } from './label/individual-label/individual-label.component';
import { ConflictPageComponent } from './conflict/conflict-page/conflict-page.component';
import { ConflictResolutionComponent } from './conflict/conflict-resolution/conflict-resolution.component';
import { ThemeManagementComponent } from './theme/theme-management/theme-management.component';
import { SortableThemeHeader } from './sortable-theme.directive';
import { CreateThemeComponent } from './theme/create-theme/create-theme.component';
import { SingleThemeViewComponent } from './theme/single-theme-view/single-theme-view.component';
import { EditThemeComponent } from './theme/edit-theme/edit-theme.component';

/* Imports bootstrap */
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LogoutComponent } from './modals/logout/logout.component';
import { EditAccountSettingsComponent } from './account-details/edit-account-settings/edit-account-settings.component';
import { AccountChangePasswordComponent } from './account-details/account-change-password/account-change-password.component';
import { AccountInformationComponent } from './account-details/account-information/account-information.component';

@NgModule({
  declarations: [
    AppComponent,
    TestingComponent,
    LoginComponent,
    RegisterComponent,
    AccountComponent,
    AccountInformationFormComponent,
    HomePageComponent,
    ProjectCreationComponent,
    AddUsersModalComponent,
    ConflictPageComponent,
    ConflictResolutionComponent,
    NavigationMenuComponent,
    ProjectComponent,
    StatsComponent,
    LabellingPageComponent,
    LabelFormComponent,
    ArtifactManagementPageComponent,
    SingleArtifactViewComponent,
    AddArtifactComponent,
    LabelManagementComponent,
    MergeLabelFormComponent,
    IndividualLabelComponent,
    ThemeManagementComponent,
    SortableThemeHeader,
    CreateThemeComponent,
    SingleThemeViewComponent,
    EditThemeComponent,
    AddUsersModalComponent,
    LogoutComponent,
    EditAccountSettingsComponent,
    AccountChangePasswordComponent,
    AccountInformationComponent
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
