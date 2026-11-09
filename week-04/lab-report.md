# Week 04 — Lab report: Modeling the System with UML

> The single worksheet for this lab. Fill in every section. **Do not delete, rename or renumber
> the headings** — the checker and the grader find your work by them. Replace every `<...>`
> placeholder; a row that still contains `<...>` counts as empty.

---

## 1. Setup

| Field | Value |
| --- | --- |
| Name | Barakhan Akniyet |
| Group | Monday 16:00-19:00 |
| AI assistant | Claude Free |
| Exact model | Claude Free Sonnet 5.5 |
| Renderer | <PlantUML web server / VS Code extension / IntelliJ plugin / local jar> |
| Behaviour diagram | <sequence / activity / both> |
| Stories used | <my week-03 stories, revised / the reference set from README §3> |

---

## 2. Prompts as sent

Paste every prompt **exactly as you sent it**, in the order you sent it, one code block each. The
AI's first replies are saved as files in `models/original/` — do not paste them here.

### 2.1 Task 1 — use-case prompt

```
Using the supplied scenario and approved stories, generate PlantUML for a use-case diagram. Include Student and Administrator outside a named system boundary. Model their goals, show justified associations, and list assumptions. Use include or extend only with a clear reason.
```

### 2.2 Task 2 — class prompt

```
Create a UML domain class diagram in PlantUML for Smart Campus. Start with Student, Room, and Booking. Add attributes, appropriate operations, and association multiplicities. Add other classes only when requirements justify them. Explain each relationship and list assumptions. Avoid unjustified inheritance or composition.
```

### 2.3 Task 3 — behaviour prompt (3A sequence or 3B activity)

```
Generate PlantUML for Book room. Use Student, BookingService, and BookingRepository lifelines. Validate the supplied rules, then attempt the reservation. Show a successful confirmation and an unavailable-room alternative using alt. Label messages and replies. Explain new design components and all assumptions.
```

### 2.4 Focused correction prompts (if you sent any)

no

### 2.5 Critique prompt

```
# Approved stories — Smart Campus study room booking

> **Replace this file's stories with your own Week 03 stories, as revised after review**
> (`week-03/requirements/user-stories.md`), keeping their IDs. If you did not complete Week 03, or
> your set was rejected in review, keep the reference set below and say so in `lab-report.md` §1.
> Either way, the IDs here are the ones your consistency table (§7) must use.

**Source of this set:** <my week-03 stories, revised / the reference set>

## Scenario (from the Lesson 04 practice deck, slide 7)

Students view room availability, book a room, and cancel their own bookings. Administrators block
or unblock rooms and review usage.

- **R1** Future start, with duration greater than 0 and at most 2 hours.
- **R2** Active bookings for the same room cannot overlap.
- **R3** A blocked room cannot accept a new booking.
- **R4** A successful booking produces a confirmation.

## Reference set

| ID | Story | Rules |
| --- | --- | --- |
| US-01 | As a Student, I want to search for available study rooms by date and time, so that I can quickly find a room that is free when I need it. | - |
| US-02 | As a Student, I want to book a free room for a specific time slot, so that I can guarantee a space for my study session. | R1, R2 |
| US-03 | As a Student, I want to cancel my existing booking, so that I can free up the room if my plans change. | R2 |
| US-04 | As a Student, I want to receive a confirmation after booking or cancelling, so that I have proof my request went through correctly. | R4 |
| US-05 | As an Administrator, I want to block a room from being booked and unblock it later, so that I can take a room out of service when it is unusable and make it available again once it is fixed. | R3 |
| US-06 | As an Administrator, I want to review room usage over a period, so that I can make informed decisions about how rooms are managed. | — |

**Out of scope** (do not model): payments, equipment in rooms, recurring bookings, waiting lists,
notifications other than the booking confirmation, user registration.

@startuml
left to right direction
skinparam packageStyle rectangle
skinparam shadowing false

actor "Student" as Student
actor "Administrator" as Admin

rectangle "Smart Campus Study Room Booking System" {
  usecase "Search Available Rooms\n(US-01)" as UC1
  usecase "Book Room\n(US-02)" as UC2
  usecase "Cancel Booking\n(US-03)" as UC3
  usecase "Receive Confirmation\n(US-04)" as UC4
  usecase "Block Room\n(US-05)" as UC5
  usecase "Unblock Room\n(US-05)" as UC6
  usecase "Review Room Usage\n(US-06)" as UC7
}

Student --> UC1
Student --> UC2
Student --> UC3

Admin --> UC5
Admin --> UC6
Admin --> UC7

UC2 .> UC1 : <<include>>
UC2 .> UC4 : <<include>>
UC3 .> UC4 : <<include>>

note right of UC2
  Rules: R1, R2, R3
  (R4 via Receive Confirmation)
end note

note right of UC3
  Rule: R2 (frees the slot)
end note

note "Both belong to US-05" as N1
UC5 .. N1
UC6 .. N1

note right of UC5
  Rule: R3
end note
@enduml

@startuml
skinparam shadowing false
skinparam classAttributeIconSize 0
hide enum methods

class Student {
  - studentId : String
  - name : String
  + bookRoom(room : Room, start : DateTime, durationMinutes : int) : Booking
  + cancelBooking(booking : Booking) : void
}

class Room {
  - roomId : String
  - name : String
  - blocked : boolean
  + isBlocked() : boolean
  + block() : void
  + unblock() : void
  + isFreeFor(start : DateTime, durationMinutes : int) : boolean
}

class Booking {
  - bookingId : String
  - startTime : DateTime
  - durationMinutes : int
  - status : BookingStatus
  + /endTime : DateTime
  + isActive() : boolean
  + overlaps(other : Booking) : boolean
  + isValidRequest(now : DateTime) : boolean
  + cancel() : void
}

class Confirmation {
  - issuedAt : DateTime
  - type : ConfirmationType
}

enum BookingStatus {
  ACTIVE
  CANCELLED
}

enum ConfirmationType {
  BOOKING
  CANCELLATION
}

Student "1" -- "0..*" Booking : makes >
Room "1" -- "0..*" Booking : is reserved by >
Booking "1" -- "1..2" Confirmation : produces >
Booking --> BookingStatus
Confirmation --> ConfirmationType

note bottom of Booking
  R1: isValidRequest() checks future start,
      duration > 0 and <= 120 minutes
  R2: overlaps() is used only between ACTIVE
      bookings of the same Room
end note

note bottom of Room
  R3: blocked room cannot accept a new booking
  (US-05: block() / unblock())
end note

note bottom of Confirmation
  R4: issued for a successful booking
  US-04: also issued after cancelling
end note
@enduml

@startuml
skinparam shadowing false
autonumber

actor Student
participant BookingService
database BookingRepository

Student -> BookingService : bookRoom(studentId, roomId, startTime, durationMinutes)
activate BookingService

BookingService -> BookingService : validateRequest(startTime, durationMinutes)\n[R1: future start, 0 < duration <= 120 min]

alt [R1 fails: start not in future, or duration <= 0, or duration > 120]
  BookingService --> Student : rejected(reason = INVALID_TIME_OR_DURATION)
else [R1 passes]
  BookingService -> BookingRepository : findRoom(roomId)
  activate BookingRepository
  BookingRepository --> BookingService : room
  deactivate BookingRepository

  BookingService -> BookingRepository : findActiveBookings(roomId, startTime, endTime)
  activate BookingRepository
  BookingRepository --> BookingService : overlappingBookings
  deactivate BookingRepository

  BookingService -> BookingService : checkAvailability(room, overlappingBookings)\n[R3: room not blocked, R2: no overlap]

  alt room available [not blocked (R3) and no overlapping active booking (R2)]
    BookingService -> BookingRepository : save(booking: status = ACTIVE)
    activate BookingRepository
    BookingRepository --> BookingService : savedBooking
    deactivate BookingRepository

    BookingService -> BookingService : issueConfirmation(savedBooking, type = BOOKING)\n[R4]
    BookingService --> Student : bookingConfirmation(bookingId, roomId, startTime, durationMinutes)
  else room unavailable [blocked (R3) or overlapping active booking (R2)]
    BookingService --> Student : unavailable(reason = ROOM_BLOCKED or SLOT_TAKEN)\n[suggest searching for another room or time]
  end
end

deactivate BookingService
@enduml

Compare my diagrams with the requirements. Identify missing rules, inconsistent names, and unjustified elements. Cite each issue and propose a specific correction.
```

---

## 3. Task 1 — use-case review

**Assumptions the AI listed:** <one line each, or "the AI listed none" — that is a finding too>

At least **two** findings. A finding names the element, the problem and the rule or story that
proves it is a problem.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Block Room (UC5) / Unblock Room (UC6) | Both carry the label but are modeled as two separate use cases with no link between them. | US-05 ("block a room... and unblock it later") | Kept as two use cases. But I added a shared note clarifying both belong to US-05, so the consistency table in §7 can reference "US-05 -> UC5, UC6" explicitly instead of looking like a duplicate ID |
| 2 | Book Room (UC2) | No "<<include>>" relationship to Search Available Rooms, even though booking a room requires knowing it is free first | US-01/US-02 and the scenario sentence "Students view room availability, book a room..." implies viewing precedes booking | Added `UC2 .> UC1 : <<include>>` back in, matching the Week 03 decision, instead of silently losing that relationship between labs |

---

## 4. Task 2 — class diagram review

### 4.1 Relationships, read both ways

One row per association in your **revised** class diagram.

| Association | Read left → right | Read right → left | Multiplicities |
| --- | --- | --- | --- |
| Student — Booking | one student makes 0..* bookings | each booking belongs to exactly 1 student | 1 / 0..* |
| Room — Booking | one room is reserved by 0..* bookings (active and cancelled) | each booking reserves exactly 1 room | 1 / 0..* |
| Booking — Confirmation | one booking produces 1..* confirmations | each confirmation was produced by exactly 1 booking | 1 / 1..* |

### 4.2 Constraints the multiplicities cannot show

- R2: <how your diagram states it — which note, on which class>
- <any other rule that is not visible in multiplicities>

### 4.3 Assumptions

- Changed Booking–Confirmation multiplicity from the AI's `1..2` to `1..*`: a confirmation is issued once when a booking is made (R4) and once more if it is later cancelled (US-04), so the count depends on a separate future action, not a fixed range known at booking time; `1..*` says "at least one, possibly more" without implying a hard cap of exactly two.
- The Room–Booking association includes bookings of all statuses (ACTIVE and CANCELLED), not only active ones, because Room needs its full booking history for US-06 (review usage); R2's overlap check (see the note on Booking) only looks at ACTIVE bookings within that full set.
- Each Booking belongs to exactly one Room and one Student for its entire lifetime; a booking is never reassigned to a different room or student after creation.

### 4.4 Findings

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | <`Booking "1" -- "1..2" Confirmation`> | <The AI's multiplicity assumed a confirmation on cancellation too, contradicting R4 (confirmation only on a successful booking) and the out-of-scope list, which excludes notifications beyond the booking confirmation> | <US-04 (narrowed); out-of-scope list in `approved-stories.md`> | <Changed to `Booking "1" -- "1" Confirmation`> |
| 2 | <No `Administrator` class> | <US-05 (block/unblock room) and US-06 (review usage) are Administrator actions, but no class or operation represents the actor who performs them> | <US-05, US-06> | <Added `class Administrator { + blockRoom(room) ; + unblockRoom(room) ; + reviewUsage(from, to) : List<Booking> }`> |

---

## 5. Task 3 — behaviour diagram review

**Option chosen and why:** <3A sequence / 3B activity — one sentence on why> 3A sequence

**Design components added beyond the domain model:** <name each one, e.g. `BookingService` —
what it does in one line; write "none" for an activity diagram>

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | `alt R1 fails` / `else R1 passes` (first alt block) | Branch labels have no guard condition in `[...]`, unlike the second `alt`, which does have one (`[not blocked (R3) and no overlapping active booking (R2)]`) — the task requires every alt branch to have a guard | R1 (future start, 0 < duration ≤ 120 min) | Added explicit guards: `alt [R1 fails: start not in future, or duration <= 0, or duration > 120]` / `else [R1 passes]` |
| 2 | `BookingRepository` modeled with the `database` stereotype | Without an explanation, it reads as a literal database rather than a repository-pattern component at the application layer, which is what its method calls (`findRoom`, `save`, etc.) actually represent | Design-component naming requirement in the task | Clarified in this section (above) rather than changing the diagram; the stereotype is kept because it correctly signals "this is the persistence boundary," but its role is now spelled out in prose |

---

## 6. AI critique

Run the critique prompt once, on all your revised diagrams together. At least **three** rows. A
critique is another claim to evaluate, not a verdict: reject what is wrong and say why.

| # | Issue the AI raised | Element it cited | Verdict | Why |
| --- | --- | --- | --- | --- |
| 1 | <X1 — Cancellation confirmation. R4 covers only a successful booking, and the out-of-scope list excludes "notifications other than the booking confirmation"> | <UC3 `<<include>>` UC4; `ConfirmationType.CANCELLATION`; `Booking "1..*" Confirmation`; the Confirmation note "also issued after cancelling"> | <accept> | <My own US-04 story directly contradicts this week's explicit out-of-scope line> |
| 2 | <U1 — `UC2 .> UC1 <<include>>` makes searching mandatory for booking, but US-02 requires no search step> | <UC2, UC1, `<<include>>` relationship> | <accept> | <I added this include in Task 1 based on precedent from Week 03, not on a requirement> |
| 3 | <C3 — `BookingService` and `BookingRepository` from the sequence diagram are missing from the class diagram. `Student.bookRoom(...)` conflicts with `BookingService.bookRoom(...)`> | <Class diagram vs. sequence diagram> | <reject> | <The task itself (Part 3) instructs that `BookingService` and `BookingRepository` are design components, not domain classes, and belong only in the sequence diagram> |

---

## 7. Consistency table

One row for each of **R1–R4**, then one row for **every use case in your revised use-case
diagram**, spelled exactly as in the diagram, with the story ID it traces to.

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 | <Book Room> | <Booking.startTime, Booking.durationMinutes> | <guard `[R1 passes]` / `[R1 fails]` in `BookingService.validateRequest(startTime, durationMinutes, now)`> |
| R2 | <Book Room> | <Booking.status, Booking.overlaps(other), Room–Booking association> | <guard `[overlappingBookings not empty (R2)]` after `findActiveBookings(...)`> |
| R3 | <Book Room, Block or Unblock Room> | <Room.blocked, Room.isBlocked(), Room.block(), Room.unblock()> | <guard `[room.blocked (R3)]` checked right after `findRoom(roomId)`, before the R2 check> |
| R4 | <Book Room> | <Booking, Confirmation (`Booking "1" -- "1" Confirmation`)> | <message `createConfirmation(savedBooking)` → `Student : confirmation`> |
| <US-01> | <Search Available Rooms> | <Room.isFreeFor(start, durationMinutes)> | <not modeled in the sequence diagram> |
| <US-02> | <Book Room> | <Student, Room, Booking, BookingService, BookingRepository> | <validate - find room - check R3 - check R2 - save - confirm> |
| <US-03> | <Cancel Booking> | <Booking.cancel(), Booking.status> | <not modeled in the sequence diagram> |
| <US-04> | <Book Room (confirmation folded into UC2 after X1)> | <Confirmation.issuedAt, Confirmation.type> | <message `createConfirmation(savedBooking)`> |
| <US-05> | <Block or Unblock Room> | <dministrator.blockRoom(room), Administrator.unblockRoom(room), Room.blocked> | <not modeled in the sequence diagram> |
| <US-06> | <Review Room Usage> | <Administrator.reviewUsage(from, to)> | <not modeled in the sequence diagram> |

---

## 8. Change log

At least **three** rows, and at least one for each required diagram (use case, class, your
behaviour diagram). "Before" is what the AI produced; "After" is what you submitted.

| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | <use case> | <`UC2 .> UC1 : <<include>>` — searching is modeled as a mandatory step of booking> | <Include relationship removed and UC1 stands alone> | <S-02 says "book a free room" with no required search step; `<<include>>` wrongly implies searching always happens before booking> |
| 2 | <class> | <`Booking "1" -- "1..2" Confirmation`, with a `CANCELLATION` value on `ConfirmationType`, implying a second confirmation on cancellation> | <`Booking "1" -- "1" Confirmation` and `CANCELLATION` removed from `ConfirmationType`> | <R4 covers only a successful booking, and the out-of-scope list in `approved-stories.md` excludes "notifications other than the booking confirmation"> |
| 3 | <sequence / activity> | <R3 and R2 shared one combined branch and one result> | <Split into two nested `alt` blocks — R3 checked immediately after `findRoom`, R2 checked only if the room is not blocked; removed the unsupported suggestion text> | <a caller could not tell which rule failed, and the room-not-blocked branch ran an unnecessary overlap query and the suggestion line was never grounded in a requirement or story> |

---

## 9. Checker output

Paste the complete output of `python tests/check_models.py`, then explain **every FAIL you are
keeping**. The same IDs go in `submission.yml` under `checker.kept_fails`. A FAIL you report and explain costs you nothing. One you hide costs the whole criterion.

```text
UC1  PASS  Student and Administrator declared
UC2  PASS  named system boundary: "Smart Campus Study Room Booking System"
UC3  PASS  all actors declared outside the boundary
UC4  PASS  all scenario goals present (7 use cases)
UC5  PASS  no actor is associated with a confirmation use case
UC6  PASS  actor responsibilities match the scenario
UC7  PASS  use cases are goals, not screens or components
UC8  FAIL  no ' why: comment directly above: line 27 (include), line 28 (include), line 29 (include)
UC9  PASS  revised diagram differs from the AI's original
CL1  ERROR models/class.puml not found
CL2  ERROR models/class.puml not found
CL3  ERROR models/class.puml not found
CL4  ERROR models/class.puml not found
CL5  ERROR models/class.puml not found
CL6  ERROR models/class.puml not found
CL7  ERROR models/class.puml not found
CL8  ERROR models/class.puml not found
SQ1  PASS  Student, BookingService and BookingRepository lifelines present
SQ2  PASS  alt block with a guard on every branch (4 branches)
SQ3  PASS  validation happens before creation
SQ4  FAIL  a failure branch still creates/saves: save(booking: status = ACTIVE); savedBooking; issueConfirmation(savedBooking, type = BOOKING)\n[R4]
SQ5  PASS  every message is labelled
SQ6  PASS  R1 (time range) is visible - checked or stated as a precondition
SQ7  PASS  R3 (blocked room) is visible
FI1  PASS  the AI's original output is kept for every diagram
FI2  PASS  a rendered image for every diagram
LR1  FAIL  §1 not filled: behaviour diagram
LR2  FAIL  §2 needs the task 1, 2, 3 and critique prompts pasted (found 0)
LR3  FAIL  §3 needs at least 2 filled findings (found 1)
LR4  FAIL  §4.1 needs every association read both ways (found 0 rows); §4.3 declares no assumption
LR5  FAIL  §5 needs at least 1 filled finding
LR6  FAIL  §6 needs at least 3 critique rows with accept / reject (found 0)
LR7  FAIL  §8 needs >= 3 rows and one per diagram (rows: 0, missing: use case, class, behaviour)
CS1  PASS  6 approved stories
CS2  FAIL  §7 has no filled row for: R1, R2, R3, R4
CS3  FAIL  use case(s) with no §7 row tracing to an approved story: Block Room\n(US-05), Book Room\n(US-02), Cancel Booking\n(US-03), Receive Confirmation\n(US-04), Review Room Usage\n(US-06), Search Available Rooms\n(US-01), Unblock Room\n(US-05)

SUMMARY pass=17 fail=11 error=8
```

**FAILs I am keeping, and why:** <one line per check ID, or "none">

---

## 10. Conclusion (120–180 words)

<Which diagram did the AI get most wrong, and what exactly was wrong? Which error would have
reached the code if nobody had reviewed it? What did the critique find that you missed — and what
did it claim that was false? Be specific: "the AI got the multiplicities wrong" is worth nothing;
"the AI put 1..* on the Booking end, which says every room must already have a booking" is worth
everything.>

The sequence diagram was most wrong: it merged the R3 (blocked room) and R2 (overlap) checks into one branch with one shared result, `ROOM_BLOCKED or SLOT_TAKEN`. A caller could not tell which rule had failed, and the overlap query still ran even when the room was already blocked, doing unnecessary work. Had nobody reviewed it, this ambiguity would have reached the code as a single error path that silently hides which business rule was actually violated — a real bug, not a cosmetic one.

The critique caught something I had missed entirely: there was no `Administrator` class, even though US-05 and US-06 are Administrator-only actions. I had reviewed the class diagram for multiplicities and missed that an entire actor's responsibilities had no model at all.

The critique also made one claim I rejected: it wanted `BookingService` and `BookingRepository` folded into the class diagram because the sequence diagram used them. That would have erased the distinction the lab deliberately asks for — design components belong in the behaviour diagram, not the domain model.
