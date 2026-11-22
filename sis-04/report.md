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

(write here)

### 4.2 Demonstration

<!-- One row per screenshot in evidence/. Say what is on it: the filter values, the rooms shown,
     the room selected, the times entered and the result. -->

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | (write here) |
| `evidence/filter-empty.png` | (write here) |
| `evidence/switch-a.png` | (write here) |
| `evidence/switch-b.png` | (write here) |
| `evidence/narrow.png` | (write here) |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | (write here) |
| `src/booking.ts` | (write here) |
| `src/filter.ts` | (write here) |
| (write here) | (write here) |

### 5.2 Design decisions

<!-- At least two. The alternative is what you could have done instead (often what the assistant
     proposed). The why names an AC, an F-rule, a test or a risk from 3.1. -->

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) |

### 5.3 Duplication removed

<!-- One row per duplicated location that is gone. Count what you can point at, nothing else. -->

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| (write here) | (write here) |

## 6. Automated tests (Task 4)

### 6.1 Test plan

<!-- One row per required ID. A test may carry several IDs in its title,
     e.g. test('T06 B1 AC2: exactly 120 minutes is available', …) covers B1 and AC2. -->

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | (write here) | (write here) |
| AC2 | (write here) | (write here) |
| AC3 | (write here) | (write here) |
| AC4 | (write here) | (write here) |
| AC5 | (write here) | (write here) |
| F1 | (write here) | (write here) |
| F2 | (write here) | (write here) |
| F3 | (write here) | (write here) |
| F4 | (write here) | (write here) |
| F5 | (write here) | (write here) |
| B1 | (write here) | (write here) |
| B2 | (write here) | (write here) |
| B3 | (write here) | (write here) |
| B4 | (write here) | (write here) |
| B5 | (write here) | (write here) |
| B6 | (write here) | (write here) |
| INT | (write here) | (write here) |

### 6.2 Commands

<!-- The commands exactly as you typed them, from app/. -->

```text
(paste here)
```

### 6.3 Final run

<!-- The REAL output of the full run on your final code. Every test passes, and the number of
     tests equals what your test files hold (R2). -->

```text
(paste here)
```

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | (write here) | (write here) | (write here) |
| Duplicated logic locations removed | (write here) | (write here) | (write here) |
| Code structure: modules and their responsibilities | (write here) | (write here) | (write here) |
| Remaining limitation | (write here) | (write here) | (write here) |

## 8. AI evidence appendix

<!-- At least three exchanges, one ### 8.N block each: the analysis (Task 1), the plan, and at
     least one implementation, refactoring or test exchange. Copy the block for more.
     The prompt as you sent it; the output may be cut to the part you used, with "[…]" where
     you cut. Verified by: the test, run, file or check that confirmed it — not "it looked right". -->

### 8.1 Exchange 1

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.2 Exchange 2

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.3 Exchange 3

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| (write here) | (write here) |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

(write here)
