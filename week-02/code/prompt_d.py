import math
import unittest


def _is_valid_number(value):
    """Return True for real int/float values that are finite (bools excluded)."""
    if isinstance(value, bool):
        return False
    if not isinstance(value, (int, float)):
        return False
    return math.isfinite(value)


def analyze_marks(marks, pass_mark=50):
    if not _is_valid_number(pass_mark) or not 0 <= pass_mark <= 100:
        raise ValueError("pass_mark must be a number between 0 and 100")

    try:
        values = list(marks)  # work on a copy; the original is never touched
    except TypeError:
        raise ValueError("marks must be a list of numbers")

    if not values:
        raise ValueError("marks must not be empty")

    for mark in values:
        if not _is_valid_number(mark):
            raise ValueError(f"invalid mark: {mark!r}")
        if mark < 0 or mark > 100:
            raise ValueError(f"mark out of range 0-100: {mark!r}")

    passed = sum(1 for mark in values if mark >= pass_mark)

    return {
        "average": round(sum(values) / len(values), 2),
        "highest": max(values),
        "lowest": min(values),
        "pass_rate": round(passed / len(values) * 100, 2),
    }


class TestAnalyzeMarks(unittest.TestCase):
    def test_example(self):
        self.assertEqual(
            analyze_marks([40, 60, 80], 50),
            {"average": 60.0, "highest": 80, "lowest": 40, "pass_rate": 66.67},
        )

    def test_one_mark(self):
        self.assertEqual(
            analyze_marks([70]),
            {"average": 70.0, "highest": 70, "lowest": 70, "pass_rate": 100.0},
        )

    def test_decimals(self):
        result = analyze_marks([45.5, 60.25, 80.75])
        self.assertEqual(result["average"], 62.17)
        self.assertEqual(result["highest"], 80.75)
        self.assertEqual(result["lowest"], 45.5)
        self.assertEqual(result["pass_rate"], 66.67)

    def test_custom_pass_mark(self):
        result = analyze_marks([40, 60, 80], pass_mark=70)
        self.assertEqual(result["pass_rate"], 33.33)

    def test_mark_equal_to_pass_mark(self):
        result = analyze_marks([50, 49.99], pass_mark=50)
        self.assertEqual(result["pass_rate"], 50.0)

    def test_empty_list(self):
        with self.assertRaises(ValueError):
            analyze_marks([])

    def test_text_value(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, "abc"])

    def test_numeric_string(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, "60"])

    def test_boolean(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, True])

    def test_mark_below_zero(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, -1])

    def test_mark_above_100(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, 100.5])

    def test_exactly_zero_and_100(self):
        self.assertEqual(
            analyze_marks([0, 100]),
            {"average": 50.0, "highest": 100, "lowest": 0, "pass_rate": 50.0},
        )

    def test_nan_and_infinity(self):
        for bad in (float("nan"), float("inf"), float("-inf")):
            with self.assertRaises(ValueError):
                analyze_marks([50, bad])

    def test_invalid_pass_mark(self):
        for bad in (-1, 101, "50", True, float("nan")):
            with self.assertRaises(ValueError):
                analyze_marks([50], pass_mark=bad)

    def test_input_not_modified(self):
        marks = [80, 40, 60]
        analyze_marks(marks)
        self.assertEqual(marks, [80, 40, 60])


if __name__ == "__main__":
    unittest.main()