import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Appointment } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private appointments: Appointment[] = [
    { id: 1, title: 'Task Review', start: new Date(new Date().getTime() + 1 * 60 * 1000), end: new Date(new Date().getTime() + 1 * 60 * 60 * 1000 + 1 * 60 * 1000) },
    { id: 2, title: 'Offer the job to Przemyslaw', start: new Date(new Date().getTime() + 1.5 * 60 * 60 * 1000), end: new Date(new Date().getTime() + 3 * 60 * 60 * 1000 + 1 * 60 * 1000) },
    { id: 3, title: 'Check out the READ ME file', start: new Date(new Date().getTime() + 4.5 * 60 * 60 * 1000), end: new Date(new Date().getTime() + 6 * 60 * 60 * 1000 + 1 * 60 * 1000) }
  ];

  private appointmentsSubject: BehaviorSubject<Appointment[]> = new BehaviorSubject(this.appointments);
  public appointments$: Observable<Appointment[]> = this.appointmentsSubject.asObservable();

  private selectedDateSubject: BehaviorSubject<Date> = new BehaviorSubject(new Date());
  public selectedDate$: Observable<Date> = this.selectedDateSubject.asObservable();

  public filteredAppointments$: Observable<Appointment[]> = combineLatest([this.appointments$, this.selectedDate$]).pipe(
    map(([appointments, selectedDate]) => this.filterAppointments(appointments, selectedDate))
  );

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

  setSelectedDate(date: Date): void {
    this.selectedDateSubject.next(date);
  }

  private filterAppointments(appointments: Appointment[], selectedDate: Date): Appointment[] {
    const selectedDateStart = new Date(selectedDate);
    selectedDateStart.setHours(0, 0, 0, 0);
    const selectedDateEnd = new Date(selectedDate);
    selectedDateEnd.setHours(23, 59, 59, 999);

    return appointments.filter(appointment => {
      const startDate = new Date(appointment.start);
      const endDate = new Date(appointment.end);
      return startDate <= selectedDateEnd && endDate >= selectedDateStart;
    });
  }

  private generateId(): number {
    if (this.appointments.length === 0) {
      return 1;
    }
    const maxId = Math.max(...this.appointments.map(appointment => appointment.id || 0));
    return maxId + 1;
  }
}
