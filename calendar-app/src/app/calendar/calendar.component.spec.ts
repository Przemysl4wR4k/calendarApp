import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarComponent } from './calendar.component';
import { AppointmentService } from '../shared/services/appointment.service';
import { of } from 'rxjs';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { FilterByHourPipe } from '../shared/pipes/filter-by-hour.pipe';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let appointmentService: AppointmentService;

  const mockAppointments = [
    { id: 1, title: 'Task Review', start: new Date(), end: new Date(new Date().getTime() + 60 * 60 * 1000) },
    { id: 2, title: 'Offer the job to Przemyslaw', start: new Date(), end: new Date(new Date().getTime() + 60 * 60 * 1000) },
  ];

  beforeEach(async () => {
    const appointmentServiceStub = {
      getAppointments: jasmine.createSpy('getAppointments').and.returnValue(of(mockAppointments)),
      selectedDate$: of(new Date()),
      filteredAppointments$: of(mockAppointments),
      setSelectedDate: jasmine.createSpy('setSelectedDate'),
      updateAppointment: jasmine.createSpy('updateAppointment'),
      deleteAppointment: jasmine.createSpy('deleteAppointment'),
      getAppointmentById: jasmine.createSpy('getAppointmentById').and.callFake((id: number) => mockAppointments.find(app => app.id === id))
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, MatDatepickerModule, MatCardModule, CalendarComponent, FilterByHourPipe],
      providers: [{ provide: AppointmentService, useValue: appointmentServiceStub }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    appointmentService = TestBed.inject(AppointmentService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setSelectedDate on date change', () => {
    const newDate = new Date(2021, 1, 1);
    component.onDateChange(newDate);
    expect(appointmentService.setSelectedDate).toHaveBeenCalledWith(newDate);
  });

  it('should calculate the correct height for an appointment', () => {
    const appointment = { id: 1, title: 'Task Review', start: new Date(), end: new Date(new Date().getTime() + 60 * 60 * 1000) };
    const height = component.calculateHeight(appointment);
    expect(height).toBe(100);
  });

  it('should calculate the correct top position for an appointment', () => {
    const appointment = { id: 1, title: 'Task Review', start: new Date(new Date().setHours(1, 0, 0, 0)), end: new Date(new Date().setHours(2, 0, 0, 0)) };
    const topPosition = component.calculateTopPosition(appointment);
    expect(topPosition).toBeCloseTo(4.1667, 4);
  });

  it('should update appointment on drop', () => {
    const event: CdkDragDrop<any> = {
      previousIndex: 0,
      currentIndex: 0,
      //@ts-ignore
      item: { data: mockAppointments[0] },
      container: {} as any,
      previousContainer: {} as any,
      isPointerOverContainer: true,
      distance: { x: 0, y: 30 }
    };

    component.drop(event);

    expect(appointmentService.getAppointmentById).toHaveBeenCalledWith(mockAppointments[0].id);
    const updatedAppointment = {
      ...mockAppointments[0],
      start: new Date(mockAppointments[0].start.getTime() + 30 * 60000),
      end: new Date(mockAppointments[0].end.getTime() + 30 * 60000)
    };
    expect(appointmentService.updateAppointment).toHaveBeenCalledWith(updatedAppointment);
  });

  it('should delete appointment', () => {
    component.deleteAppointment(mockAppointments[0].id);
    expect(appointmentService.deleteAppointment).toHaveBeenCalledWith(mockAppointments[0].id);
  });
});
