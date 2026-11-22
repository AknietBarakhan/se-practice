# SIS #04 — Report: Evolving the Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 10.), every
     ### sub-heading and every **Label:** word — the checker finds your answers by them.
     Replace every "(write here)" and "(paste here)". Delete these <!-- --> comments if you like. -->

## 1. Setup and starting point

<!-- Model: the exact model with its version, as the tool shows it ("ChatGPT" is a tool, not a
     model). If the tool does not show it, write: not displayed
     Starting point: week-08 | week-07 | sis-03 | starter   (README section 3)
     Baseline commit: the commit that brings your starting point into sis-04/app/ UNCHANGED —
     git rev-parse --short HEAD right after that commit. It is your "initial version". -->

| Item | Value |
| --- | --- |
| Assistant (tool) | Claude |
| Assistant model | Sonnet 5.5 |
| Starting point | week-08 |
| Baseline commit | b6dab0f |
| Language (ts or js) | ts |
| Vitest version | v2.1.9 |
| Where I ran the tests | local terminal |

### 1.1 Baseline run

<!-- Before you change anything: run the tests of your starting point inside app/ and paste the
     REAL output. No tests yet (starter, sis-03)? Paste the run anyway: Vitest prints
     "No test files found". That is your honest "original" number, 0/0. -->

```text
 RUN  v2.1.9 /Users/akniet/Documents/kbtu/se-practice/sis-04/app

 ✓ src/booking.test.ts (19)
   ✓ canBook final verification suite (19)
     ✓ BUG-A: touching booking should be available
     ✓ BUG-B: canBook does not mutate bookings array
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
      Tests  19 passed (19)
   Start at  19:58:00
   Duration  165ms (transform 15ms, setup 0ms, collect 13ms, tests 2ms, environment 0ms, prepare 28ms)
```

## 2. Context for the assistant

### 2.1 Repository map

<!-- The concise map you gave the assistant: the files that matter and one line each on what
     they do. A tree is fine:  src/App.tsx — the page, holds the rooms and the form … -->

```text
| File | What it does |
| --- | --- |
| `src/booking.ts` | `canBook({ start, end, now, blocked, bookings })`: the availability decision, with the AC1-AC4 conditions, returning true or false |
| `src/booking.test.ts` | The Vitest suite: the T01-T14 cases, X1, X2, AC5 and the BUG-A and BUG-B regression tests |
| `src/App.tsx` | The page: state for room, current time, start, end, blocked and result, the `check()` function, and the form |
| `src/main.tsx` | Starts the React app and mounts `App` |
| `src/index.css` | The page styles |
| `package.json` | Scripts and dependencies (Vite, React, Vitest) |
```

### 2.2 The context message as sent

<!-- The whole first message of your analysis chat: the map, AC1–AC6, F1–F5 and the constraints
     (no login, payments, live APIs or database; fictional data only). Unedited. -->

```text
I am extending a Smart Campus Room Availability Checker (TypeScript + React + Vitest) without breaking existing functionality.

Here is the repository map:
- src/booking.ts: canBook({ start, end, now, blocked, bookings }): the availability decision, with the AC1-AC4 conditions, returning true or false
- src/booking.test.ts: The Vitest suite: the T01-T14 cases, X1, X2, AC5 and the BUG-A and BUG-B regression tests
- src/App.tsx: The page: state for room, current time, start, end, blocked and result, the check() function, and the form
- src/main.tsx: Starts the React app and mounts App
- src/index.css: The page styles
- package.json: Scripts and dependencies (Vite, React, Vitest)

Existing acceptance criteria (must preserve AC1–AC6):
- AC1: Reject start >= end and requests in the past.
- AC2: Enforce the maximum allowed duration (120 minutes).
- AC3: Reject a blocked room.
- AC4: Reject overlaps; allow bookings that only touch at endpoints.
- AC5: Return Available / Unavailable without changing booking data.
- AC6: Clear, responsive feedback on desktop and mobile.

New requirements (room selection & filtering):
- Extend from one room to a catalog of at least four fictional rooms. Each room has an ID, name, capacity, equipment list, blocked status, and its own bookings.
- Display only rooms matching user requirements. Availability check must use the chosen room's bookings.
- F1: Capacity filter: room capacity must be greater than or equal to the requested attendees.
- F2: Equipment filter: the room must contain ALL selected required items.
- F3: A blocked room cannot be reported as available.
- F4: Show a clear empty state when no rooms match.
- F5: Changing the selected room must refresh the availability result appropriately.

Constraints:
- Fictional bookings and a fixed current time only. No login, payments, live APIs, or database.
- Do NOT write any code yet and do NOT propose a full rewrite.

Task:
Identify the key maintainability risks in my current codebase (referencing specific files and functions) and propose a small, step-by-step improvement plan ordered from smallest safe change to final UI integration.

```

## 3. Codebase analysis (Task 1)

### 3.1 Maintainability risks

<!-- At least three, found in YOUR starting code. "Where" names a file or a function(),
     e.g. src/App.tsx, check(). Evidence is what you saw, not what the assistant said.
     Priority: High / Medium / Low. -->

| # | Risk | Where (file / function) | Evidence | Priority |
| --- | --- | --- | --- | --- |
| 1 | blocked is stored as standalone UI state instead of a property on each room | src/App.tsx (App component state) | blocked is managed as a single boolean state variable in App.tsx and passed directly to canBook(), which creates a conflict with room-level blocked properties and risks bypassing F3 when switching rooms. | High |
| 2 | result is stored as imperative state rather than refreshed on room/filter changes | src/App.tsx (App state & check()) | result only updates when check() runs; switching the selected room or changing filters leaves the previous room's Available/Unavailable status on screen, directly violating F5. | High |
| 3 | 
	canBook() takes loose primitive parameters instead of a room entity
 | src/booking.ts (canBook) | canBook({ start, end, now, blocked, bookings }) has no binding between a room's blocked flag and its bookings array, allowing mismatched room data to be passed silently without a checkRoom(room, ...) wrapper. | Medium |

### 3.2 Improvement plan — before editing

<!-- Numbered, in the order you will do it, smallest safe step first. Written BEFORE you change
     code: the commit that adds this section comes before the commit that changes app/src. -->

1. Confirm baseline: Verify all 19 existing tests in src/booking.test.ts (T01–T14, X1, X2, AC5, BUG-A, BUG-B) pass before modifying any source files.
2. dd room catalog (src/rooms.ts): Define the Room type (id, name, capacity, equipment, blocked, bookings) and export ROOMS with at least 4 fictional rooms (varied capacities and equipment, at least one blocked room, and bookings allowing endpoint-touching checks)
3. Add pure filtering module (src/filter.ts) + tests: Implement filterRooms(rooms, { minCapacity, requiredEquipment }) for F1 (capacity >=) and F2 (all selected equipment present), and add unit tests covering F1, F2, and empty matches (F4).

### 3.3 One AI suggestion I rejected or modified

| Suggestion (as the assistant made it) | Decision | Why — with the AC, F-rule, test or file behind it |
| --- | --- | --- |
| Create src/types.ts for Room/Booking types and src/roomFilter.ts for the filter function (Steps 2 & 4 of Claude's plan). | Modified | 
	SIS #04 §2 and §7 require exact module names (src/rooms.ts holding the Room type + ROOMS, src/filter.ts exporting filterRooms, and src/booking.ts exporting canBook + checkRoom), which tests/check_sis.py checks automatically. |

## 4. Feature extension (Task 2)

### 4.1 What I added

<!-- Short: the catalog (how many rooms, which equipment), how the filter is chosen on the page,
     what the empty state says, what happens to an old result when the room changes. -->
Room catalog (src/rooms.ts): Added the Room type and ROOMS array with 4 fictional rooms (Room 101 — Study Pod cap 4, Room 202 — Seminar Room cap 12, Room 305 — Lecture Lab cap 30, and blocked Room 404 — Maintenance Hall cap 20) using equipment tags "projector", "whiteboard", and "video-conference".
Filtering (src/filter.ts): Added filterRooms(rooms, { attendees, equipment }), which keeps rooms with capacity >= attendees (F1) that include every selected equipment item (F2).
Room-level check (src/booking.ts): Added checkRoom(rooms, roomId, request) to look up the chosen room and call canBook() with that room's own blocked status and bookings array (returning false for unknown IDs or blocked rooms, F3).
UI controls & state (src/App.tsx): Added a number input for minimum attendees, checkboxes for equipment filters (projector, whiteboard, video-conference), and a room selector showing matching rooms. When filters leave zero matches, an empty-state message ("No rooms match the selected capacity and equipment requirements.") replaces the selector and disables checking (F4). Changing the selected room or filter criteria immediately clears/refreshes the displayed availability result so stale results never remain on screen (F5).


### 4.2 Demonstration

<!-- One row per screenshot in evidence/. Say what is on it: the filter values, the rooms shown,
     the room selected, the times entered and the result. -->

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | Filter set to 10 attendees and projector checked; only matching rooms (Room 202 — Seminar Room, Room 305 — Lecture Lab, and Room 404 — Maintenance Hall) appear in the room list, while Room 101 (capacity 4, no projector) is excluded. |
| `evidence/filter-empty.png` | Filter set to 50 attendees with projector and video-conference checked; zero rooms match and the empty-state message ("No rooms match the selected capacity and equipment requirements.") is displayed (F4). |
| `evidence/switch-a.png` | Room 101 — Study Pod selected with time 10:00–10:30 (600–630, now = 540), showing Unavailable because Room 101 has an existing booking from 10:00–11:00. |
| `evidence/switch-b.png` | With the same time (10:00–10:30) still entered, switching selection to Room 202 — Seminar Room refreshes the result and shows Available because Room 202 is free during that slot (F5). |
| `evidence/narrow.png` | 
	Mobile portrait viewport (375×812) showing stacked filter controls, room selector, time inputs, and clear availability feedback without horizontal overflow (AC6).
 |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | Defines the `Room` type and exports the fictional `ROOMS` catalog (4 rooms with ID, name, capacity, equipment list, blocked status, and bookings) |
| `src/booking.ts` | Preserves `canBook()` (AC1–AC5) unchanged and exports `checkRoom(rooms, roomId, request)` to look up a room and evaluate its own `blocked` status and `bookings` |
| `src/filter.ts` | Exports pure function `filterRooms(rooms, criteria)` to filter the catalog by minimum attendee capacity (F1) and required equipment items (F2) |
| (write here) | Manages UI state (selected room, time inputs, attendee/equipment filters), renders the controls, empty state (F4), and refreshed availability output (F5) without holding room data or business rules |

### 5.2 Design decisions

<!-- At least two. The alternative is what you could have done instead (often what the assistant
     proposed). The why names an AC, an F-rule, a test or a risk from 3.1. -->

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| Keep blocked rooms visible in the filtered room selector with a `— Blocked` label while `checkRoom()` always evaluates them as `Unavailable` (F3) | Hide blocked rooms completely inside `filterRooms()` | Hiding blocked rooms prevents users from seeing that a room matching their capacity/equipment exists or testing F3 directly in the UI; keeping them visible and rejecting them via `checkRoom()` satisfies F3 and preserves clear feedback (AC6) |
| Keep `canBook()` untouched and build `checkRoom()` as a thin wrapper around it in `src/booking.ts` | Modify `canBook()`'s signature directly to accept a `Room` object | Preserving `canBook()`'s exact signature guarantees zero regression across all 19 baseline tests (`T01`–`T14`, `X1`, `X2`, `AC5`, `BUG-A`, `BUG-B`) and directly mitigates Risk #3 from §3.1 |

### 5.3 Duplication removed

<!-- One row per duplicated location that is gone. Count what you can point at, nothing else. -->

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| `src/App.tsx` (`type Room`, `type Interval`, and hardcoded `ROOMS` array defined inline inside the UI component alongside inline room fixtures in `src/booking.test.ts`) | Consolidated into a single typed `Room` definition and `ROOMS` catalog in `src/rooms.ts`, imported by `App.tsx`, `booking.ts`, `filter.ts`, and test files |

## 6. Automated tests (Task 4)

### 6.1 Test plan

<!-- One row per required ID. A test may carry several IDs in its title,
     e.g. test('T06 B1 AC2: exactly 120 minutes is available', …) covers B1 and AC2. -->

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | `T02 AC1: starts now (540–570) should be rejected` | `start: 540, end: 570, now: 540` → `false` |
| AC2 | `B1 AC2: checkRoom accepts exactly 120 minutes (720-840)` | `room-b`, `start: 720, end: 840, now: 540` → `true` |
| AC3 | `F3 AC3: checkRoom rejects a blocked room even with empty bookings` | `room-blocked`, `start: 600, end: 660, now: 540` → `false` |
| AC4 | `B3 AC4: checkRoom allows booking touching existing booking at endpoint (660-720)` | `room-a`, `start: 660, end: 720, now: 540` → `true` |
| AC5 | `F5 AC5: checkRoom uses chosen room bookings and leaves catalog unchanged` | `room-a` vs `room-b` at `600–630` → `false`, `true`, data unchanged |
| F1 | `F1 B5: capacity exactly equal to requested attendees includes the room` | `attendees: 10, equipment: []` → `['r2', 'r3', 'r4']` |
| F2 | `F2: equipment filter requires all selected items` | `attendees: 1, equipment: ['projector', 'whiteboard']` → `['r2', 'r3']` |
| F3 | `F3 AC3: checkRoom rejects a blocked room even with empty bookings` | `room-blocked`, `start: 600, end: 660, now: 540` → `false` |
| F4 | `F4: returns empty array when no rooms match criteria` | `attendees: 50, equipment: ['projector']` → `[]` |
| F5 | `F5 AC5: checkRoom uses chosen room bookings and leaves catalog unchanged` | Same slot `600–630` across `room-a` and `room-b` → different results |
| B1 | `B1 AC2: checkRoom accepts exactly 120 minutes (720-840)` | Duration `120` min → `true` |
| B2 | `B2 AC2: checkRoom rejects 121 minutes (720-841)` | Duration `121` min → `false` |
| B3 | `B3 AC4: checkRoom allows booking touching existing booking at endpoint (660-720)` | Touching at `660` → `true` |
| B4 | `B4 AC4: checkRoom rejects booking overlapping existing booking (630-690)` | Overlapping `600–660` → `false` |
| B5 | `F1 B5: capacity exactly equal to requested attendees includes the room` | `attendees: 10` on capacity `10` room → included |
| B6 | `F1 B6: capacity one below requested attendees excludes the room` | `attendees: 11` on capacity `10` room → excluded |
| INT | `INT: filterRooms followed by checkRoom verifies availability on matching rooms` | `filterRooms` then `checkRoom` on `r2` and `r3` at `720–780` → `true`, `false` |

### 6.2 Commands

<!-- The commands exactly as you typed them, from app/. -->

```text
npx vitest run
```

### 6.3 Final run

<!-- The REAL output of the full run on your final code. Every test passes, and the number of
     tests equals what your test files hold (R2). -->

```text
v2.1.9 /Users/akniet/Documents/kbtu/se-practice/sis-04/app

 ✓ src/booking.test.ts (25)
 ✓ src/filter.test.ts (5)

 Test Files  2 passed (2)
      Tests  30 passed (30)
   Start at  21:33:46
   Duration  189ms (transform 30ms, setup 0ms, collect 35ms, tests 3ms, environment 0ms, prepare 56ms)
```

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | 19/19 | 30/30 | `1.1` and `6.3` Vitest runs |
| Duplicated logic locations removed | 0 | 2 | Counted rows in `5.3` |
| Code structure: modules and their responsibilities | 4 files (`App.tsx`, `booking.ts`, `booking.test.ts`, `main.tsx`); `App.tsx` held room data, blocked state, and UI | 7 files (`rooms.ts`, `booking.ts`, `filter.ts`, `App.tsx`, `main.tsx`, `booking.test.ts`, `filter.test.ts`); separated per `5.1` | `git ls-files app/src` before and after, compared with `5.1` |
| Remaining limitation | Single room only; `blocked` was global UI state | Time inputs are plain `HH:MM` strings parsed inside `App.tsx` rather than a dedicated time-parsing helper, and no rendered UI component tests (`@testing-library/react`) are included | Code inspection of `app/src/App.tsx` and `app/package.json` |

## 8. AI evidence appendix

<!-- At least three exchanges, one ### 8.N block each: the analysis (Task 1), the plan, and at
     least one implementation, refactoring or test exchange. Copy the block for more.
     The prompt as you sent it; the output may be cut to the part you used, with "[…]" where
     you cut. Verified by: the test, run, file or check that confirmed it — not "it looked right". -->

### 8.1 Exchange 1

**Tool and model:** Claude Sonnet 5.5
**Date:** 2026-11-22
**Purpose:** Task 1 — Codebase analysis and maintainability risk identification

**Prompt:**

```text
I am extending a Smart Campus Room Availability Checker (TypeScript + React + Vitest) without breaking existing functionality.

Here is the repository map:
- src/booking.ts: canBook({ start, end, now, blocked, bookings }): the availability decision, with the AC1-AC4 conditions, returning true or false
- src/booking.test.ts: The Vitest suite: the T01-T14 cases, X1, X2, AC5 and the BUG-A and BUG-B regression tests
- src/App.tsx: The page: state for room, current time, start, end, blocked and result, the check() function, and the form
- src/main.tsx: Starts the React app and mounts App
- src/index.css: The page styles
- package.json: Scripts and dependencies (Vite, React, Vitest)
[…]
Task:
Identify the key maintainability risks in my current codebase (referencing specific files and functions) and propose a small, step-by-step improvement plan ordered from smallest safe change to final UI integration.
```

**Output used:**

```text
## Key maintainability risks

src/App.tsx → state and check()
5. blocked is UI state. With a catalog, blocked status becomes room data. Keeping both creates two sources of truth, and F3 could be bypassed.
6. result is stored state, not derived. After a room change the old Available/Unavailable stays on screen, which is exactly the F5 failure.
7. check() likely mixes parsing, state reads and the canBook call, so there is no seam to test room-specific behavior without rendering the component.
[…]
```

**Problems found:** Claude inferred risks from the repository map without seeing `App.tsx` directly, so some items (like shared bookings arrays or inline constants) were speculative rather than confirmed in code.
**Changes made:** Inspected `src/App.tsx` and `src/booking.ts` directly and kept only the risks verified in the actual source lines (global `blocked` state, stale `result` state on room change, and lack of a room-level `checkRoom` wrapper).
**Verified by:** Direct inspection of `app/src/App.tsx` and `app/src/booking.ts`, recorded in `report.md` §3.1.

### 8.2 Exchange 2

**Tool and model:** Claude Sonnet 5.5
**Date:** 2026-11-22
**Purpose:** Task 1 — Step-by-step refactoring and extension plan

**Prompt:**

```text
I am extending a Smart Campus Room Availability Checker (TypeScript + React + Vitest) without breaking existing functionality.

Here is the repository map:
- src/booking.ts: canBook({ start, end, now, blocked, bookings }): the availability decision, with the AC1-AC4 conditions, returning true or false
- src/booking.test.ts: The Vitest suite: the T01-T14 cases, X1, X2, AC5 and the BUG-A and BUG-B regression tests
- src/App.tsx: The page: state for room, current time, start, end, blocked and result, the check() function, and the form
- src/main.tsx: Starts the React app and mounts App
- src/index.css: The page styles
- package.json: Scripts and dependencies (Vite, React, Vitest)
[…]
Task:
Identify the key maintainability risks in my current codebase (referencing specific files and functions) and propose a small, step-by-step improvement plan ordered from smallest safe change to final UI integration.
```

**Output used:**

```text
1. Baseline. Run the Vitest suite and confirm T01-T14, X1, X2, AC5, BUG-A and BUG-B are green. Every later step must end green.
2. Add types only (e.g. src/types.ts: Room, Booking, Request). No behavior change.
3. Add the fixed catalog and fixed NOW (e.g. src/rooms.ts). Use at least four rooms with varied capacity and equipment, one blocked room, and one with a booking that touches a requested slot at an endpoint.
4. Add a pure filter function (e.g. src/roomFilter.ts) with its own test file covering F1, F2, and F4. Leave canBook untouched.
5. Add a thin wrapper that takes a room and a request and calls canBook with that room's blocked and bookings.
```

**Problems found:** The assistant proposed creating `src/types.ts` and `src/roomFilter.ts`, which violates the fixed filenames mandated in SIS #04 §2 and §7 (`src/rooms.ts`, `src/filter.ts`, `src/booking.ts`).
**Changes made:** Modified the plan to put `Room` and `ROOMS` inside `src/rooms.ts`, `filterRooms` inside `src/filter.ts`, and `checkRoom` inside `src/booking.ts`.
**Verified by:** Checked against SIS #04 §2 and §7 module specifications and committed in `report.md` §3.2–§3.3 before editing `app/src`.

### 8.3 Exchange 3

**Tool and model:** Claude Sonnet 5.5
**Date:** 2026-11-22
**Purpose:** Task 2 & Task 3 — Implementing `rooms.ts`, `filter.ts`, `checkRoom`, and refactoring `App.tsx`

**Prompt:**

```text
Implement src/rooms.ts, src/filter.ts, checkRoom in src/booking.ts, and refactor src/App.tsx and src/index.css to use ROOMS, filterRooms, and checkRoom while preserving AC1–AC6 and satisfying F1–F5
```

**Output used:**

```text
export function filterRooms(
  rooms: Room[],
  criteria: { attendees: number; equipment: string[] }
): Room[] {
  return rooms.filter((room) => {
    const fitsCapacity = room.capacity >= criteria.attendees;
    const hasAllEquipment = criteria.equipment.every((item) =>
      room.equipment.includes(item)
    );
    return fitsCapacity && hasAllEquipment;
  });
}
```

**Problems found:** Needed to ensure `App.tsx` auto-refreshes or clears `result` when switching rooms (F5) and displays a clear empty state when `matchingRooms.length === 0` (F4) without keeping the old global `blocked` checkbox.
**Changes made:** Added `handleRoomChange`, `handleAttendeesChange`, and `toggleEquipment` handlers in `src/App.tsx` to immediately update or clear stale results, and rendered `(Blocked)` labels on blocked rooms while delegating availability to `checkRoom()`.
**Verified by:** Passing 30/30 Vitest suite (`npx vitest run`) and the 5 browser screenshots in `evidence/`.

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| none | All checks in `tests/check_sis.py` passed. |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

During this project, I used an AI assistant to analyze and improve my Smart Campus Room Availability Checker. I provided the assistant with the repository structure, existing acceptance criteria, new requirements, and project limitations. I also explained that I wanted to improve the existing code without breaking its current functionality.

Some AI suggestions were useful, especially the idea of separating room data, filtering logic, and booking logic into different modules. This helped make the project easier to understand and maintain. However, I did not follow every suggestion exactly. For example, I changed the proposed file structure and used src/rooms.ts and src/filter.ts because these were the required module names for the assignment.

I personally checked the existing booking functionality and compared the test results before and after the changes. Initially, 19 tests passed. After implementing the new features, 30 tests passed successfully. I also checked the room filtering conditions, blocked room behavior, and availability when switching between different rooms.

Tests played an important role in my decisions because they helped me make sure that the new features did not break the original functionality. They also helped me find problems with room selection and booking conditions.

If I continued working on this project, I would improve the time input validation, add UI component tests, and make the interface more user-friendly. Overall, this project helped me understand why separating responsibilities and testing changes are important in software development.
