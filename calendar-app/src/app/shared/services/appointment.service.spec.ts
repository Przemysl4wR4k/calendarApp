import { TestBed } from '@angular/core/testing';
import { AppointmentService } from './appointment.service';
import { Appointment } from '../models/appointment.model';

describe('AppointmentService', () => {
  let service: AppointmentService;
  let mockAppointments: Appointment[];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppointmentService);
    mockAppointments = [
      { id: 1, title: 'Task Review', start: new Date(), end: new Date(new Date().getTime() + 60 * 60 * 1000) },
      { id: 2, title: 'Offer the job to Przemyslaw', start: new Date(new Date().getTime() + 1.5 * 60 * 60 * 1000), end: new Date(new Date().getTime() + 3 * 60 * 60 * 1000) }
    ];
    (service as unknown as { appointments: Appointment[] }).appointments = mockAppointments;
    (service as unknown as { appointmentsSubject: { next: (appointments: Appointment[]) => void } }).appointmentsSubject.next(mockAppointments);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all appointments', (done) => {
    service.getAppointments().subscribe(appointments => {
      expect(appointments.length).toBe(2);
      expect(appointments).toEqual(mockAppointments);
      done();
    });
  });

  it('should add a new appointment', (done) => {
    const newAppointment: Appointment = { id: 3, title: 'New Appointment', start: new Date(), end: new Date(new Date().getTime() + 2 * 60 * 60 * 1000) };
    service.addAppointment(newAppointment);

    service.getAppointments().subscribe(appointments => {
      expect(appointments.length).toBe(3);
      expect(appointments).toContain(newAppointment);
      done();
    });
  });

  it('should update an existing appointment', (done) => {
    const updatedAppointment: Appointment = { id: 1, title: 'Updated Task Review', start: new Date(), end: new Date(new Date().getTime() + 1.5 * 60 * 60 * 1000) };
    service.updateAppointment(updatedAppointment);

    service.getAppointments().subscribe(appointments => {
      const appointment = appointments.find(a => a.id === updatedAppointment.id);
      expect(appointment).toEqual(updatedAppointment);
      done();
    });
  });

  it('should delete an appointment', (done) => {
    service.deleteAppointment(1);

    service.getAppointments().subscribe(appointments => {
      expect(appointments.length).toBe(1);
      expect(appointments.find(a => a.id === 1)).toBeUndefined();
      done();
    });
  });

  it('should set and get selected date', () => {
    const newDate = new Date(2021, 1, 1);
    service.setSelectedDate(newDate);
    expect(service.getSelectedDate()).toEqual(newDate);
  });

  it('should filter appointments by selected date', (done) => {
    const selectedDate = new Date();
    service.setSelectedDate(selectedDate);
    
    service.filteredAppointments$.subscribe(filteredAppointments => {
      expect(filteredAppointments.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should get appointment by id', () => {
    const appointment = service.getAppointmentById(1);
    expect(appointment).toEqual(mockAppointments[0]);
  });

  it('should return undefined for non-existing appointment id', () => {
    const appointment = service.getAppointmentById(999);
    expect(appointment).toBeUndefined();
  });
});
