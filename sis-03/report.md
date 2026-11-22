# SIS #03 — Report: Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 13.) and every
     ### sub-heading, and the **Label:** words — the checker finds your answers by them.
     Replace every "(write here)" and "(paste here)". Delete these <!-- --> comments if you like. -->

## 1. Setup and reuse

<!-- Model: the exact model with its version, as the tool shows it ("ChatGPT" is a tool, not a
     model). If the tool does not show it, write: not displayed
     Reuse: week-05 if code/original/booking_v1.py is your Week 05 v1, copied unedited;
     week-06 if web/original/ is your Week 06 v1 export; fresh if you generated it for this SIS. -->

| Item | Value |
| --- | --- |
| Coding assistant (tool) | Claude |
| Coding assistant model | Sonnet 5.5 |
| Bolt.new model | not displayed |
| Bolt project link | https://bolt.new/~/sb1-vthn18be |
| Language | Python |
| Path | A |
| Python v1 from | fresh |
| Web v1 from | fresh |

## 2. Baseline — before any new AI exchange

<!-- Written by you, without AI, before the first exchange of this SIS. Commit and push it
     first (README §2). Reusing Week 05/06 work does not exempt you: this section is new. -->

### 2.1 Scope in my own words #

**Scope:** Student can check the availability of room, but the system can see only this. Student can not create or confirm booking. This booking is fictional only and it there is no login, database, API, payments and else

### 2.2 The acceptance criteria in my own words #

| AC | In my own words |
| --- | --- |
| AC1 | Times are whole minutes after midnight. Start is at least  and end is more than start and at most 1440 and start must be later than now |
| AC2 | Students have only permitted 120 minutes  |
| AC3 | If the room is blocked, the request from students will be rejected |
| AC4 | If srudent have overlapping booking times, it will be rejected. But if the another booking starts after the first one will finish, it's ok |
| AC5 | The system can not change the existing bookings, and after selecting time there will be only 2 outputs - available and unavailable |
| AC6 | The system will have understandable feedback and convenient interface for mobile phones |

### 2.3 Likely failure points #

<!-- At least two. The brief's examples: endpoint overlap, starts-now. -->

| # | Failure point | AC | How I will check it |
| --- | --- | --- | --- |
| 1 | Start equal to now is accepted | AC1 | Test start == now and expect False |
| 2 | A 120-minute booking is rejected or will 121 is accepted | AC2 | Test durations of 120 and 121 |

### 2.4 The contract #

| Parameter | Meaning | Type and allowed values |
| --- | --- | --- |
| `start` | Start time | int, from 0 to 1439 |
| `end` | End time | int, up to 1440 |
| `now` | Current time | int, from 0 to 1439 |
| `blocked` | Reserved timeslot that is blocked | boolean |
| `existing` | Is booking of this time exsiting or not | collection of integer pairs |
| returns | whether the request is allowed | True if success, false if not |

### 2.5 Initial assumptions and manual checks #

**Assumptions:**

1. existing contains only valid pairs
2. now is only valid from 0 to 1439

**Checked manually:**

- Worked through the inclusive and 120-minute cases by hand on paper. Me results were True, False, True, True, False

## 3. Python v1 review

<!-- One row per conditional branch in code/original/booking_v1.py (your language's v1 on
     Path B). Quote the condition exactly. AC1-AC4 must all appear in the AC column. -->

| Branch in v1 (quoted) | AC | Satisfies it? | Why |
| --- | --- | --- | --- |
| if blocked, return False | AC3 | Yes | Blocked room should be rejected before any other check, so other checks won't be needed |
| if not (0 <= start < end <= 1440): return False | AC1 | Yes | Matches `0 <= start < end <= 1440` exactly, so end 1440 is inclusive and 1441 is not |
| if start <= now: return False | AC1 | Yes | Start should be after this time and start == now will be rejected |
| if end - start > 120: return False | AC2 | Yes | Every duration should be 120 mintues, only 120 is allowed |

## 4. Prototype v1 in Bolt.new

**Prompt as sent:**

~~~~text
Build one responsive web page called "Smart Campus Room Availability Checker" for ONE selected room, using fictional booking data. The page only checks availability; it does not create or confirm bookings.

User story: As a student, I want to check a room's availability so that I can choose a valid booking time.

Rules:
- AC1: Candidate times are integer minutes after midnight: 0 <= start < end <= 1440. Start must be strictly after the current time (now).
- AC2: Duration must not exceed 120 minutes. Exactly 120 minutes is permitted.
- AC3: Reject every request when the selected room is blocked.
- AC4: Reject overlap with any existing booking. Intervals touching at an endpoint do not overlap. Intervals include their start and exclude their end.
- AC5: Show an unambiguous Available or Unavailable result. Never change the existing bookings.
- AC6: Show understandable validation messages and a usable layout on a narrow mobile screen.

Constraints: no login, no backend, no database, no external API, no payments, and no unrelated features. All logic runs in the browser with fictional data. Do not add a cleaning buffer, a shorter limit than 120 minutes, or a Book button.
~~~~

<!-- Main generated files or components, with their path inside web/original/
     (for example src/App.tsx). At least two. -->

| Generated file or component | Path | Its role |
| --- | --- | --- |
| package.json | sis-03/web/original/project/package.json | it's the project configuration |
| index.html | sis-03/web/original/project/index.html | html did the structure of the site, the first page that loads first |

**What v1 does:**

- AC1 requires the range 0 <= start < end <= 1440. AC2 the duration always should be 120 minutes. AC1 booking time should be greater than this time

## 5. Test cases — executed on both artifacts

<!-- Base for every case unless the row says otherwise: now = 540, blocked = False,
     existing = [(600, 660)]. Do not change the first four columns.
     Python columns: True, False or Error (it raised) — what the call actually returned.
       T11: the result of the SECOND call. T12: n/a.
       Path A: the checker runs both of your files on T1-T11 and compares (C2, C3).
     Page columns: Available, Unavailable or Not testable — what the page actually showed.
     Never write a result you did not observe. -->

| Case | Name | Input | Expected | Python v1 | Python final | Page v1 | Page final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 660–720 | Available | True | True | Unavailable | |
| T2 | Overlap | 630–690 | Unavailable | False | | Available | |
| T3 | Blocked | 660–720, blocked | Unavailable | False | | Available | |
| T4 | Exactly 120 min | 720–840 | Available | True | True | Unavailable | |
| T5 | 121 min | 720–841 | Unavailable | False | | Available | |
| T6 | Starts now | 540–570 | Unavailable | False | | Available | |
| T7 | Reversed | 720–660 | Unavailable | False | | Available | |
| T8 | Ends at midnight | 1380–1440 | Available | True | True | Unavailable | |
| T9 | Past midnight | 1380–1441 | Unavailable | False | | Unavailable| |
| T10 | Second booking | 720–780, existing (600–660), (700–760) | Unavailable | False | | Available | |
| T11 | Same check twice | 660–720, twice | Available | True | True | Unavailable | |
| T12 | Narrow screen | T1 at ~375 px wide | Available | n/a | n/a | | |

## 6. Traceability

<!-- His table. Implementation / file: where the rule lives (booking.py line, a component).
     Test input: the case IDs from section 5. v1 / final actual: what those cases gave. -->

| AC | Implementation / file | Test input | Expected | v1 actual | Final actual |
| --- | --- | --- | --- | --- | --- |
| AC1 | booking.py: range and `start <= now` checks | T6, T7, T8, T9 | Unavailable, Unavailable, Available, Unavailable | Python as expected and page affected by the live clock | (write here) |
| AC2 | booking.py: `end - start > 120` | T4, T5 | Available, Unavailable | Python as expected, page Unavailable | (write here) |
| AC3 | booking.py: `if blocked` | T3 | Unavailable | Python False, page Not testable | (write here) |
| AC4 | booking.py: overlap loop | T1, T2, T10 | Available, Unavailable, Unavailable | Python as expected, page affected by clock | (write here) |
| AC5 | existing only read in the loop | T11 | Available, unchanged | Python True, existing unchanged | (write here) |
| AC6 | page: validation messages, layout | T12 | usable at 375 px | (write here) | (write here) |

## 7. Issue log

<!-- At least two, from v1 — a functional defect and a usability or code-quality issue where you
     have them. If every case passed on v1, log the preventive cleanup and say why.
     Reproduction names a case (T1-T12) or an AC. Priority: High, Medium or Low.
     Prompt / change: the focused prompt you sent, and what changed. Never "make it better". -->

| # | Issue | Reproduction | Priority | Prompt / change | Retest result |
| --- | --- | --- | --- | --- | --- |
| 1 | The page uses the real clock and a fixed booking list, so the base data can not be set. Valid requests such as 11:00-12:00 show Unavailable | T1, T4, T11, AC1 | High | "Add a current-time input defaulting to 09:00 and a room-blocked toggle. Use one fictional booking 10:00-11:00. Do not change the availability rules or add a Book button." | (write here) |
| 2 | Python v1 contains type checks (isinstance, bool) that the contract does not ask for; preventive cleanup, since v1 passed T1-T11 | AC1, contract | Low | "Remove the type-check loop; keep the signature and the AC1-AC4 checks unchanged." | (write here) |

**Before / after:** `evidence/before-1.png` → `evidence/after-1.png` show issue (write here)

## 8. Critique decisions

<!-- The AI's review against AC1-AC6 (stage C), claim by claim. At least three rows.
     How I verified it: the case, test or run that confirmed or refuted the claim.
     Decision: accept, reject or modify. At least one reject or modify — the reflection asks for it. -->

| # | AI claim or recommendation | How I verified it | Decision | Reason (AC or case) |
| --- | --- | --- | --- | --- |
| 1 | Show the values actually sent to can_book next to the result | The page shows "now 6:01 PM" and only start and end fields. It has no field for blocked or bookings, so its inputs differ from my test base | modify | AC1, AC4, AC5 |
| 2 | Override the clock and test now = 659, 660, 661 for a request starting at 660 | Called can_book(660, 720, now, False, []) for the three values in Python; the page clock cannot be changed | modify | AC1 |
| 3 | Look for controls for the blocked state and for bookings | Inspected the page: no blocked toggle and no booking editor | accept | AC4, AC5, AC3 |

## 9. Coding-agent analysis

### 9.1 The loop

<!-- One real pass through the loop from this assignment — with your assistant or with Bolt. -->

| Step | What happened in this assignment |
| --- | --- |
| User goal | I wanted to check my room booking function and my Bolt page against AC1-AC6, and find problems without having the code rewritten for me |
| Model / plan | Claude read the can_book function and the page description and compared them with the six rules. The plan was to list each problem with the rule it breaks and a way to check it |
| Tool call | I ran the test cases T1-T11 on my Python v1 and on the Bolt page, using the base values now = 540, room not blocked, and one booking 600-660. I also tried the checks Claude suggested, like calling can_book(660, 720, now, False, []) for different now values |
| Observation | Python v1 gave the expected answers on all cases. The Bolt page gave the wrong answer on almost every case. Valid requests like T1, T4 and T11 showed Unavailable, and bad requests like T3, T5 and T7 showed Available. So the page has a bigger problem than only the real clock |
| Next step | I wrote this in my issue log and planned a focused prompt for Bolt to add a current-time input and a blocked toggle, and use one fictional booking |
| Human review | I checked Claude’s claims myself instead of trusting them. I changed row 2 because the page’s real clock can’t be changed, so I keep the direct function test and mark that page check as not possible |

### 9.2 Context, tools and permissions

<!-- At least three rows. Last column: Observed (you saw it happen) or Assumed (you infer it
     about the internals). Use both at least once. -->

| Tool | Context it used | Tools or permissions | Observed or assumed |
| --- | --- | --- | --- |
| Claude | the criteria and my code | it only returned text | Observed |
| Bolt.new | My prompt plus its own clarifying questions and a mockup description | Created and edited project files and showed a live preview | Observed |
| Bolt.new | Likely a template project and installed packages | Probably runs a build server and installs dependencies | Assumed |

### 9.3 Checkpoint and dependability

**Safety checkpoint:** I run all the cases and the unit tests and read the full README.md

**Reliability, security, responsibility:** The assistant’s code passed my cases only because I wrote the expected values from the criteria first, so reliability depends on my tests, not on the tool’s confidence

## 10. Reflection

<!-- 100-200 words, in your own words, no AI. Compare AI-assisted coding (the Python part) with
     vibe coding (the Bolt part); one example each of a reliability, an availability/usability and
     a security risk; why review, tool permissions and tests stay human responsibilities; one AI
     recommendation you rejected or modified, and why; what you would improve next without
     expanding the scope. -->

Using the assistant for the function was controlled: I gave exact rules, got a short function, and could check every branch, and it passed T1-T11 straight away. Bolt.new was vibe coding. It made a polished page quickly but used the real clock, so my fixed test cases could not run. Reliability risk: valid requests showed Unavailable. Usability risk: I could not set a blocked room or bookings. Security risk: the v1 project contained backend or database code I never requested. Review, tool permissions and tests stay my responsibility because the tool does not know my criteria. I modified the clock-override recommendation, because the page’s real clock could not be changed, so I tested the function directly instead. Next I would add visible test controls without adding any booking feature.

## 11. Appendix A — AI exchanges

<!-- At least four. Complete prompts and complete responses, as text — never screenshots. Paste
     each inside the ~~~~ block that follows its label.
     Stage: Plan, Generate, Critique or Repair (the brief's A-D) — at least one of each.
     Source: this SIS, week-05 or week-06. Reused exchanges keep their original date.
     The Generate exchange for Python must contain your v1 exactly as it is in code/original/.
     Add B5, B6 … if you ran more. -->

### B1

- **Tool:** Claude
- **Model:** Sonnet 5.5
- **Date:** 2026-11-1
- **Stage:** Generate
- **Source:** internet

**Prompt:**

~~~~text
I need a Python function can_book(start, end, now, blocked, existing) for checking whether a room can be booked. Use only the standard library.

Rules:
- AC1: start and end are integer minutes after midnight, 0 <= start < end <= 1440, and start must be strictly after now.
- AC2: duration must not exceed 120 minutes; exactly 120 is allowed.
- AC3: reject every request when the room is blocked.
- AC4: reject overlap with any existing booking; intervals touching at an endpoint do not overlap.
- existing is a collection of (start, end) pairs and must never be modified. Return True only when AC1-AC4 all hold, otherwise False.
- Do not add a cleaning buffer, a shorter limit, or anything else that changes these rules.

Do not write code yet. Give me a short plan: the checks you will make and in what order, your assumptions, and a list of boundary tests.
~~~~

**Response:**

~~~~text
```python
def can_book(start, end, now, blocked, existing):
    # AC3: a blocked room rejects every request.
    if blocked:
        return False

    # AC1: integer minutes only (bool is a subclass of int, so exclude it).
    for value in (start, end, now):
        if not isinstance(value, int) or isinstance(value, bool):
            return False

    # AC1: valid range.
    if not (0 <= start < end <= 1440):
        return False

    # AC1: start must be strictly after now.
    if start <= now:
        return False

    # AC2: duration at most 120 minutes (exactly 120 is allowed).
    if end - start > 120:
        return False

    # AC4: reject overlap with any existing booking (read-only).
    # Half-open test: touching at an endpoint is not an overlap.
    for s, e in existing:
        if start < e and s < end:
            return False

    return True
```
~~~~

### B2

- **Tool:** Claude
- **Model:** Sonnet 5.5
- **Date:** 2026-11-1
- **Stage:** Critique
- **Source:** internet

**Prompt:**

~~~~text
Review this Python function and this web page against acceptance criteria AC1-AC6. For each concern, cite the line or component and the criterion it affects, and say how I could check it. Do not rewrite anything.

AC1: integer minutes after midnight, 0 <= start < end <= 1440, start strictly after now. AC2: duration at most 120, exactly 120 allowed. AC3: reject everything when the room is blocked. AC4: reject overlap with any existing booking; touching endpoints do not overlap. AC5: clear Available/Unavailable result, never mutate existing bookings. AC6: understandable validation feedback and a usable narrow layout.


```python
def can_book(start, end, now, blocked, existing):
    # AC3: a blocked room rejects every request.
    if blocked:
        return False

    # AC1: integer minutes only (bool is a subclass of int, so exclude it).
    for value in (start, end, now):
        if not isinstance(value, int) or isinstance(value, bool):
            return False

    # AC1: valid range.
    if not (0 <= start < end <= 1440):
        return False

    # AC1: start must be strictly after now.
    if start <= now:
        return False

    # AC2: duration at most 120 minutes (exactly 120 is allowed).
    if end - start > 120:
        return False

    # AC4: reject overlap with any existing booking (read-only).
    # Half-open test: touching at an endpoint is not an overlap.
    for s, e in existing:
        if start < e and s < end:
            return False

    return True
```


The page: 

```markdown
The page uses the real clock and a fixed booking list, so the base data can not be set. Valid requests such as 11:00-12:00 show Unavailable. Python v1 contains type checks (isinstance, bool) that the contract does not ask for; preventive cleanup, since v1 passed T1-T11
```
~~~~

**Response:**

~~~~text
I read the function as pasted. The page is only a short description, so those findings are about what it says and what it leaves out. I didn't run anything.

## Python function (line 1 = `def`)

The core logic matches AC1-AC4, and I found no mutation. The concerns are about the edges.

1. **Lines 25-27, malformed `existing` entries (AC4, AC5).**
   - The loop assumes every entry is a `(s, e)` pair of numbers. `None`, a 3-tuple, or a non-iterable raises an exception instead of returning a result, which undercuts the "clear result" in AC5.
   - An entry with `s >= e` has no defined behavior. A zero-length entry strictly inside the request will count as an overlap.
   - Check: call it with `existing=[(600,)]`, `[None]`, `[(660,600)]` and `[(630,630)]` for a request of 600-720, and decide whether each outcome is intended.

2. **Lines 7-9, the type checks (AC1).** AC1 says "integer minutes", so these lines are arguably required by the contract. Without them, `60.5` and `True` pass the range checks, and `"60"` raises a `TypeError` at line 12.
   - Check: call with `(True, 90, 0)`, `(60.5, 90, 0)`, `("60", 90, 0)` and `(60, 90, None)`. All should be rejected without an exception.
   - These calls don't need a booking list, so the type checks are testable in isolation.

3. **Lines 7-9 vs. 12, `now` is only type-checked (AC1).** AC1 doesn't constrain `now`'s range, so `now=-5` or `now=2000` is accepted. That's probably fine, but the spec is silent.
   - Check: confirm with the author whether it matters. With `now=2000`, every request is rejected through line 16, which is consistent with AC1.

4. **Line 3 vs. lines 7-9, ordering (AC3).** A blocked room returns `False` before any validation, which is correct for "reject everything". It does mean invalid input and blocked input are indistinguishable (see page concern 3).
   - Check: `blocked=True` with otherwise valid, invalid and non-integer input should always return `False`.

5. **Boundary behavior (AC1, AC2, AC4), which looks correct.**
   - The tests worth running are start=0 with now=-1, end=1440, start == now, a duration of 120 vs. 121, and touching bookings.
   - With a booking of (600, 660), these should be accepted: 660-720 and 540-600. These should be rejected: 630-690, 600-660, 590-700 and 610-650.

6. **Line 25, a generator or one-shot iterable passed as `existing` (AC5).** It's consumed only once here, so this is fine. Callers that reuse the object would see it exhausted, though.
   - Check: pass a list and a copy, then compare the list afterward to confirm it is unchanged.

## Web page

1. **"Valid requests such as 11:00-12:00 show Unavailable" (AC1, AC4, AC5).** This is the biggest concern, because it describes a defect without explaining it. The function can't return `False` for a valid request unless one of these is true:
   - The real clock is already past 11:00, so line 16 rejects it.
   - The fixed list contains an overlapping booking.
   - The room is blocked.
   - The page converts the time incorrectly, for example HH:MM to minutes, 12-hour vs. 24-hour, or a string passed through so that lines 7-9 reject it.
   - Check: show the values actually sent to `can_book` (start, end, now, blocked, existing) next to the result.

2. **"Real clock" (AC1).** Behavior depends on when you test, so results aren't reproducible. Conversion also needs care: seconds have to be dropped, the timezone has to be the intended one, and shortly before midnight no valid request exists.
   - Check: stub or override the clock and test now = 659, 660 and 661 with a request starting at 660.

3. **"Fixed booking list, base data cannot be set" (AC3, AC4, AC5).** If the blocked flag and bookings can't be set, then AC3 can't be demonstrated from the page at all, and AC4 only against whatever the fixed list happens to hold.
   - Check: look for a control for the blocked state and for bookings. If none exists, those criteria are verifiable only through direct function tests.

4. **A single "Unavailable" result (AC5, AC6).** Per AC5, a clear Available/Unavailable result is fine. Per AC6, though, invalid input (end before start, over 120 minutes, empty or non-numeric fields) needs an understandable message distinct from "a conflict exists".
   - The function returns only a bool, so the page can't tell the reasons apart without duplicating the rules. Duplicated rules can drift from the function.
   - Check: submit empty fields, end <= start, a duration of 121, and a time in the past, and compare the messages. Then read the page code for any rule re-implemented outside `can_book`.

5. **Time entry vs. the AC1 range (AC1, AC6).** A standard time input can't express 24:00, so end=1440 may be impossible to enter. A value like 23:30-24:00 may be unreachable or wrongly rejected.
   - Check: attempt the last valid slot of the day and a duration of exactly 120 (for example 11:00-13:00).

6. **Narrow layout (AC6).** The description says nothing about layout, so this is unverified.
   - Check: test at about 320 and 375 px width. Look for horizontal scrolling, clipped result text, tap-target size, and whether the error message stays visible beside the field.

7. **The "type checks not asked for" note and "v1 passed T1-T11" (AC1).**
   - AC1 does ask for integer minutes, so calling lines 7-9 "preventive cleanup" conflicts with the criteria as written. Removing them would likely break the non-integer cases above.
   - I can't see T1-T11, so I can't tell whether they cover bool, float or string input, and passing them doesn't show the checks are unnecessary.
   - The page says "Python v1", and it's unclear whether the page runs this function or a different version.
   - Check: run T1-T11 plus the type cases from function concern 2 against both versions, and confirm which one the page loads.
~~~~

### B3

- **Tool:** bolt.new
- **Model:** not displayed
- **Date:** 2026-11-1
- **Stage:** Repair
- **Source:** internet

**Prompt:**

~~~~text
The page uses the real clock (now 6:01 PM) and a fixed booking list, so a valid request such as 11:00-12:00 shows Unavailable (AC1). Add a current-time input that defaults to 09:00, a room-blocked toggle, and an editable list of fictional bookings that defaults to one booking 10:00-11:00. Remove any backend, database, network request or storage code from the project. Do not change the availability rules and do not add a Book button.
~~~~

**Response:**

~~~~text
The page now uses a test scenario you can control: a current-time input that defaults to 09:00, a room-blocked switch, and an editable list of today's bookings that starts with one booking from 10:00 to 11:00. The default 11:00 to 12:00 request shows Available, since it touches the booking's end without overlapping. Changing the time, the switch, or the bookings clears the previous result, so you always check fresh.

You can add, edit, and remove bookings. The availability rules are unchanged, and there is still no Book button. I removed the unused Supabase client package, and no network, database, or storage code remains. The project builds and type-checks cleanly, but I could not view it in a browser.
~~~~

### B4

- **Tool:** bolt.new
- **Model:** not displayed
- **Date:** 2026-11-1
- **Stage:** generate
- **Source:** internet

**Prompt:**

~~~~text
Build one responsive web page called "Smart Campus Room Availability Checker" for ONE selected room, using fictional booking data. The page only checks availability; it does not create or confirm bookings.
User story: As a student, I want to check a room's availability so that I can choose a valid booking time.
Rules:

AC1: Candidate times are integer minutes after midnight: 0 <= start < end <= 1440. Start must be strictly after the current time (now).
AC2: Duration must not exceed 120 minutes. Exactly 120 minutes is permitted.
AC3: Reject every request when the selected room is blocked.
AC4: Reject overlap with any existing booking. Intervals touching at an endpoint do not overlap. Intervals include their start and exclude their end.
AC5: Show an unambiguous Available or Unavailable result. Never change the existing bookings.
AC6: Show understandable validation messages and a usable layout on a narrow mobile screen. Constraints: no login, no backend, no database, no external API, no payments, and no unrelated features. All logic runs in the browser with fictional data. Do not add a cleaning buffer, a shorter limit than 120 minutes, or a Book button.
Before you start, I answered a few questions about it:

Overall look: Clean campus utility (White cards, navy and green, plain sans). The attached image is a mockup of this look.
Build the first version from these answers:

Build it to look like the chosen mockup: its palette, type, layout, imagery style, density and the feel of its components. It is a direction, not a spec: use real components and sensible content, fix anything garbled, and don't copy text that makes no sense. The mockup was drawn from this description: "Main screen of Smart Campus Room Availability Checker for Library Study Room 2.14. Clean campus utility look: white background, navy header bar, a card with Start and End time inputs (10:00 to 12:00) and a Check button, below it a large green "Available" banner with a check icon. Then a list of today's bookings (08:30–10:00, 13:00–14:30) as grey rows. Clear sans-serif type, rounded corners, generous spacing, single-column layout that stacks on mobile."
~~~~

**Response:**

~~~~text
I built the Smart Campus Room Availability Checker as a single page for Library Study Room 2.14. It has a navy header, a white room card, a Start and End time form with a Check availability button, a large green Available or red Unavailable result, and a grey list of today's bookings. It stacks into one column on phones.

The checks follow your rules: start after the current time, at most 120 minutes, blocked rooms rejected, and overlaps rejected with touching endpoints allowed. Unavailable results list every reason in plain words. Nothing can be booked or changed.

Because you asked for no database, the bookings and room data are fictional and live only in the page. The project builds and type-checks cleanly. I could not view it in a browser here, so the layout is unverified on a real phone.
~~~~

## 12. Appendix B — Test output

### 12.1 Your suite

<!-- The complete terminal output of your final suite. Path A: python -m unittest -v, run inside
     code/ — the part ending in "Ran N tests" and OK or FAILED. -->

~~~~text
SIS #03 - can_book, the Bolt prototype, the evidence   (Path A)
Checks behaviour and shape, never the quality of your review.

PASS   R1   report.md: sections 1-13 present, in order                                       sections 1-13 present, in order
FAIL   R2   report.md: no template markers left                                              57 template marker(s) like '(write here)' still in report.md
FAIL   R3   section 1: setup and reuse table complete                                        Bolt.new model: 'Standart' is a tool name, not a model - give the exact model with its version, or write: not displayed
PASS   B1   section 2: baseline - scope, criteria, failure points, contract, assumptions     scope, AC1-AC6 in your words, 2 failure points, contract, 2 assumptions
PASS   F1   the six cases from the brief                                                     6 of 6 cases
PASS   F2   AC1 time order and day bounds                                                    5 of 5 cases
PASS   F3   AC1 the start is in the future                                                   5 of 5 cases
PASS   F4   AC2 at most 120 minutes                                                          3 of 3 cases
PASS   F5   AC3 a blocked room accepts nothing                                               2 of 2 cases
PASS   F6   AC4 every kind of overlap is rejected                                            5 of 5 cases
PASS   F7   AC4 touching endpoints are allowed                                               3 of 3 cases
PASS   F8   AC4 every existing booking is checked                                            4 of 4 cases
PASS   F9   AC5 the result is a real Boolean                                                 3 of 3 cases
PASS   F10  AC5 the inputs are left unchanged                                                2 of 2 cases
PASS   O1   the first Python version is kept in code/original/                               v1 kept (29 lines)
PASS   U1   your suite has at least 10 tests                                                 12 tests
PASS   U2   your suite is green on your own code                                             12 tests, OK
PASS   M1   your tests catch a fault                                                         AC1 - caught by test_start_equal_now_rejected
PASS   M2   your tests catch a fault                                                         AC1 - caught by test_after_1440_rejected
FAIL   M3   your tests catch a fault                                                         NOT caught - a can_book that breaks AC1 passed all 12 of your tests that follow the contract
PASS   M4   your tests catch a fault                                                         AC2 - caught by test_exactly_120_allowed
PASS   M5   your tests catch a fault                                                         AC3 - caught by test_blocked_rejected
PASS   M6   your tests catch a fault                                                         AC4 - caught by test_touching_end_is_allowed, test_touching_start_is_allowed
PASS   M7   your tests catch a fault                                                         AC4 - caught by test_second_booking_overlap_rejected
FAIL   M8   your tests catch a fault                                                         NOT caught - a can_book that breaks AC4 passed all 12 of your tests that follow the contract
PASS   M9   your tests catch a fault                                                         AC5 - caught by test_existing_unchanged
FAIL   M10  your tests catch a fault                                                         NOT caught - a can_book that breaks AC5 passed all 12 of your tests that follow the contract
FAIL   V1   section 3: v1 reviewed branch by branch, AC1-AC4                                 section 3 needs one row per branch of v1 - 4 or more (found 4) - and AC1-AC4 all named (missing: AC4)
PASS   V2   section 8: three critique decisions, one reject or modify                        3 decisions, 3 rejected or modified
ERROR  W1   final prototype exported to web/final/                                           no package.json or index.html in web/final/- download the final project from Bolt and unzip it there
ERROR  W2   exports are clean: no node_modules, no .env, under 5 MB                          nothing to check until web/final/ holds theexport
ERROR  W3   final stays in scope: no network, storage, backend, login                        no final prototype
PASS   W4   v1 export kept in web/original/                                                  web/original/project
ERROR  W5   final differs from v1                                                            needs both web/final/ and web/original/
FAIL   G1   section 4: generated files named by real paths                                   section 4 needs 2 generated files with paths that exist in web/original/ (found 0; not found: sis-03/web/original/project/package.json, sis-03/web/original/project/index.html)
PASS   E1   v1 screenshot: evidence/web-v1.png                                               evidence/web-v1.png
ERROR  E2   before/after screenshots: evidence/before-1.png, after-1.png                     evidence/before-1.png (or .jpg) not found; evidence/after-1.png (or .jpg) not found
ERROR  E3   narrow-width screenshot: evidence/final-narrow.png, portrait                     evidence/final-narrow.png (or .jpg) not found
FAIL   C1   section 5: T1-T12 present, expected unchanged, every result filled               T1 Python final: write True, False or Error; T1 page final: write Available, Unavailable or Not testable; T2 Python final: write True, False or Error; T2 page final: write Available, Unavailable or Not testable; T3 Python final: write True, False or Error (+19 more)
PASS   C2   section 5: Python v1 results are what v1 returns                                 all 11 match a run of code/original/booking_v1.py
FAIL   C3   section 5: Python final results are what your final returns                      T1: you wrote nothing, it returns True; T2:you wrote nothing, it returns False; T3: you wrote nothing, it returns False; T4: you wrote nothing, it returns True (+7 more)
FAIL   C4   section 5: page final matches the expected result                                page final differs from expected - T1: empty, T2: empty, T3: empty, T4: empty, T5: empty, T6: empty, T7: empty, T8: empty, T9: empty, T10: empty, T11: empty, T12: empty
FAIL   TR1  section 6: traceability for AC1-AC6                                              rows incomplete: AC1, AC2, AC3, AC4, AC5, AC6
FAIL   I1   section 7: two issues or more, each complete                                     section 7 needs 2 issues with every column filled and a priority of High, Medium or Low (found 0)
FAIL   I2   section 7: focused prompts, reproductions and the before/after line              the **Before / after:** line must say whichissue the screenshots show
PASS   A1   section 9.1: one pass through the agent loop                                     all six steps described
FAIL   A2   section 9.2: context, tools, permissions - observed and assumed                  section 9.2 needs 3 complete rows (found 0); Observed and Assumed each used at least once in the last column
FAIL   A3   section 9.3: safety checkpoint and dependability                                 **Safety checkpoint:** 0 words, 25 or more;**Reliability, security, responsibility:** 0 words, 40 or more
FAIL   X1   section 11: four exchanges or more, metadata complete                            B1 Tool empty; B1 Model empty; B1 Date empty; B1 Stage empty; B1 Source empty; B2 Tool empty
FAIL   X2   section 11: prompts and responses pasted in full                                 B1 prompt missing or under 15 words; B1 response missing or under 60 words - paste it complete; B2 prompt missing or under 15 words; B2 response missing or under 60 words - paste it complete; B3 prompt missing or under 15 words; B3 response missing or under 60 words - paste it complete
FAIL   X3   section 11: stages Plan, Generate, Critique and Repair all present               no exchange with Stage: Plan, Generate, Critique, Repair
PASS   X4   section 4: the Bolt prompt carries AC1-AC6 and forbids login, backend, database  AC1-AC6 included; login, backend and database excluded
FAIL   X5   section 11: your Python v1 is inside a Generate response                         no exchange has Stage: Generate
FAIL   K1   section 12.1: real output of your suite                                          section 12.1 needs the complete terminal output of your suite (the part ending in 'Ran N tests' and OK or FAILED)
FAIL   Q1   section 10: reflection of 100-200 words                                          0 words, range 100-200
------------------------------------------------------------------------------
Your v1 returns:    T1 true  T2 false  T3 false  T4 true  T5 false  T6 false  T7 false  T8 true  T9 false  T10 false  T11 true
Your final returns: T1 true  T2 false  T3 false  T4 true  T5 false  T6 false  T7 false  T8 true  T9 false  T10 false  T11 true
v1 (web/original/) has out-of-scope code: backend or database - a candidate for your issue log.
SUMMARY pass=28 fail=21 error=6   (55 checks)
Every FAIL or ERROR you keep goes in report.md section 13 and in submission.yml known_fails.
One you report and explain costs you nothing. One you hide costs the whole criterion.
akniet@Barakhans-MacBook-Air sis-03 % cd sis-03/code && python3 -m unittest -v 
cd: no such file or directory: sis-03/code
akniet@Barakhans-MacBook-Air sis-03 % cd /code && python3 -m unittest -v 
cd: no such file or directory: /code
akniet@Barakhans-MacBook-Air sis-03 % cd code && python3 -m unittest -v 
test_121_rejected (test_booking.TestCanBook.test_121_rejected) ... ok
test_after_1440_rejected (test_booking.TestCanBook.test_after_1440_rejected) ... ok
test_blocked_rejected (test_booking.TestCanBook.test_blocked_rejected) ... ok
test_ends_at_1440_allowed (test_booking.TestCanBook.test_ends_at_1440_allowed) ... ok
test_exactly_120_allowed (test_booking.TestCanBook.test_exactly_120_allowed) ... ok
test_existing_unchanged_unsorted (test_booking.TestCanBook.test_existing_unchanged_unsorted) ... ok
test_gap_between_bookings_allowed (test_booking.TestCanBook.test_gap_between_bookings_allowed) ... ok
test_identical_interval_rejected (test_booking.TestCanBook.test_identical_interval_rejected) ... ok
test_new_contains_existing_rejected (test_booking.TestCanBook.test_new_contains_existing_rejected) ... ok
test_new_inside_existing_rejected (test_booking.TestCanBook.test_new_inside_existing_rejected) ... ok
test_overlap_on_start_side_rejected (test_booking.TestCanBook.test_overlap_on_start_side_rejected) ... ok
test_overlap_rejected (test_booking.TestCanBook.test_overlap_rejected) ... ok
test_result_is_a_real_boolean (test_booking.TestCanBook.test_result_is_a_real_boolean) ... ok
test_reversed_rejected (test_booking.TestCanBook.test_reversed_rejected) ... ok
test_second_booking_overlap_rejected (test_booking.TestCanBook.test_second_booking_overlap_rejected) ... ok
test_start_equal_now_rejected (test_booking.TestCanBook.test_start_equal_now_rejected) ... ok
test_touching_end_is_allowed (test_booking.TestCanBook.test_touching_end_is_allowed) ... ok
test_touching_start_is_allowed (test_booking.TestCanBook.test_touching_start_is_allowed) ... ok
test_zero_length_rejected (test_booking.TestCanBook.test_zero_length_rejected) ... ok

----------------------------------------------------------------------
Ran 19 tests in 0.000s

OK
~~~~

### 12.2 Path B only — three faults you planted

<!-- Path A: leave this table as it is. Path B: three rows — the line you broke, the AC it
     breaks, the test that failed. -->

| # | Line you broke | AC | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

## 13. Remaining limitations and known fails

<!-- One row per check ID in submission.yml known_fails, and any limitation you know of.
     If the checker is clean and you know of none, one row that says so. -->

| Check ID or limitation | Why it stays | What I would do next |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
