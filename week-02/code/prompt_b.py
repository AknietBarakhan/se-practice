import math


def analyze_marks(marks, pass_mark=50):
    """Return average, highest, lowest and pass_rate (%) for a list of marks."""
    if not isinstance(marks, (list, tuple)) or len(marks) == 0:
        raise ValueError("marks must be a non-empty list")

    for m in marks:
        # bool is a subclass of int, so reject it explicitly
        if isinstance(m, bool) or not isinstance(m, (int, float)):
            raise ValueError(f"non-numeric mark: {m!r}")
        if math.isnan(m) or not 0 <= m <= 100:
            raise ValueError(f"mark out of range 0-100: {m!r}")

    if isinstance(pass_mark, bool) or not isinstance(pass_mark, (int, float)) \
            or not 0 <= pass_mark <= 100:
        raise ValueError("pass_mark must be a number between 0 and 100")

    passed = sum(1 for m in marks if m >= pass_mark)

    return {
        "average": sum(marks) / len(marks),
        "highest": max(marks),
        "lowest": min(marks),
        "pass_rate": passed / len(marks) * 100,
    }