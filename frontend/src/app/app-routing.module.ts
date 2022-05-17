import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestingComponent } from './testing/testing.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ProjectCreationComponent } from './project-creation/project-creation.component';

const routes: Routes = [
  { path: '', component: TestingComponent}, 
  { path: 'home', component: HomePageComponent}, 
  { path: 'createProject', component: ProjectCreationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
