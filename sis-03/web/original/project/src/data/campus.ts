import type { Booking, Room } from '@/lib/availability';

export const room: Room = {
  name: 'Library Study Room 2.14',
  location: 'Main Library, Level 2',
  isBlocked: false,
  blockedReason: null,
};

export const todaysBookings: Booking[] = [
  { id: 'bk-1001', title: 'Group Study (C. Lee)', startMinute: 8 * 60 + 30, endMinute: 10 * 60 },
  { id: 'bk-1002', title: 'Research Project (Prof. Adams)', startMinute: 13 * 60, endMinute: 14 * 60 + 30 },
  { id: 'bk-1003', title: 'Thesis Review (M. Okafor)', startMinute: 15 * 60 + 30, endMinute: 16 * 60 + 30 },
];
