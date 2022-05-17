import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestingComponent } from './testing/testing.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ProjectCreationComponent } from './project-creation/project-creation.component';

@NgModule({
  declarations: [
    AppComponent,
    TestingComponent,
    HomePageComponent,
    ProjectCreationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
