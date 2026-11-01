import type { Booking, Room } from '@/lib/availability';

export const baseRoom: Room = {
  name: 'Library Study Room 2.14',
  location: 'Main Library, Level 2',
  isBlocked: false,
  blockedReason: null,
};

export const initialBookings: Booking[] = [
  { id: 'bk-1001', title: 'Group Study (C. Lee)', startMinute: 10 * 60, endMinute: 11 * 60 },
];

export const DEFAULT_CURRENT_TIME = '09:00';
export const DEFAULT_START_TIME = '11:00';
export const DEFAULT_END_TIME = '12:00';
