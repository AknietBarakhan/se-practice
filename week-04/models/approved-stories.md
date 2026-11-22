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
