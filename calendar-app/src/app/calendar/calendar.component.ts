import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { AppointmentService } from '../shared/services/appointment.service';
import { Appointment } from '../shared/models/appointment.model';
import { Observable } from 'rxjs';
import { FilterByHourPipe } from '../shared/pipes/filter-by-hour.pipe';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, MatDatepickerModule, MatNativeDateModule, MatCardModule, FilterByHourPipe],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  selectedDate: Date = new Date();
  appointments$: Observable<Appointment[]>;
  filteredAppointments: Appointment[] = [];
  hours: number[] = Array.from({ length: 24 }, (_, i) => i);

  constructor(private appointmentService: AppointmentService) {
    this.appointments$ = this.appointmentService.getAppointments();
  }

  ngOnInit() {
    this.appointments$.subscribe(appointments => {
      console.log('All appointments:', appointments);
      this.filterAppointments();
    });
    this.filterAppointments();
  }

  dateChanged(date: Date) {
    this.selectedDate = date;
    console.log('Selected date:', date);
    this.filterAppointments();
  }

  filterAppointments() {
    if (this.selectedDate) {
      this.appointments$.subscribe(appointments => {
        this.filteredAppointments = appointments.filter(appointment => {
          const startDate = new Date(appointment.start);
          const endDate = new Date(appointment.end);
          const selectedDateStart = new Date(this.selectedDate);
          selectedDateStart.setHours(0, 0, 0, 0);
          const selectedDateEnd = new Date(this.selectedDate);
          selectedDateEnd.setHours(23, 59, 59, 999);
          return (startDate <= selectedDateEnd && endDate >= selectedDateStart);
        });
        console.log('Filtered appointments:', this.filteredAppointments);
      });
    } else {
      this.filteredAppointments = [];
    }
  }

  calculateHeight(appointment: Appointment): number {
    const startTime = new Date(appointment.start).getTime();
    const endTime = new Date(appointment.end).getTime();
    const duration = (endTime - startTime) / 60000; // duration in minutes
    return (duration / 60) * 100; // convert to percentage of an hour slot height
  }

  calculateTopPosition(appointment: Appointment): number {
    return (appointment.start.getMinutes() / 60) * 100;
  }
}
