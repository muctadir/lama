import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { TestingComponent } from './testing/testing.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountComponent } from './account/account.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ProjectCreationComponent } from './project-creation/project-creation.component';
import { ProjectComponent} from './project/project.component';
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component';
import { StatsComponent } from './stats/stats.component';
import { ThemeManagementComponent } from './theme-management/theme-management.component';
import { CreateThemeComponent } from './create-theme/create-theme.component';
import { SingleThemeViewComponent } from './single-theme-view/single-theme-view.component';

/* All the routes within the application */
const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'testing', component: TestingComponent},
    {path: 'account', component: AccountComponent},
    {path: 'home', component: HomePageComponent},
    {path: 'createProject', component: ProjectCreationComponent},
    {path: 'createTheme', component: CreateThemeComponent},
    {path: 'singleTheme', component: SingleThemeViewComponent},
    {path: 'project', component: ProjectComponent, children: [
      {path: '', redirectTo: 'stats', pathMatch: 'full'},
      {path: 'stats', component: StatsComponent},
      {path: '', outlet: 'side-nav', component: NavigationMenuComponent}
    ]},
    {path: 'theme', component: ThemeManagementComponent},
    {path: '**', redirectTo: 'login', pathMatch: 'full'}];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
