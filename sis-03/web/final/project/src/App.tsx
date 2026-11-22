import { useState } from 'react';
import AppHeader from '@/components/AppHeader';
import AvailabilityForm from '@/components/AvailabilityForm';
import AvailabilityResultBanner from '@/components/AvailabilityResult';
import RoomOverview from '@/components/RoomOverview';
import ScenarioControls from '@/components/ScenarioControls';
import TodaysBookings from '@/components/TodaysBookings';
import {
  DEFAULT_CURRENT_TIME,
  DEFAULT_END_TIME,
  DEFAULT_START_TIME,
  baseRoom,
  initialBookings,
} from '@/data/campus';
import {
  checkAvailability,
  formatMinute,
  parseTimeInput,
  type AvailabilityResult,
  type Booking,
  type BookingDraft,
} from '@/lib/availability';

function App() {
  const [currentTime, setCurrentTime] = useState(DEFAULT_CURRENT_TIME);
  const [isBlocked, setIsBlocked] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [startValue, setStartValue] = useState(DEFAULT_START_TIME);
  const [endValue, setEndValue] = useState(DEFAULT_END_TIME);
  const [result, setResult] = useState<AvailabilityResult | null>(null);

  const room = { ...baseRoom, isBlocked };
  const nowMinute = parseTimeInput(currentTime);
  const dateLabel = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const clearResult = () => setResult(null);

  const handleStartChange = (value: string) => {
    setStartValue(value);
    clearResult();
  };

  const handleEndChange = (value: string) => {
    setEndValue(value);
    clearResult();
  };

  const handleCurrentTimeChange = (value: string) => {
    setCurrentTime(value);
    clearResult();
  };

  const handleBlockedChange = (value: boolean) => {
    setIsBlocked(value);
    clearResult();
  };

  const handleSaveBooking = (draft: BookingDraft, id: string | null) => {
    setBookings((previous) =>
      id === null
        ? [...previous, { ...draft, id: `bk-${Date.now()}` }]
        : previous.map((booking) => (booking.id === id ? { ...draft, id } : booking)),
    );
    clearResult();
  };

  const handleRemoveBooking = (id: string) => {
    setBookings((previous) => previous.filter((booking) => booking.id !== id));
    clearResult();
  };

  const handleCheck = () => {
    if (nowMinute === null) {
      setResult({ status: 'unavailable', reasons: ['Enter a valid current time.'] });
      return;
    }

    setResult(
      checkAvailability({
        startMinute: parseTimeInput(startValue),
        endMinute: parseTimeInput(endValue),
        nowMinute,
        room,
        bookings,
      }),
    );
  };

  return (
    <div className="min-h-screen bg-navy-50/60">
      <AppHeader />

      <main className="mx-auto max-w-2xl space-y-6 px-4 py-6 sm:px-6 sm:py-10">
        <RoomOverview room={room} />

        <ScenarioControls
          currentTime={currentTime}
          isBlocked={isBlocked}
          onCurrentTimeChange={handleCurrentTimeChange}
          onBlockedChange={handleBlockedChange}
        />

        <AvailabilityForm
          startValue={startValue}
          endValue={endValue}
          currentTimeLabel={nowMinute === null ? 'not set' : formatMinute(nowMinute)}
          onStartChange={handleStartChange}
          onEndChange={handleEndChange}
          onSubmit={handleCheck}
        />

        {result && <AvailabilityResultBanner result={result} roomName={room.name} />}

        <TodaysBookings
          bookings={bookings}
          dateLabel={dateLabel}
          onSave={handleSaveBooking}
          onRemove={handleRemoveBooking}
        />
      </main>
    </div>
  );
}

export default App;
