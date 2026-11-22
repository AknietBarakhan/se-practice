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