// import { ApplicationConfig } from '@angular/core';
// import { provideRouter } from '@angular/router';

// import { routes } from './app.routes';
// import { provideClientHydration } from '@angular/platform-browser';

// export const appConfig: ApplicationConfig = {
//   providers: [provideRouter(routes), provideClientHydration()]
// };


// src/app/app.config.ts

import { ApplicationConfig } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { appRoutes } from './app.routes';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withViewTransitions()),
    provideHttpClient(withFetch()),
    provideAnimations()
  ]
};

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideRouter(appRoutes),
//     provideHttpClient(
//       withInterceptors([AuthInterceptor])
//     )
//   ]
// };