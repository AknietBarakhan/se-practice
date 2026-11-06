# Week 07 — Lab report

**Name:** Barakhan Akniyet
**Group:** Monday 16:00-19:00
**Date:**

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Project I continue (`week-06` = my Week 06 Bolt project, `starter` = the provided starter) | starter |
| Bolt project link (or `not shared`, and why) | not shared, because I did'n do previous practice |
| Assistant that generated the tests (tool) | Claude |
| Exact model (with its version, or `not displayed`) | Sonnet 5.5 |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer |
| Vitest version (the `RUN  v…` line of a run) | v5.1.0|
| Test command | npm test |

---

## 2. Task 1 — baseline and the booking function

**Before editing:** where did the booking decision live in the project you started from?

| | |
| --- | --- |
| File and function (or "inside the page component") | Inside the page component the `check()` function in `src/App.tsx`|
| Its inputs | The start, end and current time converted to minutes, the `blocked` checkbox state and the selected room's `bookings` list |
| What it returned | It set a local variable `ok` |
| How the page used it | `result` decided whether the page showed an "Available" or "Unavailable" message |

**What I changed to extract `canBook`.** Say which file it now lives in, what you moved, and why
the behaviour did not change. Also say which file of the page now calls it. 40 words or more.

<!-- Write below this line -->
I moved the availability decision from the 'check()' function in 'src/App.tsx' into a new file `src/booking.ts` as 'canBook'. I copied the conditions exactly as they were, including their order. `App.tsx` now imports `canBook` and calls it, while the conversion from HH:MM to minutes and the two validation messages stayed in the page. The behaviour did not change. I checked the default 11:00-12:00 request and an overlapping one in the browser before and after
---

## 3. Task 2 — the test plan

Default fixture: `now = 540`, `blocked = false`, `bookings = [{ start: 600, end: 660 }]`, fresh
for every test. **The Expected column comes from AC1–AC4, never from the code.** Write the
**reason** for each expected result **before** you send the generation prompt.

| ID | Candidate / changed input | Expected | AC | Reason (in your words) |
| --- | --- | --- | --- | --- |
| T01 | 660–720 (touching after) | true | AC4 | Intervals only touch and the start is after now, duration 60 |
| T02 | 540–570 (starts now) | false | AC1 | The start must be strictly after now and 540 equals now |
| T03 | 720–720 (zero duration) | false | AC1 | The start must be less than end |
| T04 | 750–720 (reversed) | false | AC1 | The end is before the start, which is not a valid interval |
| T05 | 1380–1441 (past day end) | false | AC1 | The day has 1440 minutes, and 1441 is past the end of the day |
| T06 | 720–840 (120 minutes) | true | AC2 | 120 is allowed because it must not exceed|
| T07 | 720–841 (121 minutes) | false | AC2 | 121>120 is not allowed, duration must be not greater than 120 |
| T08 | 570–600 (touching before) | true | AC4 | The request ends at 600, where the booking starts. The end is excluded, so they only touch and 570 is after now |
| T09 | 630–690 (partial overlap) | false | AC4 | 630 is inside 600–660 and the request continues past 660, so the intervals share minutes |
| T10 | 570–690 (contains booking) | false | AC4 | The request starts before the booking and ends after it, so the whole booking is inside the request |
| T11 | 615–645 (inside booking) | false | AC4 | The request lies entirely inside 600–660 |
| T12 | 600–660 (identical interval) | false | AC4 | Duplicate, it covers the same time |
| T13 | 660–720, blocked = true | false | AC3 | Blocked room rejects every request |
| T14 | 630–690, bookings = [] | true | AC4 | Its the same as T09, but bookings is empty, so its okay|
| AC5 | an Available request — the bookings after the call equal the bookings before | true, data unchanged | AC5 | The check only reads the bookings and must never add, remove or change them |
| X1 | 1380–1440 (ends exactly at the end of the day) | true | AC1 | The end value is allowed and the start is after now|
| X2 | 660–700, bookings = [600–660, 700–760] (touches two bookings) | true | AC4 | The request starts where the first booking ends and ends where the second begins. Both ends are excluded, so it fits exactly in the gap |

X1 and X2 are **your own two cases**: a boundary or a state that T01–T14 do not reach. Fill all
five columns.

---

## 4. Task 3 — the generation prompt and the first suite

**The prompt exactly as I sent it.** Use the deck's prompt with `[our test framework]` replaced by
`Vitest`, followed by the case table from section 3:

```text
Generate tests for the existing booking function using Vitest. Use AC1–AC6 and the reviewed case table below.
Import the real function used by the page. Keep its code unchanged. Use fixed time and fresh fixtures. Assert exact decisions and unchanged booking data.
Return the test file, run command, and AC mapping. Flag unclear requirements. We will run the tests ourselves.

| ID | Candidate / changed input | Expected | AC | Reason (in your words) |
| --- | --- | --- | --- | --- |
| T01 | 660–720 (touching after) | true | AC4 | Intervals only touch and the start is after now, duration 60 |
| T02 | 540–570 (starts now) | false | AC1 | The start must be strictly after now and 540 equals now |
| T03 | 720–720 (zero duration) | false | AC1 | The start must be less than end |
| T04 | 750–720 (reversed) | false | AC1 | The end is before the start, which is not a valid interval |
| T05 | 1380–1441 (past day end) | false | AC1 | The day has 1440 minutes, and 1441 is past the end of the day |
| T06 | 720–840 (120 minutes) | true | AC2 | 120 is allowed because it must not exceed|
| T07 | 720–841 (121 minutes) | false | AC2 | 121>120 is not allowed, duration must be not greater than 120 |
| T08 | 570–600 (touching before) | true | AC4 | The request ends at 600, where the booking starts. The end is excluded, so they only touch and 570 is after now |
| T09 | 630–690 (partial overlap) | false | AC4 | 630 is inside 600–660 and the request continues past 660, so the intervals share minutes |
| T10 | 570–690 (contains booking) | false | AC4 | The request starts before the booking and ends after it, so the whole booking is inside the request |
| T11 | 615–645 (inside booking) | false | AC4 | The request lies entirely inside 600–660 |
| T12 | 600–660 (identical interval) | false | AC4 | Duplicate, it covers the same time |
| T13 | 660–720, blocked = true | false | AC3 | Blocked room rejects every request |
| T14 | 630–690, bookings = [] | true | AC4 | Its the same as T09, but bookings is empty, so its okay|
| AC5 | an Available request — the bookings after the call equal the bookings before | true, data unchanged | AC5 | The check only reads the bookings and must never add, remove or change them |
| X1 | 1380–1440 (ends exactly at the end of the day) | true | AC1 | The end value is allowed and the start is after now|
| X2 | 660–700, bookings = [600–660, 700–760] (touches two bookings) | true | AC4 | The request starts where the first booking ends and ends where the second begins. Both ends are excluded, so it fits exactly in the gap |

typescript
export type Interval = { start: number; end: number };

export function canBook({
  start,
  end,
  now,
  blocked,
  bookings,
}: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: Interval[];
}): boolean {
  let ok = true;
  if (!(0 <= start && start < end && end <= 1440)) ok = false;
  else if (!(start > now)) ok = false;
  else if (end - start > 120) ok = false;
  else if (blocked) ok = false;
  else {
    for (const b of bookings) {
      if (start < b.end && end > b.start) {
        ok = false;
        break;
      }
    }
  }
  return ok;
}
```

**The assistant's answer: run command, AC mapping and any unclear requirements it flagged,
pasted unedited.** Its test file goes to `suites/first/` and is not pasted here:

```text
# Vitest tests for `canBook`

## Test file: `canBook.test.ts`

```typescript
import { describe, it, expect } from "vitest";
// TODO: replace with the real module path used by the page (not provided).
import { canBook, type Interval } from "../src/booking";

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
```

## Run command

```bash
npx vitest run canBook.test.ts
```

## AC mapping

| AC | Covered by |
| --- | --- |
| AC1 | T02, T03, T04, T05, X1 |
| AC2 | T06, T07 |
| AC3 | T13 |
| AC4 | T01, T08, T09, T10, T11, T12, T14, X2 |
| AC5 | the AC5 test (frozen array, snapshot comparison, and result `true`) |
| AC6 | **not covered**, see below |

I checked every expected value in the table against the code by hand (with `now = 540` and booking 600–660), and all 18 match. Each rejection case fails for exactly one reason, so each test isolates its AC.

## Unclear requirements and gaps

1. **AC1–AC6 text was not provided.** I inferred the meaning of AC1–AC5 from your table's "AC" column. Please confirm that AC1 is "valid interval, strictly after now, end ≤ 1440", AC2 is "max 120 minutes", AC3 is "blocked", AC4 is "no overlap, end exclusive", and AC5 is "no mutation".
2. **AC6 has no row in the table**, so I wrote no test for it. I did not guess its meaning. Please send its wording and a case row.
3. **The import path is a placeholder** (`../src/booking`). I don't know where the page's real `canBook` lives, so please update it. I did not touch the function.
4. **Start below 0 is untested.** The code rejects `start < 0`, but no table row covers it (for example, `now = -10`, `-5–30`). Is that intended behavior? If so, add a row under AC1.
5. **Non-integer, `NaN`, or `Infinity` inputs are unspecified.** `NaN` currently fails the range check, but no AC says so, so I left it out.
6. **The order of rules is not specified.** When a request breaks several rules (such as blocked and overlapping), the result is `false` either way, so no test depends on order. If a future AC requires a specific rejection reason, `canBook` returning only a boolean could not express it.
7. **T14's reason** ("same as T09 but empty bookings") is covered, but there is no separate test for an empty list combined with other invalid inputs. I treated that as out of scope.
```

The first suite was saved to `suites/first/` **before** I changed anything in it: yes / no no

---

## 5. Task 4 — review of the first suite

Review it **before** you run it. Look at the imports, the expected values, isolation, duplicates
and skipped tests. Make one row per decision. At least **two** rows, and each one names the kind of
weakness (the deck's table: *no exception occurred* · *expected = current output* · *only valid
requests* · *mocked booking function*, or your own) and the AC that decides it.

| # | Test or part of the suite | What is weak or wrong | Decision: accept / revise / reject | AC or reason |
| --- | --- | --- | --- | --- |
| 1 | describe("AC1: valid interval..."), it.each loop | 
 with it.each	expected = current output · It runs multiple tests inside one loop. If one test fails, it is hard to see which one broke. The assignment rules say every test case must be separate and have its own unique ID written directly in its name
 | revise | AC1, aasignment rules |
| 2 | describe("AC4: no overlap..."), makeInput helper | only valid requests · It hides the setup options inside a helper function. This makes it hard to see what data is actually changing in each test. It is better to write the numbers out clearly for each case | revise | AC4, test isolation |

---

## 6. Task 5 — running, diagnosing, improving

### 6.1 The first run

The **real** terminal output of the first run of the first suite, pasted unedited. Include the
`RUN  v…` line and the `Tests` summary line. A build message or the assistant saying "tests pass"
is not a run.

```text
✓ booking.test.ts (17 tests) 3ms
   ✓ canBook (17)
     ✓ AC1: valid interval, strictly after now, within the day (5)
       ✓ T02 starts now (540–570) -> 540 1ms
       ✓ T03 zero duration (720–720) -> 720 0ms
       ✓ T04 reversed (750–720) -> 750 0ms
       ✓ T05 past day end (1380–1441) -> 1380 0ms
       ✓ X1 ends exactly at day end (1380–1440) -> 1380 0ms
     ✓ AC2: duration must not exceed 120 (2)
       ✓ T06 120 minutes (720–840) -> true 0ms
       ✓ T07 121 minutes (720–841) -> false 0ms
     ✓ AC3: blocked room rejects every request (1)
       ✓ T13 660–720 with blocked = true -> false 0ms
     ✓ AC4: no overlap with existing bookings (end exclusive) (8)
       ✓ T01 touching after (660–720) -> true 0ms
       ✓ T08 touching before (570–600) -> true 0ms
       ✓ T09 partial overlap (630–690) -> false 0ms
       ✓ T10 contains booking (570–690) -> false 0ms
       ✓ T11 inside booking (615–645) -> false 0ms
       ✓ T12 identical interval (600–660) -> false 0ms
       ✓ T14 same as T09 but bookings = [] -> true 0ms
       ✓ X2 fits exactly between two bookings (660–700) -> true 0ms
     ✓ AC5: the check does not modify bookings (1)
       ✓ available request returns true and leaves bookings unchanged 0ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  13:35:16
   Duration  79ms (transform 62%, import 22%, tests 11%, worker 5%)
```

**Each failure, diagnosed** (the deck's table: import/runner error · assertion mismatch · result
changing per run · no tests discovered). Write `none` in the first row if nothing failed.

| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken |
| --- | --- | --- | --- | --- |
| none | | | | |

### 6.2 The improvement prompt

The deck's improvement prompt exactly as sent, followed by the actual output from 6.1. Then
paste the assistant's answer, unedited:

```text
Review this test suite against AC1–AC6 and our case table. Identify incorrect expectations, weak assertions, duplicated cases, and missing boundaries.

For each proposed change, explain the requirement and the defect it could detect. Improve the tests without changing correct expectations to match buggy behavior.

Use the actual failure output below. Separate test repairs from implementation fixes.

RUN  v5.1.0 /Users/akniet/Documents/kbtu/se-practice/week-07/suites/first

 ✓ booking.test.ts (17 tests) 3ms
   ✓ canBook (17)
     ✓ AC1: valid interval, strictly after now, within the day (5)
       ✓ T02 starts now (540–570) -> 540 1ms
       ✓ T03 zero duration (720–720) -> 720 0ms
       ✓ T04 reversed (750–720) -> 750 0ms
       ✓ T05 past day end (1380–1441) -> 1380 0ms
       ✓ X1 ends exactly at day end (1380–1440) -> 1380 0ms
     ✓ AC2: duration must not exceed 120 (2)
       ✓ T06 120 minutes (720–840) -> true 0ms
       ✓ T07 121 minutes (720–841) -> false 0ms
     ✓ AC3: blocked room rejects every request (1)
       ✓ T13 660–720 with blocked = true -> false 0ms
     ✓ AC4: no overlap with existing bookings (end exclusive) (8)
       ✓ T01 touching after (660–720) -> true 0ms
       ✓ T08 touching before (570–600) -> true 0ms
       ✓ T09 partial overlap (630–690) -> false 0ms
       ✓ T10 contains booking (570–690) -> false 0ms
       ✓ T11 inside booking (615–645) -> false 0ms
       ✓ T12 identical interval (600–660) -> false 0ms
       ✓ T14 same as T09 but bookings = [] -> true 0ms
       ✓ X2 fits exactly between two bookings (660–700) -> true 0ms
     ✓ AC5: the check does not modify bookings (1)
       ✓ available request returns true and leaves bookings unchanged 0ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  13:35:16
   Duration  79ms (transform 62%, import 22%, tests 11%, worker 5%)
```

### 6.3 The final run

The **real** output of the final suite (`booking.test.*` beside your module), after every
change and after restoring the correct code from section 7. Every test must pass. If a real defect
is still open, leave its test failing and explain it in 9.1.

```text
 RUN  v2.1.9 /Users/akniet/Documents/kbtu/se-practice/week-07/starter/src

 ✓ booking.test.ts (17)
   ✓ canBook final verification suite (17)
     ✓ T02 AC1: starts now (540–570) should be rejected
     ✓ T03 AC1: zero duration (720–720) should be rejected
     ✓ T04 AC1: reversed times (750–720) should be rejected
     ✓ T05 AC1: past the end of the day (1380–1441) should be rejected
     ✓ X1 AC1: ends exactly at the end of the day (1380–1440) should be accepted
     ✓ T06 AC2: maximum duration of 120 minutes (720–840) should be accepted
     ✓ T07 AC2: duration of 121 minutes (720–841) should be rejected
     ✓ T13 AC3: blocked room is true should reject the request
     ✓ T01 AC4: touching right after an existing booking (660–720) should be accepted
     ✓ T08 AC4: touching right before an existing booking (570–600) should be accepted
     ✓ T09 AC4: partial overlap with a booking (630–690) should be rejected
     ✓ T10 AC4: request completely covers an existing booking (570–690) should be rejected
     ✓ T11 AC4: request is completely inside an existing booking (615–645) should be rejected
     ✓ T12 AC4: request is identical to an existing booking (600–660) should be rejected
     ✓ T14 AC4: overlap times but the booking list is completely empty should be accepted
     ✓ X2 AC4: request fits perfectly in the gap between two bookings (660–700) should be accepted
     ✓ AC5: checking an available room must not change the original bookings data

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  13:55:34
   Duration  158ms (transform 17ms, setup 0ms, collect 13ms, tests 2ms, environment 0ms, prepare 32ms)
```

---

## 7. Task 6 — deliberate defects

You need a reviewed, passing suite first. Then introduce **one** defect at a time in your booking
module, leave the tests unchanged, run, record, and **restore** the code. A syntax or import
error does not count as detection.

| Trial | Intentional change | Detected / Survived | Failing test ID(s) | If it survived: why, and what you added |
| --- | --- | --- | --- | --- |
| M1 | Reject duration >= 120 instead of > 120 | Detected | T06 | None. The boundary test successfully failed |
| M2 | Treat touching endpoints as an overlap | Detected | T01, T08, X2, AC5| None. The touching boundaries tests correctly failed |
| M3 | Remove the blocked-room rejection | Detected | T13 | None. The blocked room test isolated and caught the fault |

**The run of each mutant, pasted unedited.** Paste the `Tests` summary line and the failing test
names at least:

```text

 ❯ booking.test.ts (17)
   ❯ canBook final verification suite (17)
     ✓ T02 AC1: starts now (540–570) should be rejected
     ✓ T03 AC1: zero duration (720–720) should be rejected
     ✓ T04 AC1: reversed times (750–720) should be rejected
     ✓ T05 AC1: past the end of the day (1380–1441) should be rejected
     ✓ X1 AC1: ends exactly at the end of the day (1380–1440) should be accepted
     × T06 AC2: maximum duration of 120 minutes (720–840) should be accepted
     ✓ T07 AC2: duration of 121 minutes (720–841) should be rejected
     ✓ T13 AC3: blocked room is true should reject the request
     ✓ T01 AC4: touching right after an existing booking (660–720) should be accepted
     ✓ T08 AC4: touching right before an existing booking (570–600) should be accepted
     ✓ T09 AC4: partial overlap with a booking (630–690) should be rejected
     ✓ T10 AC4: request completely covers an existing booking (570–690) should be rejected
     ✓ T11 AC4: request is completely inside an existing booking (615–645) should be rejected
     ✓ T12 AC4: request is identical to an existing booking (600–660) should be rejected
     ✓ T14 AC4: overlap times but the booking list is completely empty should be accepted
     ✓ X2 AC4: request fits perfectly in the gap between two bookings (660–700) should be accepted
     ✓ AC5: checking an available room must not change the original bookings data

      RUN  v2.1.9 /Users/akniet/Documents/kbtu/se-practice/week-07/starter/src

 ❯ booking.test.ts (17)
   ❯ canBook final verification suite (17)
     ✓ T02 AC1: starts now (540–570) should be rejected
     ✓ T03 AC1: zero duration (720–720) should be rejected
     ✓ T04 AC1: reversed times (750–720) should be rejected
     ✓ T05 AC1: past the end of the day (1380–1441) should be rejected
     ✓ X1 AC1: ends exactly at the end of the day (1380–1440) should be accepted
     ✓ T06 AC2: maximum duration of 120 minutes (720–840) should be accepted
     ✓ T07 AC2: duration of 121 minutes (720–841) should be rejected
     ✓ T13 AC3: blocked room is true should reject the request
     × T01 AC4: touching right after an existing booking (660–720) should be accepted
     × T08 AC4: touching right before an existing booking (570–600) should be accepted
     ✓ T09 AC4: partial overlap with a booking (630–690) should be rejected
     ✓ T10 AC4: request completely covers an existing booking (570–690) should be rejected
     ✓ T11 AC4: request is completely inside an existing booking (615–645) should be rejected
     ✓ T12 AC4: request is identical to an existing booking (600–660) should be rejected
     ✓ T14 AC4: overlap times but the booking list is completely empty should be accepted
     × X2 AC4: request fits perfectly in the gap between two bookings (660–700) should be accepted
     × AC5: checking an available room must not change the original bookings data


 RUN  v2.1.9 /Users/akniet/Documents/kbtu/se-practice/week-07/starter/src

 ❯ booking.test.ts (17)
   ❯ canBook final verification suite (17)
     ✓ T02 AC1: starts now (540–570) should be rejected
     ✓ T03 AC1: zero duration (720–720) should be rejected
     ✓ T04 AC1: reversed times (750–720) should be rejected
     ✓ T05 AC1: past the end of the day (1380–1441) should be rejected
     ✓ X1 AC1: ends exactly at the end of the day (1380–1440) should be accepted
     ✓ T06 AC2: maximum duration of 120 minutes (720–840) should be accepted
     ✓ T07 AC2: duration of 121 minutes (720–841) should be rejected
     × T13 AC3: blocked room is true should reject the request
     ✓ T01 AC4: touching right after an existing booking (660–720) should be accepted
     ✓ T08 AC4: touching right before an existing booking (570–600) should be accepted
     ✓ T09 AC4: partial overlap with a booking (630–690) should be rejected
     ✓ T10 AC4: request completely covers an existing booking (570–690) should be rejected
     ✓ T11 AC4: request is completely inside an existing booking (615–645) should be rejected
     ✓ T12 AC4: request is identical to an existing booking (600–660) should be rejected
     ✓ T14 AC4: overlap times but the booking list is completely empty should be accepted
     ✓ X2 AC4: request fits perfectly in the gap between two bookings (660–700) should be accepted
     ✓ AC5: checking an available room must not change the original bookings data
```

All three changes reverted, and the full suite run again (section 6.3): yes / no yes

---

## 8. Task 7 — manual UI checks

Use `now = 09:00` and an existing `10:00–11:00` booking. Do them in the page in a browser. Save a
screenshot of each as `evidence/ui-1.png` … `evidence/ui-5.png`. Take **ui-4 at phone width**
(about 375 px, portrait).

| # | Action | Expected observation | AC | What I observed | Pass / Fail / Not testable |
| --- | --- | --- | --- | --- | --- |
| U1 | Check 11:00–12:00, unblocked | Available, with the fixed sample booking | AC5 | The page displayed the "available"| Pass |
| U2 | Enable blocked, then check again | Unavailable replaces the earlier result | AC3, AC5 | After clicking the "blocked" button and testing, the page showed "Unavailable"| Pass |
| U3 | Clear a required input and submit | Understandable validation feedback | AC6 | Clearing the all inputs showed the meassage "Fill in the current time, the start and the end.", which is a understandable feedback | Pass |
| U4 | Use a narrow (phone) width | Controls and result remain usable | AC6 | The layout is correct. The text and buttons stayed fully viewable and clickable | Pass |
| U5 | Repeat the checks on the same data | Existing bookings remain unchanged | AC5 | Submitting multiple validation checks repeatedly did not add any duplicate items or change the existing 10:00-11:00 booking block | Pass |

---

## 9. Comparison and what still fails

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

### 9.2 Original and improved suites

| Measure | First suite | Improved suite |
| --- | --- | --- |
| Executed / passed / failed | | |
| Requirements with meaningful tests (AC IDs and gaps) | | |
| Selected mutants detected | | |
| Accepted / revised / rejected tests | | |
| Remaining limitations | | |

### 9.3 What no AC decides

Call your function with `bookings = [{ start: 700, end: 650 }]` (a reversed existing booking)
and a request of 660–720. What does it return? Does any AC say what it should return? (This is
the value you declare in `submission.yml` under `assumptions.invalid_existing_booking`.)

-

---

## 10. Conclusion (120–180 words)

<!-- Answer all three in your own words, without the assistant:
     (a) Which mistake in the FIRST suite would have let a wrong canBook pass, and how did you find it?
     (b) What does your final green run prove, and what does it NOT prove? Use a mutant or a UI check.
     (c) One testing limitation that remains.
     Worthless: "The AI wrote good tests and they all passed."
     Worth everything: "The first suite expected T06 (exactly 120 minutes) to be rejected. That
     contradicts AC2, and it failed on a correct canBook. If I had changed the code to make it
     pass, M1 would have become the real behaviour." -->

<!-- Write your conclusion below this line -->
