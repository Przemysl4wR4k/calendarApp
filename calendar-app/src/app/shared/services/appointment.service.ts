import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private appointments: Appointment[] = [
    // przykładowe dane
    { id: 1, title: 'Spotkanie 1', start: new Date(2022, 7, 22, 10, 0), end: new Date(2022, 7, 22, 11, 0) },
    { id: 2, title: 'Spotkanie 2', start: new Date(2022, 7, 22, 11, 30), end: new Date(2022, 7, 22, 12, 30) }
  ];

  private appointmentsSubject: BehaviorSubject<Appointment[]> = new BehaviorSubject(this.appointments);
  public appointments$: Observable<Appointment[]> = this.appointmentsSubject.asObservable();

  constructor() {}

  getAppointments(): Observable<Appointment[]> {
    return this.appointments$;
  }

  addAppointment(appointment: Appointment): void {
    appointment.id = this.generateId();
    this.appointments.push(appointment);
    this.appointmentsSubject.next(this.appointments);
  }

  updateAppointment(updatedAppointment: Appointment): void {
    const index = this.appointments.findIndex(appointment => appointment.id === updatedAppointment.id);
    if (index !== -1) {
      this.appointments[index] = updatedAppointment;
      this.appointmentsSubject.next(this.appointments);
    }
  }

  deleteAppointment(id: number): void {
    this.appointments = this.appointments.filter(appointment => appointment.id !== id);
    this.appointmentsSubject.next(this.appointments);
  }

  private generateId(): number {
    if (this.appointments.length === 0) {
      return 1;
    }
    const maxId = Math.max(...this.appointments.map(appointment => appointment.id || 0));
    return maxId + 1;
  }
}
