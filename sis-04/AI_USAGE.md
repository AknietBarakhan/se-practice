# AI Usage Disclosure — SIS #04

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Date | Used for | Which files it touched |
| --- | --- | --- | --- | --- |
| Claude | Sonnet 5.5 | 2026-11-22 | codebase analysis (Task 1) | `report.md` (§3.1) |
| Claude | Sonnet 5.5 | 2026-11-22 | improvement plan | `report.md` (§3.2–§3.3) |
| Gemini | Gemini | 2026-11-22 | feature extension (Task 2) | `app/src/rooms.ts`, `app/src/filter.ts`, `app/src/booking.ts`, `app/src/App.tsx`, `app/src/index.css` |
| Gemini | Gemini | 2026-11-22 | refactoring (Task 3) | `app/src/App.tsx` |
| Gemini | Gemini | 2026-11-22 | tests (Task 4) | `app/src/filter.test.ts`, `app/src/booking.test.ts`, `app/README.md` |

<!-- Delete rows you did not use the assistant for; add rows for anything else. The optional
     extension (an existing skill or a read-only MCP server) goes here too, with its permissions. -->

**The assistant wrote, or helped write, tests in `app/`:** yes — helped write `app/src/filter.test.ts` (`F1`, `F2`, `F4`, `B5`, `B6`, `INT`) and the `checkRoom` tests appended to `app/src/booking.test.ts` (`B1`–`B4`, `F3`, `F5`, `AC2`–`AC5`)
<!-- Either answer is allowed. If "yes": which tests, and how you checked that their EXPECTED values
     come from AC1–AC5 and F1–F5, not from what the code happens to return. -->

**Every run pasted in report.md was produced by my code on my machine (or Codespace), unedited:** yes

**Every number in report.md section 7 was measured the way its row says:** yes

**I shared no credentials, keys or private data with any tool:** yes 

**Everything I submitted, I can explain and defend in class — including filterRooms, checkRoom and
why each module exists:** yes 

**Anything I accepted from the AI without fully understanding it:** none
<!-- Name the file and the line. An honest entry here costs far less than a blank one that turns out to be untrue. -->

Signed: Barakhan Akniyet
Date: 2026-11-22
