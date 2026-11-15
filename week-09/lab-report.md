# Week 09 — Lab Report: canBook as a Tool

Fill in every section. Do not delete or renumber the headings: the README and the checker point at
them. Replace every `<!-- comment -->` with your own text (comments are ignored by the checker).

**Name:** Barakhan Akniyet
**Student ID:** 24B031687
**GitHub:** AknietBarakhan

---

## 1. Setup

| | |
| --- | --- |
| Assistant (frozen for the whole lab) | Claude |
| Exact model (or "not displayed") | Sonnet 5.5 |
| Three fresh chats for R1, R2, R3? (yes / no) | yes |
| Python version (`python --version`) | Python 3.14.7 |

## 2. Your tool definition — a reason for every constraint

Paste your final `tool/check_room.json`, then fill the table: one row per constraint you wrote.

```json
{
  "name": "check_room",
  "description": "Checks whether a room can be booked for a requested time slot and returns only an Available or Unavailable decision. All times are whole minutes since midnight, in the range 0 to 1440. This tool does not save, create or change any booking; it only checks the request against the existing bookings and rules.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "start": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1439,
        "description": "Requested start time in minutes since midnight."
      },
      "end": {
        "type": "integer",
        "minimum": 1,
        "maximum": 1440,
        "description": "Requested end time in minutes since midnight, after start."
      },
      "now": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1439,
        "description": "Current time in minutes since midnight."
      },
      "blocked": {
        "type": "boolean",
        "description": "True if the room is blocked and cannot accept any booking."
      },
      "bookings": {
        "type": "array",
        "description": "Existing bookings of the room, each with a start and an end in minutes since midnight.",
        "items": {
          "type": "object",
          "properties": {
            "start": { "type": "integer", "minimum": 0, "maximum": 1439 },
            "end": { "type": "integer", "minimum": 1, "maximum": 1440 }
          },
          "required": ["start", "end"],
          "additionalProperties": false
        }
      }
    },
    "required": ["start", "end", "now", "blocked", "bookings"],
    "additionalProperties": false
  }
}
```

| Field | Constraint (e.g. `"type": "integer"`, `"maximum": 1440`) | What goes wrong without it |
| --- | --- | --- |
| start | `"minimum": 0` | A negative start such as -30 would be accepted, though the day starts at 0 (S06) |
| end | `"maximum": 1440` | An end of 1500 would run past midnight (S07), but 1440 must stay valid as the end of the day (S11) |
| now | `"required"` | A call without the current time could not decide whether the start is in the past (S04) |
| blocked | `"type": "boolean"` | The string "false" would be truthy, so the room would count as blocked (S09) |
| bookings.items | `"required": ["start", "end"]` | A booking with no end could not be compared for overlap (S08) |
| root | `"additionalProperties": false` | An invented field such as "room" would pass silently (S05) |

## 3. The twelve calls — first run and final run

Your **first** run's S verdicts (before any fix), and your final ones. For every case that changed,
say what you changed.

| Case | First run | Final run | What you changed |
| --- | --- | --- | --- |
| S01 | PASS | PASS | nothing |
| S02 | PASS | PASS | nothing |
| S03 | PASS | PASS | nothing |
| S04 | PASS | PASS | nothing |
| S05 | PASS | PASS | nothing |
| S06 | PASS | PASS | nothing |
| S07 | PASS | PASS | nothing |
| S08 | PASS | PASS | nothing |
| S09 | PASS | PASS | nothing |
| S10 | PASS | PASS | nothing |
| S11 | PASS | PASS | nothing |
| S12 | PASS | PASS | nothing |

## 4. Function calling — what the model wrote

For each request, paste the model's reply exactly, then judge it against the request.

### R1

```text
{"name": "check_room", "arguments": {"start": 600, "end": 660, "now": 540, "blocked": false, "bookings": [{"start": 660, "end": 720}]}}
```

<!-- Match? If F3 failed, which argument differs, and who was wrong: the model or the request? -->
Match: yes. Every argument matches the request: 10:00 is 600, 11:00 is 660, now 9:00 is 540, the room is not blocked, and the existing booking 11:00-12:00 became `{"start": 660, "end": 720}`. F3 passed, so no argument differs. The request touches the existing booking at 11:00 and does not overlap it, but the model did not decide that. It only passed the values on
### R2

```text
{"name": "check_room", "arguments": {"start": 840, "end": 990, "now": 810, "blocked": true, "bookings": []}}
```

<!-- Same. R2 is a call that SHOULD be made, although canBook will say Unavailable. Did the model refuse to call? -->
The model did not refuse to call. It converted 14:00 to 840, 16:30 to 990 and 13:30 to 810, set `blocked` to true and left `bookings` empty, as the request says. Making the call was correct, even though `canBook` will answer Unavailable (blocked) and the request is 150 minutes long. The decision belongs to the function and not to the model.
### R3

```text
What exact start and end times do you want for the room tomorrow afternoon, and what is the current time? I also need to know whether the room is blocked and what bookings already exist.
```

<!-- What information was missing? Did the model ask, or call? If it called, which values did it invent, and from where? -->
Missing information: the exact start and end, the current time, whether the room is blocked, and the existing bookings. The model asked and did not call. It invented no values, which is the behaviour the prompt demanded. One small deviation: I asked for one short question, and the reply was a longer question with a second sentence listing more missing items. It still did not guess.
## 5. What the schema cannot check

<!-- Name the acceptance criteria (AC1-AC6, README section 3) that a JSON Schema with the allowed keywords cannot
     enforce, and say why for each. At least two, by their AC number. Which part of AC1 CAN the schema enforce? -->
**AC1 (start strictly after now).** The schema can enforce only the shape of AC1: `start`, `end` and `now` must be integers, and each must stay inside the range 0 to 1440 (`minimum` and `maximum`). It cannot compare two fields with each other. Whether `start` is greater than `now`, or `start` is less than `end`, depends on the values of two different arguments, and the allowed keywords look at one value at a time. A call with `start` 540 and `now` 540 passes the schema and must be rejected by `canBook`.

**AC2 (duration at most 120 minutes).** Duration is `end - start`, a calculation between two fields. The schema has no keyword that subtracts values, so a request from 600 to 900 (300 minutes) is valid for the schema and is rejected only by the function.

**AC3 (reject a blocked room).** The schema can check that `blocked` is a boolean, but it cannot enforce the rule "if `blocked` is true, the answer is Unavailable". A schema describes valid inputs, not decisions. A call with `blocked: true` is a perfectly valid call, and R2 shows this: the model made the call correctly, and `canBook` decides.

**AC4 (no overlap, touching is allowed).** The schema can check that each booking has an integer `start` and `end` within the day, but it cannot compare the requested interval with the existing bookings, because that needs comparisons between the request and every item in `bookings`. R1 is a valid call whose request touches a booking, and only the function can tell that it does not overlap.

**AC5 (the result is Available or Unavailable, and the bookings are not changed).** This concerns the output and the behaviour of the function, and the input schema describes only the arguments. It cannot say anything about what the tool returns or whether it modifies the data.

**The part of AC1 that the schema can enforce:** the unit and the range. Times must be whole minutes (`"type": "integer"`), `start` from 0 to 1439 and `end` from 1 to 1440, which is why S03 (a string), S06 (-30), S07 (1500) and S10 (600.5) were refused. Everything that relates one value to another stays with `canBook`.
## 6. Permissions — allow, ask or block

| # | Action | Decision (allow / ask / block) | Reason (the risk, in one sentence or more) |
| --- | --- | --- | --- |
| A1 | call `check_room` with the times the user just typed | allow | The tool only checks and never saves or changes a booking, and its schema refuses malformed input, so the worst outcome is a wrong answer I can see |
| A2 | read `week-08/app/src/booking.ts` | allow | Reading changes nothing, and the file holds no secrets, only the booking rules |
| A3 | edit `booking.ts` to raise the 120-minute limit to 180 | block | The 120-minute limit is a fixed acceptance criterion (AC2), so a user's request does not give the agent the right to change the requirements; the change belongs to a human decision |
| A4 | run `npm test` in `week-08/app` | allow | It runs local tests that read the code and report results, with no effect on the repository or on other systems, and it gives me evidence about the current state |
| A5 | run `git reset --hard` to undo its own last three edits | ask | The command discards uncommitted work permanently, including any of mine that is mixed in, so I want to see what would be lost before it runs |
| A6 | `git commit` its change on the `week-09` branch | ask | A commit on a feature branch is easy to undo, but I want to review the diff first so I know what I am signing under my name |
| A7 | `git push` to `main` | block | `main` is the shared branch, and pushing to it publishes unreviewed changes that others will pull; a push is hard to take back and should go through a pull request |
| A8 | send the contents of `.env` to an MCP server it found online | block | `.env` holds secrets such as keys and tokens, and sending them to an unknown server leaks them; "to configure it" is exactly the kind of reason a malicious server would give |

## 7. Checkpoint

<!-- The commit you would make before letting such an agent edit anything: its real SHA (git log --oneline),
     the exact command that returns you to it, and what that command would throw away. -->

## 8. Checker output

Paste the **whole** output of your last `python tests/check_tool.py`, unedited.

```text

```

## 9. What still fails

<!-- Every check in submission.yml known_fails, with the reason. "None" if all 30 pass. -->

## 10. Conclusion (80–150 words)

<!-- What did you learn about the line between the schema, the model and the function? Be specific:
     name a case, a request or an action. "Tool definitions are important" is worth nothing. -->
