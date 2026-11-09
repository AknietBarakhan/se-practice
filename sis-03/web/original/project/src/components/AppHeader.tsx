import { CalendarCheck } from 'lucide-react';

export default function AppHeader() {
  return (
    <header className="bg-navy-800 text-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-2xl items-center gap-3 px-4 sm:px-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
          <CalendarCheck className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="leading-tight">
          <p className="text-base font-semibold">Smart Campus</p>
          <p className="text-xs text-navy-100/80">Room Availability Checker</p>
        </div>
      </div>
    </header>
  );
}
