import { useState, type FormEvent } from 'react';
import {
  minutesToInputValue,
  parseTimeInput,
  type Booking,
  type BookingDraft,
} from '@/lib/availability';

interface BookingFormProps {
  booking: Booking | null;
  onSave: (draft: BookingDraft) => void;
  onCancel: () => void;
}

const fieldClass =
  'mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-navy-900 shadow-sm focus:border-navy-600 focus:outline-none focus:ring-4 focus:ring-navy-100';

export default function BookingForm({ booking, onSave, onCancel }: BookingFormProps) {
  const [title, setTitle] = useState(booking?.title ?? '');
  const [startValue, setStartValue] = useState(
    booking ? minutesToInputValue(booking.startMinute) : '',
  );
  const [endValue, setEndValue] = useState(booking ? minutesToInputValue(booking.endMinute) : '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    const startMinute = parseTimeInput(startValue);
    const endMinute = parseTimeInput(endValue);

    if (!trimmedTitle) {
      setError('Enter a name for the booking.');
      return;
    }
    if (startMinute === null || endMinute === null) {
      setError('Choose both a start time and an end time.');
      return;
    }
    if (startMinute >= endMinute) {
      setError('The end time must be later than the start time.');
      return;
    }

    setError(null);
    onSave({ title: trimmedTitle, startMinute, endMinute });
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl bg-navy-50 p-4 ring-1 ring-navy-100"
    >
      <p className="text-sm font-semibold text-navy-900">
        {booking ? 'Edit booking' : 'New booking'}
      </p>

      <label className="block">
        <span className="text-xs font-medium text-slate-700">Name</span>
        <input
          type="text"
          value={title}
          maxLength={80}
          onChange={(event) => setTitle(event.target.value)}
          className={fieldClass}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-medium text-slate-700">Start</span>
          <input
            type="time"
            value={startValue}
            onChange={(event) => setStartValue(event.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-slate-700">End</span>
          <input
            type="time"
            value={endValue}
            onChange={(event) => setEndValue(event.target.value)}
            className={fieldClass}
          />
        </label>
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-700 ring-1 ring-danger-200">
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-navy-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-navy-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-800"
        >
          {booking ? 'Save changes' : 'Add booking'}
        </button>
      </div>
    </form>
  );
}
