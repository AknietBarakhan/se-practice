import { CalendarDays } from 'lucide-react';
import { formatRange, type Booking } from '@/lib/availability';

interface TodaysBookingsProps {
  bookings: Booking[];
  dateLabel: string;
}

export default function TodaysBookings({ bookings, dateLabel }: TodaysBookingsProps) {
  const sorted = [...bookings].sort((a, b) => a.startMinute - b.startMinute);

  return (
    <section className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-navy-100 sm:p-6">
      <div className="flex items-center gap-2 text-navy-900">
        <CalendarDays className="h-5 w-5 text-navy-600" aria-hidden="true" />
        <h2 className="text-lg font-semibold">Today&apos;s bookings</h2>
      </div>
      <p className="mt-1 text-sm text-slate-500">{dateLabel}</p>

      {sorted.length === 0 ? (
        <p className="mt-5 rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
          No bookings today. The room is free all day.
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {sorted.map((booking) => (
            <li
              key={booking.id}
              className="rounded-xl bg-slate-100 px-4 py-3 transition hover:bg-slate-200/70"
            >
              <p className="text-sm font-semibold text-navy-900">
                {formatRange(booking.startMinute, booking.endMinute)}
              </p>
              <p className="mt-0.5 text-sm text-slate-600">{booking.title}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
