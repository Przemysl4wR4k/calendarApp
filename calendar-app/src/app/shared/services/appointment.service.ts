import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private appointments: Appointment[] = [
    { id: 1, title: 'Task Review', start: new Date(new Date().getTime() + 1 * 60 * 1000), end: new Date(new Date().getTime() + 1 * 60 * 60 * 1000 + 1 * 60 * 1000) },
    { id: 2, title: 'Offer the job to Przemyslaw', start: new Date(new Date().getTime() + 1.5 * 60 * 60 * 1000), end: new Date(new Date().getTime() + 3 * 60 * 60 * 1000 + 1 * 60 * 1000) }
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
