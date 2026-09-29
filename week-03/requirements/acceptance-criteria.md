# Acceptance criteria — three selected stories

Assumptions first, then the criteria. Each block names the story it belongs to. 3 to 5 criteria per
story, every one in Given / When / Then form, and every set covers a validation or error case — not
three happy paths.

---

## Assumptions

These must settle the two questions the scenario leaves open. Either answer is accepted; no answer
is not.

- **Overlap:** a booking that ends exactly when another begins is not allowed (allowed / not allowed) under R3, because R3 is about two time slots genuinely intersecting. A shared boundary instant means the room is never occupied by two bookings at the same time, so back-to-back bookings must be permitted.
- **Duration:** a booking of exactly two hours is allowed (allowed / not allowed) under R2, because R2 says "at most two hours," and "at most" includes the limit itself, only durations strictly longer than two hours violate the rule.
- The system clock is authoritative for deciding whether a start time is in the future.
- A room has exactly two states, available or blocked, set only by an Administrator; each booking has exactly one owning student, used to authorize cancellation.

---

## US-02 — Book a free room for a specific time slot

### AC-01
- **Given** a room is available and the requested time slot is in the future, does not overlap any existing booking, and lasts less than two hours
- **When** the student submits the booking request
- **Then** the system confirms the reservation and assigns the room to the student for that time slot

### AC-02
- **Given** a room is available and the requested time slot is in the future
- **When** the student submits a booking request for a duration longer than two hours
- **Then** the system rejects the request and displays an error indicating that the maximum booking duration is two hours

### AC-03
- **Given** a room already has a confirmed booking that overlaps the requested time slot
- **When** the student submits a booking request for that overlapping time slot
- **Then** the system rejects the request and displays an error indicating the room is already booked for that time

### AC-04
- **Given** a room has an existing booking that ends at a certain time
- **When** the student submits a booking request for that same room starting exactly when the existing booking ends
- **Then** the system confirms the reservation, because a shared boundary instant does not count as an overlap under R3

### AC-05
- **Given** a room has been blocked by an Administrator
- **When** the student submits a booking request for any time slot on that room
- **Then** the system rejects the request and displays an error indicating the room is currently unavailable

---

## US-03 — Cancel an existing booking

### AC-06
- **Given** the student has a confirmed future booking
- **When** the student requests to cancel that booking
- **Then** the system cancels the booking and frees the room for that time slot

### AC-07
- **Given** the student has a confirmed future booking
- **When** the student attempts to cancel a booking that does not exist or has already been cancelled
- **Then** the system rejects the request and displays an error indicating the booking cannot be found or is already cancelled

### AC-08
- **Given** a booking exists but was made by a different student
- **When** the student attempts to cancel that booking
- **Then** the system rejects the request and displays an error indicating they are not authorized to cancel this booking

---

## US-05 — Block and unblock a room

### AC-9
- **Given** a room is currently available
- **When** the Administrator blocks the room
- **Then** the system marks the room as blocked, prevents any new bookings on it, and leaves existing bookings on that room unaffected

### AC-10
- **Given** a room is currently blocked
- **When** the Administrator unblocks the room
- **Then** the system marks the room as available again and allows new bookings to be made on it, subject to normal rules

### AC-11
- **Given** a room is already blocked
- **When** the Administrator attempts to block the same room again
- **Then** the system rejects the action and displays a message indicating the room is already blocked

### AC-12
- **Given** a room is already available and not blocked
- **When** the Administrator attempts to unblock it
- **Then** the system rejects the action and displays a message indicating the room is not currently blocked