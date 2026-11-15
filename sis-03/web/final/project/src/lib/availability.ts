export const MAX_DURATION_MINUTES = 120;
export const DAY_MINUTES = 1440;

export interface Room {
  name: string;
  location: string;
  isBlocked: boolean;
  blockedReason: string | null;
}

export interface Booking {
  id: string;
  title: string;
  startMinute: number;
  endMinute: number;
}

export type BookingDraft = Omit<Booking, 'id'>;

export type AvailabilityResult =
  | { status: 'available'; startMinute: number; endMinute: number }
  | { status: 'unavailable'; reasons: string[] };

export interface AvailabilityInput {
  startMinute: number | null;
  endMinute: number | null;
  nowMinute: number;
  room: Room;
  bookings: Booking[];
}

export function parseTimeInput(value: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

export function formatMinute(minute: number): string {
  const normalized = minute % DAY_MINUTES;
  const hours24 = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  const period = hours24 < 12 ? 'AM' : 'PM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
}

export function formatRange(startMinute: number, endMinute: number): string {
  return `${formatMinute(startMinute)} – ${formatMinute(endMinute)}`;
}

export function checkAvailability({
  startMinute,
  endMinute,
  nowMinute,
  room,
  bookings,
}: AvailabilityInput): AvailabilityResult {
  if (startMinute === null || endMinute === null) {
    return { status: 'unavailable', reasons: ['Choose both a start time and an end time.'] };
  }

  if (startMinute >= endMinute) {
    return {
      status: 'unavailable',
      reasons: ['The end time must be later than the start time.'],
    };
  }

  const reasons: string[] = [];

  if (startMinute <= nowMinute) {
    reasons.push(
      `The start time must be later than the current time (${formatMinute(nowMinute)}).`,
    );
  }

  const duration = endMinute - startMinute;
  if (duration > MAX_DURATION_MINUTES) {
    reasons.push(
      `A booking can be at most ${MAX_DURATION_MINUTES} minutes (2 hours). Your selection is ${duration} minutes.`,
    );
  }

  if (room.isBlocked) {
    reasons.push(room.blockedReason ?? `${room.name} is blocked and cannot be booked.`);
  }

  for (const booking of bookings) {
    const overlaps = startMinute < booking.endMinute && booking.startMinute < endMinute;
    if (overlaps) {
      reasons.push(
        `It overlaps ${booking.title} (${formatRange(booking.startMinute, booking.endMinute)}).`,
      );
    }
  }

  if (reasons.length > 0) {
    return { status: 'unavailable', reasons };
  }

  return { status: 'available', startMinute, endMinute };
}

export function minutesToInputValue(minute: number): string {
  const hours = Math.floor(minute / 60);
  const minutes = minute % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
