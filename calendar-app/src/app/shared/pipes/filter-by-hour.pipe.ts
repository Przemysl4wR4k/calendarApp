import { Pipe, PipeTransform } from '@angular/core';
import { Appointment } from '../models/appointment.model';

@Pipe({
  name: 'filterByHour',
  standalone: true
})
export class FilterByHourPipe implements PipeTransform {
  transform(appointments: Appointment[], hour: number): Appointment[] {
    return appointments.filter(appointment =>
      new Date(appointment.start).getHours() === hour);
  }
}
