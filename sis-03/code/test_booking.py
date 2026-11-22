import copy
import unittest
from booking import can_book

BASE = [(600, 660)]


class TestCanBook(unittest.TestCase):
    def test_touching_end_is_allowed(self):
        self.assertTrue(can_book(660, 720, 540, False, BASE))

    def test_touching_start_is_allowed(self):
        self.assertTrue(can_book(541, 600, 540, False, BASE))

    def test_overlap_rejected(self):
        self.assertFalse(can_book(630, 690, 540, False, BASE))

    def test_overlap_on_start_side_rejected(self):
        self.assertFalse(can_book(570, 630, 540, False, BASE))

    def test_new_contains_existing_rejected(self):
        self.assertFalse(can_book(570, 690, 540, False, BASE))

    def test_new_inside_existing_rejected(self):
        self.assertFalse(can_book(610, 650, 540, False, BASE))

    def test_identical_interval_rejected(self):
        self.assertFalse(can_book(600, 660, 540, False, BASE))

    def test_blocked_rejected(self):
        self.assertFalse(can_book(660, 720, 540, True, BASE))

    def test_exactly_120_allowed(self):
        self.assertTrue(can_book(720, 840, 540, False, BASE))

    def test_121_rejected(self):
        self.assertFalse(can_book(720, 841, 540, False, BASE))

    def test_start_equal_now_rejected(self):
        self.assertFalse(can_book(540, 570, 540, False, BASE))

    def test_reversed_rejected(self):
        self.assertFalse(can_book(720, 660, 540, False, BASE))

    def test_zero_length_rejected(self):
        self.assertFalse(can_book(720, 720, 540, False, BASE))

    def test_ends_at_1440_allowed(self):
        self.assertTrue(can_book(1380, 1440, 540, False, BASE))

    def test_after_1440_rejected(self):
        self.assertFalse(can_book(1380, 1441, 540, False, BASE))

    def test_second_booking_overlap_rejected(self):
        self.assertFalse(can_book(720, 780, 540, False, [(600, 660), (700, 760)]))

    def test_gap_between_bookings_allowed(self):
        self.assertTrue(can_book(660, 700, 540, False, [(600, 660), (700, 760)]))

    def test_result_is_a_real_boolean(self):
        self.assertIs(can_book(660, 720, 540, False, BASE), True)
        self.assertIs(can_book(630, 690, 540, False, BASE), False)

    def test_existing_unchanged_unsorted(self):
        ex = [(700, 760), (600, 660)]
        before = copy.deepcopy(ex)
        can_book(660, 700, 540, False, ex)
        can_book(720, 780, 540, False, ex)
        self.assertEqual(ex, before)


if __name__ == "__main__":
    unittest.main()