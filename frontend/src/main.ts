import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

/* Sets the environment mode */
if (environment.production) {
  enableProdMode();
}

/* Tries to set the entry point of the application */
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
