import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Observable } from 'rxjs';
import { Appointment } from '../shared/models/appointment.model';
import { FilterByHourPipe } from '../shared/pipes/filter-by-hour.pipe';
import { AppointmentService } from '../shared/services/appointment.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, MatDatepickerModule, MatNativeDateModule, MatCardModule, FilterByHourPipe, DragDropModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  selectedDate$: Observable<Date>;
  filteredAppointments$: Observable<Appointment[]>;
  hours: number[] = Array.from({ length: 24 }, (_, i) => i);

  constructor(private appointmentService: AppointmentService) {
    this.selectedDate$ = this.appointmentService.selectedDate$;
    this.filteredAppointments$ = this.appointmentService.filteredAppointments$;
  }

  onDateChange(date: Date) {
    this.appointmentService.setSelectedDate(date);
  }

  calculateHeight(appointment: Appointment): number {
    const startTime = new Date(appointment.start).getTime();
    const endTime = new Date(appointment.end).getTime();
    const duration = (endTime - startTime) / 60000; // in minutes
    return (duration / 60) * 100; // percentage height
  }

  calculateTopPosition(appointment: Appointment): number {
    const startDate = new Date(appointment.start);
    return (startDate.getHours() * 60 + startDate.getMinutes()) / (24 * 60) * 100;
  }

  drop(event: CdkDragDrop<Appointment[]>) {
    const appointment: Appointment = event.item.data;
    const originalAppointment = this.appointmentService.getAppointmentById(appointment.id);
    if (originalAppointment) {
      const duration = new Date(originalAppointment.end).getTime() - new Date(originalAppointment.start).getTime();
      const newStart = new Date(originalAppointment.start);
      newStart.setMinutes(newStart.getMinutes() + event.distance.y);
      const newEnd = new Date(newStart.getTime() + duration);

      this.appointmentService.updateAppointment({
        ...originalAppointment,
        start: newStart,
        end: newEnd
      });
    }
  }

  deleteAppointment(id: number) {
    this.appointmentService.deleteAppointment(id);
  }
}
