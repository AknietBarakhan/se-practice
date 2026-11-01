import { CheckCircle2, XCircle } from 'lucide-react';
import { formatRange, type AvailabilityResult } from '@/lib/availability';

interface AvailabilityResultProps {
  result: AvailabilityResult;
  roomName: string;
}

export default function AvailabilityResultBanner({ result, roomName }: AvailabilityResultProps) {
  if (result.status === 'available') {
    return (
      <section
        role="status"
        aria-live="polite"
        className="flex items-start gap-4 rounded-2xl bg-green-700 p-5 text-white shadow-card sm:p-6"
      >
        <CheckCircle2 className="mt-0.5 h-8 w-8 shrink-0" aria-hidden="true" />
        <div>
          <p className="text-2xl font-bold leading-tight">Available</p>
          <p className="mt-1 text-sm leading-relaxed text-green-50">
            {roomName} is free from {formatRange(result.startMinute, result.endMinute)}.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      role="status"
      aria-live="polite"
      className="rounded-2xl bg-danger-700 p-5 text-white shadow-card sm:p-6"
    >
      <div className="flex items-start gap-4">
        <XCircle className="mt-0.5 h-8 w-8 shrink-0" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-2xl font-bold leading-tight">Unavailable</p>
          <p className="mt-1 text-sm leading-relaxed text-red-50">
            This time cannot be booked for {roomName}.
          </p>
        </div>
      </div>
      <ul className="mt-4 space-y-2 rounded-xl bg-black/15 p-4 text-sm leading-relaxed">
        {result.reasons.map((reason) => (
          <li key={reason} className="flex gap-2">
            <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
            <span>{reason}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
