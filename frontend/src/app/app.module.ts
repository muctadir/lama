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
import { AddUsersModalContent, ProjectCreationComponent } from './project-creation/project-creation.component';
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component';
import { ProjectComponent } from './project/project.component';
import { StatsComponent } from './stats/stats.component';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeManagementComponent } from './theme-management/theme-management.component';
import { SortableThemeHeader } from './sortable-theme.directive';
import { CreateThemeComponent } from './create-theme/create-theme.component';

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
    NavigationMenuComponent,
    ProjectComponent,
    StatsComponent,
    AddUsersModalContent,
    ThemeManagementComponent,
    SortableThemeHeader,
    CreateThemeComponent
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
