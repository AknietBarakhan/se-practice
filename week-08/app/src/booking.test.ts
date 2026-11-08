import { describe, test, expect } from "vitest";
import { canBook, type Interval } from "./booking";

// Fix current time at 9:00 AM (540 minutes)
const NOW = 540;

// Create a clean list with one booking from 10:00 to 11:00 (600 to 660)
const createFreshBookings = (): Interval[] => [
  { start: 600, end: 660 }
];

describe("canBook final verification suite", () => {
  // --- AC1: Valid time ranges ---
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
