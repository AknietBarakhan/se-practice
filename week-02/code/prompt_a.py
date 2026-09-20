"""
Student Marks Analysis
----------------------
Analyzes student marks: per-student totals/averages/grades, per-subject
statistics, rankings, pass/fail rates, and struggling students.

Usage:
    python student_marks_analysis.py                # uses built-in sample data
    python student_marks_analysis.py marks.csv      # uses your own CSV

CSV format (header required, first column = student name):
    Name,Math,Science,English,History
    Alice,88,92,79,85
"""

import csv
import statistics
import sys

PASS_MARK = 40
MAX_MARK = 100

SAMPLE_DATA = {
    "Alice":   {"Math": 88, "Science": 92, "English": 79, "History": 85},
    "Bob":     {"Math": 45, "Science": 52, "English": 61, "History": 38},
    "Charlie": {"Math": 72, "Science": 68, "English": 74, "History": 80},
    "Diana":   {"Math": 95, "Science": 98, "English": 91, "History": 89},
    "Ethan":   {"Math": 34, "Science": 41, "English": 55, "History": 47},
    "Fatima":  {"Math": 81, "Science": 77, "English": 85, "History": 90},
    "George":  {"Math": 60, "Science": 58, "English": 49, "History": 66},
    "Hana":    {"Math": 29, "Science": 35, "English": 42, "History": 31},
}


def load_csv(path):
    """Load marks from a CSV file into {student: {subject: mark}}."""
    data = {}
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        name_col = reader.fieldnames[0]
        for row in reader:
            name = row.pop(name_col).strip()
            data[name] = {subj: float(mark) for subj, mark in row.items() if mark.strip()}
    return data


def grade(percent):
    """Convert a percentage to a letter grade."""
    if percent >= 90: return "A+"
    if percent >= 80: return "A"
    if percent >= 70: return "B"
    if percent >= 60: return "C"
    if percent >= PASS_MARK: return "D"
    return "F"


def analyze_students(data):
    """Return a list of per-student summaries, sorted by average (high to low)."""
    results = []
    for name, marks in data.items():
        scores = list(marks.values())
        avg = statistics.mean(scores)
        failed = [s for s, m in marks.items() if m < PASS_MARK]
        results.append({
            "name": name,
            "total": sum(scores),
            "average": avg,
            "grade": grade(avg / MAX_MARK * 100),
            "best": max(marks, key=marks.get),
            "worst": min(marks, key=marks.get),
            "failed_subjects": failed,
        })
    results.sort(key=lambda r: r["average"], reverse=True)
    for rank, r in enumerate(results, start=1):
        r["rank"] = rank
    return results


def analyze_subjects(data):
    """Return {subject: stats dict} across all students."""
    subjects = {s for marks in data.values() for s in marks}
    stats = {}
    for subj in sorted(subjects):
        scores = [m[subj] for m in data.values() if subj in m]
        stats[subj] = {
            "mean": statistics.mean(scores),
            "median": statistics.median(scores),
            "stdev": statistics.stdev(scores) if len(scores) > 1 else 0.0,
            "highest": max(scores),
            "lowest": min(scores),
            "pass_rate": sum(s >= PASS_MARK for s in scores) / len(scores) * 100,
        }
    return stats


def print_report(data):
    students = analyze_students(data)
    subjects = analyze_subjects(data)

    print("=" * 66)
    print("STUDENT RANKINGS")
    print("=" * 66)
    print(f"{'Rank':<5}{'Name':<10}{'Total':>7}{'Average':>9}{'Grade':>7}  {'Best':<9}{'Weakest':<9}")
    print("-" * 66)
    for r in students:
        print(f"{r['rank']:<5}{r['name']:<10}{r['total']:>7.0f}{r['average']:>9.1f}"
              f"{r['grade']:>7}  {r['best']:<9}{r['worst']:<9}")

    print("\n" + "=" * 66)
    print("SUBJECT STATISTICS")
    print("=" * 66)
    print(f"{'Subject':<10}{'Mean':>7}{'Median':>8}{'StdDev':>8}{'High':>6}{'Low':>6}{'Pass %':>8}")
    print("-" * 66)
    for subj, s in subjects.items():
        print(f"{subj:<10}{s['mean']:>7.1f}{s['median']:>8.1f}{s['stdev']:>8.1f}"
              f"{s['highest']:>6.0f}{s['lowest']:>6.0f}{s['pass_rate']:>8.0f}")

    print("\n" + "=" * 66)
    print("OVERVIEW")
    print("=" * 66)
    averages = [r["average"] for r in students]
    print(f"Class average      : {statistics.mean(averages):.1f}")
    print(f"Class median       : {statistics.median(averages):.1f}")
    print(f"Top student        : {students[0]['name']} ({students[0]['average']:.1f})")
    print(f"Hardest subject    : {min(subjects, key=lambda s: subjects[s]['mean'])}")
    print(f"Easiest subject    : {max(subjects, key=lambda s: subjects[s]['mean'])}")

    print("\nGrade distribution:")
    for g in ["A+", "A", "B", "C", "D", "F"]:
        count = sum(r["grade"] == g for r in students)
        print(f"  {g:<3} {'#' * count} ({count})")

    at_risk = [r for r in students if r["failed_subjects"]]
    print("\nStudents needing support (failed at least one subject):")
    if at_risk:
        for r in at_risk:
            print(f"  - {r['name']}: {', '.join(r['failed_subjects'])}")
    else:
        print("  None")


if __name__ == "__main__":
    marks_data = load_csv(sys.argv[1]) if len(sys.argv) > 1 else SAMPLE_DATA
    print_report(marks_data)