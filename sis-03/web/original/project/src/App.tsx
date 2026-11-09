import { useEffect, useState } from 'react';
import AppHeader from '@/components/AppHeader';
import AvailabilityForm from '@/components/AvailabilityForm';
import AvailabilityResultBanner from '@/components/AvailabilityResult';
import RoomOverview from '@/components/RoomOverview';
import TodaysBookings from '@/components/TodaysBookings';
import { todaysBookings, room } from '@/data/campus';
import {
  checkAvailability,
  formatMinute,
  getDefaultTimeMinutes,
  minutesToInputValue,
  parseTimeInput,
  type AvailabilityResult,
} from '@/lib/availability';

function minuteOfDay(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

function App() {
  const [now, setNow] = useState(() => new Date());
  const [defaults] = useState(() => getDefaultTimeMinutes(minuteOfDay(new Date())));
  const [startValue, setStartValue] = useState(() => minutesToInputValue(defaults.start));
  const [endValue, setEndValue] = useState(() => minutesToInputValue(defaults.end));
  const [result, setResult] = useState<AvailabilityResult | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const nowMinute = minuteOfDay(now);
  const dateLabel = now.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleStartChange = (value: string) => {
    setStartValue(value);
    setResult(null);
  };

  const handleEndChange = (value: string) => {
    setEndValue(value);
    setResult(null);
  };

  const handleCheck = () => {
    setResult(
      checkAvailability({
        startMinute: parseTimeInput(startValue),
        endMinute: parseTimeInput(endValue),
        nowMinute,
        room,
        bookings: todaysBookings,
      }),
    );
  };

  return (
    <div className="min-h-screen bg-navy-50/60">
      <AppHeader />

      <main className="mx-auto max-w-2xl space-y-6 px-4 py-6 sm:px-6 sm:py-10">
        <RoomOverview room={room} />

        <AvailabilityForm
          startValue={startValue}
          endValue={endValue}
          currentTimeLabel={formatMinute(nowMinute)}
          onStartChange={handleStartChange}
          onEndChange={handleEndChange}
          onSubmit={handleCheck}
        />

        {result && <AvailabilityResultBanner result={result} roomName={room.name} />}

        <TodaysBookings bookings={todaysBookings} dateLabel={dateLabel} />
      </main>
    </div>
  );
}

export default App;
