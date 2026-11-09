import { Clock } from 'lucide-react';

interface ScenarioControlsProps {
  currentTime: string;
  isBlocked: boolean;
  onCurrentTimeChange: (value: string) => void;
  onBlockedChange: (value: boolean) => void;
}

export default function ScenarioControls({
  currentTime,
  isBlocked,
  onCurrentTimeChange,
  onBlockedChange,
}: ScenarioControlsProps) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-navy-100 sm:p-6">
      <h2 className="text-lg font-semibold text-navy-900">Test scenario</h2>
      <p className="mt-1 text-sm text-slate-500">Set the time of day and the room status used for checks.</p>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Current time</span>
          <span className="relative mt-2 block">
            <Clock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="time"
              value={currentTime}
              onChange={(event) => onCurrentTimeChange(event.target.value)}
              className="block w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-base text-navy-900 shadow-sm focus:border-navy-600 focus:outline-none focus:ring-4 focus:ring-navy-100"
            />
          </span>
        </label>

        <div>
          <span id="room-blocked-label" className="text-sm font-medium text-slate-700">
            Room is blocked
          </span>
          <div className="mt-2 flex h-[50px] items-center justify-between rounded-xl border border-slate-300 bg-white px-3">
            <span className="text-sm text-slate-600">{isBlocked ? 'Blocked' : 'Open'}</span>
            <button
              type="button"
              role="switch"
              aria-checked={isBlocked}
              aria-labelledby="room-blocked-label"
              onClick={() => onBlockedChange(!isBlocked)}
              className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition focus:outline-none focus-visible:ring-4 focus-visible:ring-navy-100 ${
                isBlocked ? 'bg-danger-700' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                  isBlocked ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
