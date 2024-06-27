import { FilterByHourPipe } from './filter-by-hour.pipe';
import { Appointment } from '../models/appointment.model';

describe('FilterByHourPipe', () => {
  let pipe: FilterByHourPipe;
  let mockAppointments: Appointment[];

  beforeEach(() => {
    pipe = new FilterByHourPipe();
    mockAppointments = [
      { id: 1, title: 'Task Review', start: new Date('2023-06-27T09:00:00'), end: new Date('2023-06-27T10:00:00') },
      { id: 2, title: 'Offer the job to Przemyslaw', start: new Date('2023-06-27T10:30:00'), end: new Date('2023-06-27T11:30:00') },
      { id: 3, title: 'Check out the READ ME file', start: new Date('2023-06-27T09:15:00'), end: new Date('2023-06-27T09:45:00') },
      { id: 4, title: 'Lunch Break', start: new Date('2023-06-27T12:00:00'), end: new Date('2023-06-27T13:00:00') }
    ];
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should filter appointments by the given hour', () => {
    const filteredAppointments = pipe.transform(mockAppointments, 9);
    expect(filteredAppointments.length).toBe(2);
    expect(filteredAppointments).toEqual([mockAppointments[0], mockAppointments[2]]);
  });

  it('should return an empty array if no appointments match the given hour', () => {
    const filteredAppointments = pipe.transform(mockAppointments, 14);
    expect(filteredAppointments.length).toBe(0);
  });

  it('should handle appointments that start and end on different hours', () => {
    const filteredAppointments = pipe.transform(mockAppointments, 10);
    expect(filteredAppointments.length).toBe(1);
    expect(filteredAppointments[0]).toEqual(mockAppointments[1]);
  });

  it('should handle empty appointments array', () => {
    const filteredAppointments = pipe.transform([], 9);
    expect(filteredAppointments.length).toBe(0);
  });
});
