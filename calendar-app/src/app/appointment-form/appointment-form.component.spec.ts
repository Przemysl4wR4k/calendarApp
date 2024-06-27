import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppointmentFormComponent } from './appointment-form.component';
import { AppointmentService } from '../shared/services/appointment.service';
import { ReactiveFormsModule, FormsModule, FormGroupDirective } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('AppointmentFormComponent', () => {
  let component: AppointmentFormComponent;
  let fixture: ComponentFixture<AppointmentFormComponent>;
  let appointmentService: AppointmentService;

  beforeEach(async () => {
    const appointmentServiceStub = {
      addAppointment: jasmine.createSpy('addAppointment')
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonModule,
        NoopAnimationsModule,
        AppointmentFormComponent
      ],
      providers: [{ provide: AppointmentService, useValue: appointmentServiceStub }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentFormComponent);
    component = fixture.componentInstance;
    appointmentService = TestBed.inject(AppointmentService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid form when all fields are filled correctly', () => {
    component.appointmentForm.setValue({
      title: 'New Appointment',
      startDate: '2023-06-27',
      startTime: '10:00',
      endDate: '2023-06-27',
      endTime: '11:00'
    });
    expect(component.appointmentForm.valid).toBeTrue();
  });

  it('should have an invalid form when required fields are missing', () => {
    component.appointmentForm.setValue({
      title: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: ''
    });
    expect(component.appointmentForm.valid).toBeFalse();
  });

  it('should have an invalid form when end date is before start date', () => {
    component.appointmentForm.setValue({
      title: 'Invalid Appointment',
      startDate: '2023-06-27',
      startTime: '11:00',
      endDate: '2023-06-27',
      endTime: '10:00'
    });
    expect(component.appointmentForm.valid).toBeFalse();
  });

  it('should call addAppointment when form is submitted', () => {
    const formDirective = jasmine.createSpyObj('FormGroupDirective', ['resetForm']);
    component.appointmentForm.setValue({
      title: 'New Appointment',
      startDate: '2023-06-27',
      startTime: '10:00',
      endDate: '2023-06-27',
      endTime: '11:00'
    });

    component.addAppointment(formDirective);

    expect(appointmentService.addAppointment).toHaveBeenCalled();
  });

  it('should reset the form after submission', () => {
    const formDirective = jasmine.createSpyObj('FormGroupDirective', ['resetForm']);
    spyOn(component.appointmentForm, 'reset');
    component.appointmentForm.setValue({
      title: 'New Appointment',
      startDate: '2023-06-27',
      startTime: '10:00',
      endDate: '2023-06-27',
      endTime: '11:00'
    });

    component.addAppointment(formDirective);

    expect(formDirective.resetForm).toHaveBeenCalled();
    expect(component.appointmentForm.reset).toHaveBeenCalled();
  });
});
