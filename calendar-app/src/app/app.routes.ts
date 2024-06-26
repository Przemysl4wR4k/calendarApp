import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/calendar', pathMatch: 'full' },
  { path: 'calendar', loadComponent: () => import('./calendar/calendar.component').then(m => m.CalendarComponent) },
  { path: 'add-appointment', loadComponent: () => import('./appointment-form/appointment-form.component').then(m => m.AppointmentFormComponent) }
];
