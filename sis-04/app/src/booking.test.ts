import { describe, test, expect } from "vitest";
import { canBook, type Interval } from "./booking";
import { checkRoom } from './booking';
import type { Room } from './rooms';

const CATALOG_FIXTURE: Room[] = [
  {
    id: 'room-a',
    name: 'Room A',
    capacity: 6,
    equipment: ['whiteboard'],
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
  },
  {
    id: 'room-b',
    name: 'Room B',
    capacity: 12,
    equipment: ['projector'],
    blocked: false,
    bookings: [],
  },
  {
    id: 'room-blocked',
    name: 'Room Blocked',
    capacity: 20,
    equipment: ['projector'],
    blocked: true,
    bookings: [],
  },
];

describe('checkRoom and boundary regression suite', () => {
  test('B1 AC2: checkRoom accepts exactly 120 minutes (720-840)', () => {
    expect(checkRoom(CATALOG_FIXTURE, 'room-b', { start: 720, end: 840, now: 540 })).toBe(true);
  });

  test('B2 AC2: checkRoom rejects 121 minutes (720-841)', () => {
    expect(checkRoom(CATALOG_FIXTURE, 'room-b', { start: 720, end: 841, now: 540 })).toBe(false);
  });

  test('B3 AC4: checkRoom allows booking touching existing booking at endpoint (660-720)', () => {
    expect(checkRoom(CATALOG_FIXTURE, 'room-a', { start: 660, end: 720, now: 540 })).toBe(true);
  });

  test('B4 AC4: checkRoom rejects booking overlapping existing booking (630-690)', () => {
    expect(checkRoom(CATALOG_FIXTURE, 'room-a', { start: 630, end: 690, now: 540 })).toBe(false);
  });

  test('F3 AC3: checkRoom rejects a blocked room even with empty bookings', () => {
    expect(checkRoom(CATALOG_FIXTURE, 'room-blocked', { start: 600, end: 660, now: 540 })).toBe(false);
  });

  test('F5 AC5: checkRoom uses chosen room bookings and leaves catalog unchanged', () => {
    const snapshot = JSON.stringify(CATALOG_FIXTURE);
    const roomAAvailable = checkRoom(CATALOG_FIXTURE, 'room-a', { start: 600, end: 630, now: 540 });
    const roomBAvailable = checkRoom(CATALOG_FIXTURE, 'room-b', { start: 600, end: 630, now: 540 });

    expect(roomAAvailable).toBe(false);
    expect(roomBAvailable).toBe(true);
    expect(JSON.stringify(CATALOG_FIXTURE)).toBe(snapshot);
  });
});

// Fix current time at 9:00 AM (540 minutes)
const NOW = 540;

// Create a clean list with one booking from 10:00 to 11:00 (600 to 660)
const createFreshBookings = (): Interval[] => [
  { start: 600, end: 660 }
];


describe("canBook final verification suite", () => {
  // --- AC1: Valid time ranges ---
  test('BUG-A: touching booking should be available', () => {
    const bookings = [{ start: 600, end: 660 }];
    expect(canBook({ start: 660, end: 720, now: 540, blocked: false, bookings })).toBe(true);
  });

  test('BUG-B: canBook does not mutate bookings array', () => {
    const bookings = [{ start: 600, end: 660 }];
    const initialLength = bookings.length;
    
    canBook({ start: 720, end: 780, now: 540, blocked: false, bookings });
    
    expect(bookings.length).toBe(initialLength);
  });

  test("T02 AC1: starts now (540–570) should be rejected", () => {
    const result = canBook({ start: 540, end: 570, now: NOW, blocked: false, bookings: createFreshBookings() });
    expect(result).toBe(false);
  });

  test("T03 AC1: zero duration (720–720) should be rejected", () => {
    const result = canBook({ start: 720, end: 720, now: NOW, blocked: false, bookings: createFreshBookings() });
    expect(result).toBe(false);
  });

  test("T04 AC1: reversed times (750–720) should be rejected", () => {
    const result = canBook({ start: 750, end: 720, now: NOW, blocked: false, bookings: createFreshBookings() });
    expect(result).toBe(false);
  });

  test("T05 AC1: past the end of the day (1380–1441) should be rejected", () => {
    const result = canBook({ start: 1380, end: 1441, now: NOW, blocked: false, bookings: createFreshBookings() });
    expect(result).toBe(false);
  });

  test("X1 AC1: ends exactly at the end of the day (1380–1440) should be accepted", () => {
    const result = canBook({ start: 1380, end: 1440, now: NOW, blocked: false, bookings: createFreshBookings() });
    expect(result).toBe(true);
  });

  // --- AC2: Maximum duration ---
  test("T06 AC2: maximum duration of 120 minutes (720–840) should be accepted", () => {
    const result = canBook({ start: 720, end: 840, now: NOW, blocked: false, bookings: createFreshBookings() });
    expect(result).toBe(true);
  });

  test("T07 AC2: duration of 121 minutes (720–841) should be rejected", () => {
    const result = canBook({ start: 720, end: 841, now: NOW, blocked: false, bookings: createFreshBookings() });
    expect(result).toBe(false);
  });

  // --- AC3: Blocked status ---
  test("T13 AC3: blocked room is true should reject the request", () => {
    const result = canBook({ start: 660, end: 720, now: NOW, blocked: true, bookings: createFreshBookings() });
    expect(result).toBe(false);
  });

  // --- AC4: Overlapping and touching ---
  test("T01 AC4: touching right after an existing booking (660–720) should be accepted", () => {
    const result = canBook({ start: 660, end: 720, now: NOW, blocked: false, bookings: createFreshBookings() });
    expect(result).toBe(true);
  });

  test("T08 AC4: touching right before an existing booking (570–600) should be accepted", () => {
    const result = canBook({ start: 570, end: 600, now: NOW, blocked: false, bookings: createFreshBookings() });
    expect(result).toBe(true);
  });

  test("T09 AC4: partial overlap with a booking (630–690) should be rejected", () => {
    const result = canBook({ start: 630, end: 690, now: NOW, blocked: false, bookings: createFreshBookings() });
    expect(result).toBe(false);
  });

  test("T10 AC4: request completely covers an existing booking (570–690) should be rejected", () => {
    const result = canBook({ start: 570, end: 690, now: NOW, blocked: false, bookings: createFreshBookings() });
    expect(result).toBe(false);
  });

  test("T11 AC4: request is completely inside an existing booking (615–645) should be rejected", () => {
    const result = canBook({ start: 615, end: 645, now: NOW, blocked: false, bookings: createFreshBookings() });
    expect(result).toBe(false);
  });

  test("T12 AC4: request is identical to an existing booking (600–660) should be rejected", () => {
    const result = canBook({ start: 600, end: 660, now: NOW, blocked: false, bookings: createFreshBookings() });
    expect(result).toBe(false);
  });

  test("T14 AC4: overlap times but the booking list is completely empty should be accepted", () => {
    const result = canBook({ start: 630, end: 690, now: NOW, blocked: false, bookings: [] });
    expect(result).toBe(true);
  });

  test("X2 AC4: request fits perfectly in the gap between two bookings (660–700) should be accepted", () => {
    const doubleBookings: Interval[] = [
      { start: 600, end: 660 },
      { start: 700, end: 760 }
    ];
    const result = canBook({ start: 660, end: 700, now: NOW, blocked: false, bookings: doubleBookings });
    expect(result).toBe(true);
  });

  // --- AC5: Do not change data ---
  test("AC5: checking an available room must not change the original bookings data", () => {
    const originalBookings = createFreshBookings();
    const copyBeforeTest = structuredClone(originalBookings);

    // Make an available request (returns true)
    const result = canBook({
      start: 660,
      end: 720,
      now: NOW,
      blocked: false,
      bookings: originalBookings
    });

    expect(result).toBe(true);
    // Make sure the list was not modified
    expect(originalBookings).toEqual(copyBeforeTest);
  });
});
