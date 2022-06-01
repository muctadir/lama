import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestingComponent } from './testing/testing.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountComponent } from './account/account.component';
import { AccountInformationFormComponent } from './account-information-form/account-information-form.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AddUsersModalContent } from './project-creation/project-creation.component';
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component';
import { ProjectComponent } from './project/project.component';
import { StatsComponent } from './stats/stats.component';
import { ProjectCreationComponent } from './project-creation/project-creation.component';
import { LabelManagementComponent } from './label-management/label-management.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateLabelFormComponent } from './create-label-form/create-label-form.component';
import { MergeLabelFormComponent } from './merge-label-form/merge-label-form.component';
import { IndividualLabelComponent } from './individual-label/individual-label.component';
import { EditLabelFormComponent } from './edit-label-form/edit-label-form.component';

import { ConflictPageComponent } from './conflict-page/conflict-page.component';
import { ConflictResolutionComponent } from './conflict-resolution/conflict-resolution.component';

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
    LabelManagementComponent,
    CreateLabelFormComponent,
    MergeLabelFormComponent,
    IndividualLabelComponent,
    EditLabelFormComponent
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
