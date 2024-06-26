import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    MatNativeDateModule,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
};