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
        this.filteredAppointments = appointments.filter(appointment =>
          new Date(appointment.start).toDateString() === this.selectedDate.toDateString());
        console.log('Filtered appointments:', this.filteredAppointments);
      });
    } else {
      this.filteredAppointments = [];
    }
  }

  calculateHeight(appointment: Appointment): number {
    const duration = (new Date(appointment.end).getTime() - new Date(appointment.start).getTime()) / 3600000;
    return duration * 100;
  }
}
