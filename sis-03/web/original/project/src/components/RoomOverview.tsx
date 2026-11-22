import { DoorOpen, MapPin } from 'lucide-react';
import type { Room } from '@/lib/availability';

interface RoomOverviewProps {
  room: Room;
}

export default function RoomOverview({ room }: RoomOverviewProps) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-navy-100 sm:p-6">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-700">
          <DoorOpen className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Selected room</p>
          <h1 className="mt-1 text-xl font-semibold leading-tight text-navy-900 sm:text-2xl">{room.name}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{room.location}</span>
          </p>
        </div>
      </div>
      <div className="mt-4">
        {room.isBlocked ? (
          <span className="inline-flex items-center rounded-full bg-danger-50 px-3 py-1 text-sm font-medium text-danger-700 ring-1 ring-danger-200">
            Blocked for booking
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-800 ring-1 ring-green-100">
            Open for booking
          </span>
        )}
      </div>
    </section>
  );
}
