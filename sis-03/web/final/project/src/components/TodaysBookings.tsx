import { useState } from 'react';
import { CalendarDays, Pencil, Plus, Trash2 } from 'lucide-react';
import BookingForm from '@/components/BookingForm';
import { formatRange, type Booking, type BookingDraft } from '@/lib/availability';

interface TodaysBookingsProps {
  bookings: Booking[];
  dateLabel: string;
  onSave: (draft: BookingDraft, id: string | null) => void;
  onRemove: (id: string) => void;
}

type EditorState = { mode: 'new' } | { mode: 'edit'; booking: Booking } | null;

export default function TodaysBookings({ bookings, dateLabel, onSave, onRemove }: TodaysBookingsProps) {
  const [editor, setEditor] = useState<EditorState>(null);
  const sorted = [...bookings].sort((a, b) => a.startMinute - b.startMinute);

  const handleSave = (draft: BookingDraft) => {
    onSave(draft, editor?.mode === 'edit' ? editor.booking.id : null);
    setEditor(null);
  };

  return (
    <section className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-navy-100 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-navy-900">
            <CalendarDays className="h-5 w-5 text-navy-600" aria-hidden="true" />
            <h2 className="text-lg font-semibold">Today&apos;s bookings</h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">{dateLabel}</p>
        </div>
        {editor === null && (
          <button
            type="button"
            onClick={() => setEditor({ mode: 'new' })}
            className="inline-flex items-center gap-1.5 rounded-lg bg-navy-50 px-3 py-2 text-sm font-semibold text-navy-700 ring-1 ring-navy-100 transition hover:bg-navy-100"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add booking
          </button>
        )}
      </div>

      {editor && (
        <div className="mt-5">
          <BookingForm
            key={editor.mode === 'edit' ? editor.booking.id : 'new'}
            booking={editor.mode === 'edit' ? editor.booking : null}
            onSave={handleSave}
            onCancel={() => setEditor(null)}
          />
        </div>
      )}

      {sorted.length === 0 ? (
        <p className="mt-5 rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
          No bookings today. The room is free all day.
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {sorted.map((booking) => (
            <li
              key={booking.id}
              className="flex items-center gap-3 rounded-xl bg-slate-100 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-navy-900">
                  {formatRange(booking.startMinute, booking.endMinute)}
                </p>
                <p className="mt-0.5 truncate text-sm text-slate-600">{booking.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditor({ mode: 'edit', booking })}
                aria-label={`Edit ${booking.title}`}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-white hover:text-navy-700"
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onRemove(booking.id)}
                aria-label={`Remove ${booking.title}`}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-white hover:text-danger-700"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
