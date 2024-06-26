import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { AppointmentService } from '../shared/services/appointment.service';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss']
})
export class AppointmentFormComponent {
  appointmentForm: FormGroup;

  constructor(private fb: FormBuilder, private appointmentService: AppointmentService) {
    this.appointmentForm = this.fb.group({
      title: ['', Validators.required],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endDate: ['', Validators.required],
      endTime: ['', Validators.required]
    }, { validators: this.endDateAfterStartDate });
  }

  addAppointment() {
    if (this.appointmentForm.valid) {
      const startDate = new Date(this.appointmentForm.value.startDate);
      const [startHour, startMinute] = this.appointmentForm.value.startTime.split(':').map(Number);
      startDate.setHours(startHour, startMinute);

      const endDate = new Date(this.appointmentForm.value.endDate);
      const [endHour, endMinute] = this.appointmentForm.value.endTime.split(':').map(Number);
      endDate.setHours(endHour, endMinute);

      const newAppointment = {
        ...this.appointmentForm.value,
        start: startDate,
        end: endDate
      };
      this.appointmentService.addAppointment(newAppointment);
      this.appointmentForm.reset();
    }
  }

  private endDateAfterStartDate(control: AbstractControl): ValidationErrors | null {
    const startDate = new Date(control.get('startDate')?.value);
    const [startHour, startMinute] = control.get('startTime')?.value.split(':').map(Number);
    startDate.setHours(startHour, startMinute);

    const endDate = new Date(control.get('endDate')?.value);
    const [endHour, endMinute] = control.get('endTime')?.value.split(':').map(Number);
    endDate.setHours(endHour, endMinute);

    return endDate > startDate ? null : { endBeforeStart: true };
  }
}
