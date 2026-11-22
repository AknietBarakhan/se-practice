import { describe, test, expect } from 'vitest';
import { filterRooms } from './filter';
import { checkRoom } from './booking';
import type { Room } from './rooms';

const TEST_ROOMS: Room[] = [
  {
    id: 'r1',
    name: 'Small Pod',
    capacity: 4,
    equipment: ['whiteboard'],
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
  },
  {
    id: 'r2',
    name: 'Medium Lab',
    capacity: 10,
    equipment: ['projector', 'whiteboard'],
    blocked: false,
    bookings: [],
  },
  {
    id: 'r3',
    name: 'Large Hall',
    capacity: 25,
    equipment: ['projector', 'whiteboard', 'video-conference'],
    blocked: false,
    bookings: [{ start: 720, end: 780 }],
  },
  {
    id: 'r4',
    name: 'Blocked Suite',
    capacity: 15,
    equipment: ['projector'],
    blocked: true,
    bookings: [],
  },
];

describe('filterRooms and room integration suite', () => {
  test('F1 B5: capacity exactly equal to requested attendees includes the room', () => {
    const matches = filterRooms(TEST_ROOMS, { attendees: 10, equipment: [] });
    expect(matches.map((r) => r.id)).toEqual(['r2', 'r3', 'r4']);
  });

  test('F1 B6: capacity one below requested attendees excludes the room', () => {
    const matches = filterRooms(TEST_ROOMS, { attendees: 11, equipment: [] });
    expect(matches.map((r) => r.id)).toEqual(['r3', 'r4']);
  });

  test('F2: equipment filter requires all selected items', () => {
    const matches = filterRooms(TEST_ROOMS, {
      attendees: 1,
      equipment: ['projector', 'whiteboard'],
    });
    expect(matches.map((r) => r.id)).toEqual(['r2', 'r3']);
  });

  test('F4: returns empty array when no rooms match criteria', () => {
    const matches = filterRooms(TEST_ROOMS, {
      attendees: 50,
      equipment: ['projector'],
    });
    expect(matches).toEqual([]);
  });

  test('INT: filterRooms followed by checkRoom verifies availability on matching rooms', () => {
    const matches = filterRooms(TEST_ROOMS, {
      attendees: 10,
      equipment: ['projector', 'whiteboard'],
    });
    expect(matches.map((r) => r.id)).toEqual(['r2', 'r3']);

    const r2Ok = checkRoom(matches, 'r2', { start: 720, end: 780, now: 540 });
    const r3Ok = checkRoom(matches, 'r3', { start: 720, end: 780, now: 540 });
    expect(r2Ok).toBe(true);
    expect(r3Ok).toBe(false);
  });
});
