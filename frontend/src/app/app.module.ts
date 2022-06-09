import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Imports all the different user made pages */
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestingComponent } from './testing/testing.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountComponent } from './account/account.component';
import { AccountInformationFormComponent } from './account-information-form/account-information-form.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AddUsersModalContent, ProjectCreationComponent } from './project-creation/project-creation.component';
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component';
import { ProjectComponent } from './project/project.component';
import { StatsComponent } from './stats/stats.component';
import { LabellingPageComponent } from './labelling-page/labelling-page.component';
import { LabelFormComponent } from './label-form/label-form.component';
import { ArtifactManagementPageComponent } from './artifact-management-page/artifact-management-page.component';
import { SingleArtifactViewComponent } from './single-artifact-view/single-artifact-view.component';
import { AddArtifactComponent } from './add-artifact/add-artifact.component';
import { LabelManagementComponent } from './label-management/label-management.component';
import { MergeLabelFormComponent } from './merge-label-form/merge-label-form.component';
import { IndividualLabelComponent } from './individual-label/individual-label.component';
import { ConflictPageComponent } from './conflict-page/conflict-page.component';
import { ConflictResolutionComponent } from './conflict-resolution/conflict-resolution.component';
import { ThemeManagementComponent } from './theme-management/theme-management.component';
import { SortableThemeHeader } from './sortable-theme.directive';
import { CreateThemeComponent } from './create-theme/create-theme.component';
import { SingleThemeViewComponent } from './single-theme-view/single-theme-view.component';
import { EditThemeComponent } from './edit-theme/edit-theme.component';

/* Imports bootstrap */
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LogoutComponent } from './logout/logout.component';
import { EditAccountSettingsComponent } from './edit-account-settings/edit-account-settings.component';
import { AccountChangePasswordComponent } from './account-change-password/account-change-password.component';
import { AccountInformationComponent } from './account-information/account-information.component';

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
    AddUsersModalContent,
    ConflictPageComponent,
    ConflictResolutionComponent,
    NavigationMenuComponent,
    ProjectComponent,
    StatsComponent,
    AddUsersModalContent,
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
