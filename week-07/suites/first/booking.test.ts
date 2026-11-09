import { describe, it, expect } from "vitest";
// TODO: replace with the real module path used by the page (not provided).
import { canBook, type Interval } from "../../starter/src/booking";

// Fixed time: canBook takes `now` as a parameter, so no fake timers are needed.
const NOW = 540;

// Fresh fixtures: every call returns new objects, so tests cannot share state.
const makeBookings = (): Interval[] => [{ start: 600, end: 660 }];

type Input = Parameters<typeof canBook>[0];
const makeInput = (overrides: Partial<Input> = {}): Input => ({
  start: 660,
  end: 720,
  now: NOW,
  blocked: false,
  bookings: makeBookings(),
  ...overrides,
});

describe("canBook", () => {
  describe("AC1: valid interval, strictly after now, within the day", () => {
    it.each([
      ["T02 starts now (540–570)", 540, 570, false],
      ["T03 zero duration (720–720)", 720, 720, false],
      ["T04 reversed (750–720)", 750, 720, false],
      ["T05 past day end (1380–1441)", 1380, 1441, false],
      ["X1 ends exactly at day end (1380–1440)", 1380, 1440, true],
    ])("%s -> %s", (_name, start, end, expected) => {
      expect(canBook(makeInput({ start, end }))).toBe(expected);
    });
  });

  describe("AC2: duration must not exceed 120", () => {
    it("T06 120 minutes (720–840) -> true", () => {
      expect(canBook(makeInput({ start: 720, end: 840 }))).toBe(true);
    });
    it("T07 121 minutes (720–841) -> false", () => {
      expect(canBook(makeInput({ start: 720, end: 841 }))).toBe(false);
    });
  });

  describe("AC3: blocked room rejects every request", () => {
    it("T13 660–720 with blocked = true -> false", () => {
      expect(canBook(makeInput({ start: 660, end: 720, blocked: true }))).toBe(false);
    });
  });

  describe("AC4: no overlap with existing bookings (end exclusive)", () => {
    it("T01 touching after (660–720) -> true", () => {
      expect(canBook(makeInput({ start: 660, end: 720 }))).toBe(true);
    });
    it("T08 touching before (570–600) -> true", () => {
      expect(canBook(makeInput({ start: 570, end: 600 }))).toBe(true);
    });
    it("T09 partial overlap (630–690) -> false", () => {
      expect(canBook(makeInput({ start: 630, end: 690 }))).toBe(false);
    });
    it("T10 contains booking (570–690) -> false", () => {
      expect(canBook(makeInput({ start: 570, end: 690 }))).toBe(false);
    });
    it("T11 inside booking (615–645) -> false", () => {
      expect(canBook(makeInput({ start: 615, end: 645 }))).toBe(false);
    });
    it("T12 identical interval (600–660) -> false", () => {
      expect(canBook(makeInput({ start: 600, end: 660 }))).toBe(false);
    });
    it("T14 same as T09 but bookings = [] -> true", () => {
      expect(canBook(makeInput({ start: 630, end: 690, bookings: [] }))).toBe(true);
    });
    it("X2 fits exactly between two bookings (660–700) -> true", () => {
      const bookings: Interval[] = [
        { start: 600, end: 660 },
        { start: 700, end: 760 },
      ];
      expect(canBook(makeInput({ start: 660, end: 700, bookings }))).toBe(true);
    });
  });

  describe("AC5: the check does not modify bookings", () => {
    it("available request returns true and leaves bookings unchanged", () => {
      const bookings = makeBookings();
      const snapshot = structuredClone(bookings);
      // Freeze so any push/splice/assignment throws (ES modules run in strict mode).
      bookings.forEach(Object.freeze);
      Object.freeze(bookings);

      const result = canBook(makeInput({ start: 660, end: 720, bookings }));

      expect(result).toBe(true);
      expect(bookings).toEqual(snapshot);
      expect(bookings).toHaveLength(1);
    });
  });
});