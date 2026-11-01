import { Clock, Search } from 'lucide-react';

interface AvailabilityFormProps {
  startValue: string;
  endValue: string;
  currentTimeLabel: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  onSubmit: () => void;
}

const fieldClass =
  'mt-2 block w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-base text-navy-900 shadow-sm transition focus:border-navy-600 focus:outline-none focus:ring-4 focus:ring-navy-100';

export default function AvailabilityForm({
  startValue,
  endValue,
  currentTimeLabel,
  onStartChange,
  onEndChange,
  onSubmit,
}: AvailabilityFormProps) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-navy-100 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold text-navy-900">Check availability</h2>
        <p className="text-sm text-slate-500">Today, now {currentTimeLabel}</p>
      </div>

      <form
        noValidate
        className="mt-5 space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Start time</span>
            <span className="relative block">
              <Clock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                type="time"
                name="start"
                value={startValue}
                onChange={(event) => onStartChange(event.target.value)}
                className={`${fieldClass} pl-10`}
              />
            </span>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">End time</span>
            <span className="relative block">
              <Clock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                type="time"
                name="end"
                value={endValue}
                onChange={(event) => onEndChange(event.target.value)}
                className={`${fieldClass} pl-10`}
              />
            </span>
          </label>
        </div>

        <p className="text-sm text-slate-500">Bookings can be up to 2 hours long.</p>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy-700 px-5 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-navy-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-navy-200 active:scale-[0.99]"
        >
          <Search className="h-5 w-5" aria-hidden="true" />
          Check availability
        </button>
      </form>
    </section>
  );
}
