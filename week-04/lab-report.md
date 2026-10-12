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

```text
<paste>
```

### 2.2 Task 2 — class prompt

```text
<paste>
```

### 2.3 Task 3 — behaviour prompt (3A sequence or 3B activity)

```text
<paste>
```

### 2.4 Focused correction prompts (if you sent any)

```text
<paste, or write "none">
```

### 2.5 Critique prompt

```text
<paste>
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
| <Student — Booking> | <one student makes 0..* bookings> | <each booking belongs to exactly 1 student> | <1 / 0..*> |
| <Room — Booking> | <one room is reserved by 0..* bookings> | <each booking reserves exactly 1 room> | <1 / 0..*> |
| <Booking — Confirmation> | <one booking produces 1..* confirmations> | <each confirmation was produced by exactly 1 booking> | <1 / 1..*> |

### 4.2 Constraints the multiplicities cannot show

- R2: <how your diagram states it — which note, on which class>
- <any other rule that is not visible in multiplicities>

### 4.3 Assumptions

- A1: <an assumption you had to make — e.g. what happens to existing bookings when a room is blocked>
- <A2 The Room–Booking association includes bookings of all statuses, not only active ones, because Room needs its full booking history for US-06>
- <A3: Each Booking belongs to exactly one Room and one Student for its entire lifetime; a booking is never reassigned to a different room or student after creation>
- <A4: Blocking a Room (R3) does not cancel bookings already made for it — it only prevents new ones. Existing ACTIVE bookings on a newly blocked room remain valid until they end or are cancelled individually>

### 4.4 Findings

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | <`Booking "1" -- "1..2" Confirmation`> | <The AI's multiplicity assumed a confirmation on cancellation too, contradicting R4 (confirmation only on a successful booking) and the out-of-scope list, which excludes notifications beyond the booking confirmation> | <US-04 (narrowed); out-of-scope list in `approved-stories.md`> | <Changed to `Booking "1" -- "1" Confirmation`> |
| 2 | <No `Administrator` class> | <US-05 (block/unblock room) and US-06 (review usage) are Administrator actions, but no class or operation represents the actor who performs them> | <US-05, US-06> | <Added `class Administrator { + blockRoom(room) ; + unblockRoom(room) ; + reviewUsage(from, to) : List<Booking> }`> |

---

## 5. Task 3 — behaviour diagram review

**Option chosen and why:** <3A sequence / 3B activity — one sentence on why>

**Design components added beyond the domain model:** <name each one, e.g. `BookingService` —
what it does in one line; write "none" for an activity diagram>

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | <alt R1 fails> | <Branch labels have no guard condition in `[...]`, unlike the second `alt`, which does have one and the task requires every alt branch to have a guard> | <R1> | <alt [R1 fails: start not in future, or duration <= 0, or duration > 120] / else [R1 passes]> |

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
| R1 | <use case> | <classes and attributes> | <message, guard or decision> |
| R2 | <use case> | <classes, note> | <message, guard or decision> |
| R3 | <use case> | <classes and attributes> | <message, guard or decision> |
| R4 | <use case> | <classes> | <message or action> |
| <US-01> | <Book room> | <Student, Booking, Room> | <message or action> |

---

## 8. Change log

At least **three** rows, and at least one for each required diagram (use case, class, your
behaviour diagram). "Before" is what the AI produced; "After" is what you submitted.

| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | <use case> | <before> | <after> | <rule, story or notation reason> |
| 2 | <class> | <before> | <after> | <reason> |
| 3 | <sequence / activity> | <before> | <after> | <reason> |

---

## 9. Checker output

Paste the complete output of `python tests/check_models.py`, then explain **every FAIL you are
keeping**. The same IDs go in `submission.yml` under `checker.kept_fails`. A FAIL you report and explain costs you nothing. One you hide costs the whole criterion.

```text
<paste the full output>
```

**FAILs I am keeping, and why:** <one line per check ID, or "none">

---

## 10. Conclusion (120–180 words)

<Which diagram did the AI get most wrong, and what exactly was wrong? Which error would have
reached the code if nobody had reviewed it? What did the critique find that you missed — and what
did it claim that was false? Be specific: "the AI got the multiplicities wrong" is worth nothing;
"the AI put 1..* on the Booking end, which says every room must already have a booking" is worth
everything.>
