import { useState } from 'react';
import { ROOMS } from './rooms';
import { filterRooms } from './filter';
import { checkRoom } from './booking';

const ALL_EQUIPMENT = ['projector', 'whiteboard', 'video-conference'];

const toMinutes = (value: string) => {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
};

const fmt = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

export default function App() {
  const [attendees, setAttendees] = useState(1);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [roomId, setRoomId] = useState(ROOMS[0].id);
  const [now, setNow] = useState('09:00');
  const [start, setStart] = useState('11:00');
  const [end, setEnd] = useState('12:00');
  const [endOfDay, setEndOfDay] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const matchingRooms = filterRooms(ROOMS, {
    attendees,
    equipment: selectedEquipment,
  });

  const effectiveRoomId = matchingRooms.some((r) => r.id === roomId)
    ? roomId
    : (matchingRooms[0]?.id ?? '');

  const selectedRoom = matchingRooms.find((r) => r.id === effectiveRoomId);

  function evaluateRoom(targetRoomId: string) {
    if (!targetRoomId) {
      setResult(null);
      return;
    }
    if (!start || !now || (!end && !endOfDay)) {
      setResult(null);
      setError('Fill in the current time, the start and the end.');
      return;
    }
    const s = toMinutes(start);
    const e = endOfDay ? 1440 : toMinutes(end);
    const n = toMinutes(now);

    if (!(s < e)) {
      setError('The end time must be after the start time.');
    } else {
      setError('');
    }

    const ok = checkRoom(ROOMS, targetRoomId, { start: s, end: e, now: n });
    setResult(ok);
  }

  function handleRoomChange(nextRoomId: string) {
    setRoomId(nextRoomId);
    if (result !== null) {
      evaluateRoom(nextRoomId);
    } else {
      setError('');
    }
  }

  function handleAttendeesChange(value: number) {
    const nextAttendees = Number.isNaN(value) || value < 1 ? 1 : value;
    setAttendees(nextAttendees);
    setResult(null);
    setError('');
  }

  function toggleEquipment(item: string) {
    setSelectedEquipment((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
    setResult(null);
    setError('');
  }

  return (
    <main className="page">
      <h1>Smart Campus Room Availability</h1>

      <section className="filters">
        <h2>Filter rooms</h2>
        <div className="row">
          <label>
            Attendees
            <input
              type="number"
              min={1}
              value={attendees}
              onChange={(e) => handleAttendeesChange(Number(e.target.value))}
            />
          </label>
          <div className="equipment-group">
            <span>Required equipment</span>
            <div className="row">
              {ALL_EQUIPMENT.map((item) => (
                <label key={item} className="inline">
                  <input
                    type="checkbox"
                    checked={selectedEquipment.includes(item)}
                    onChange={() => toggleEquipment(item)}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      {matchingRooms.length === 0 ? (
        <p className="empty-state">
          No rooms match the selected capacity and equipment requirements.
        </p>
      ) : (
        <>
          <div className="row">
            <label>
              Room ({matchingRooms.length} matching)
              <select
                value={effectiveRoomId}
                onChange={(e) => handleRoomChange(e.target.value)}
              >
                {matchingRooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} (cap {r.capacity}
                    {r.blocked ? ' — Blocked' : ''})
                  </option>
                ))}
              </select>
            </label>
            <label>
              Current time
              <input
                type="time"
                value={now}
                onChange={(e) => {
                  setNow(e.target.value);
                  setResult(null);
                }}
              />
            </label>
            <label>
              Start
              <input
                type="time"
                value={start}
                onChange={(e) => {
                  setStart(e.target.value);
                  setResult(null);
                }}
              />
            </label>
            <label>
              End
              <input
                type="time"
                value={end}
                disabled={endOfDay}
                onChange={(e) => {
                  setEnd(e.target.value);
                  setResult(null);
                }}
              />
            </label>
            <label className="inline">
              <input
                type="checkbox"
                checked={endOfDay}
                onChange={(e) => {
                  setEndOfDay(e.target.checked);
                  setResult(null);
                }}
              />
              Ends at 24:00
            </label>
          </div>

          <button onClick={() => evaluateRoom(effectiveRoomId)}>
            Check availability
          </button>

          {error && <p className="error">{error}</p>}
          {result !== null && (
            <p className={`result ${result ? 'available' : 'unavailable'}`}>
              {result ? 'Available' : 'Unavailable'}
            </p>
          )}

          {selectedRoom && (
            <div className="room-details">
              <h2>{selectedRoom.name}</h2>
              <p>
                Capacity: {selectedRoom.capacity} · Equipment:{' '}
                {selectedRoom.equipment.length
                  ? selectedRoom.equipment.join(', ')
                  : 'none'}
                {selectedRoom.blocked ? ' · Status: Blocked' : ''}
              </p>
              <h3>Existing bookings</h3>
              <ul>
                {selectedRoom.bookings.length ? (
                  selectedRoom.bookings.map((b, i) => (
                    <li key={i}>
                      {fmt(b.start)}–{fmt(b.end)}
                    </li>
                  ))
                ) : (
                  <li>none</li>
                )}
              </ul>
            </div>
          )}
        </>
      )}
    </main>
  );
}
