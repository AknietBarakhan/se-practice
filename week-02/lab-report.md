# Lab report — Practice #02: The Prompt Is an Engineering Input

**Name:** Barakhan Akniyet
**Group:** Monday 16:00-19:00
**Date:** 20.09.2026

> Fill in every section. **Do not delete or renumber the headings** — the grading pass reads them
> by number. If something did not happen, write "did not happen" and why; an empty section and a
> fabricated one are graded the same way.

---

## 1. The frozen experiment

| | |
| --- | --- |
| AI assistant | | Claude
| Exact model name | | Sonnet 5
| Implementation language | | Python 3
| Date of the runs | | 20.09.2026

**Non-Python students only** — paste your substituted Prompt B text here, so the substitution can
be checked:

```
(paste here, or write "n/a — used Python")
```

**Confirmations:**

- Each prompt was sent in a **fresh chat**: yes / no yes
- No follow-up questions were asked before Part 7: yes / no yes 
- Every output was saved **before** any editing: yes / no yes

---

## 2. Prompt A — minimal

**Prompt sent** (should be exactly one sentence):

```
Write Python code to analyze student marks.
```

**Assumptions the AI made that I never gave it** — list them, one per line. A data format, a pass
threshold, a rounding rule, an input method, an invented feature all count.

1. Importing csv file to import own data
2. Pass grade
3. Converting percentage to a letter grade

**Questions it should have asked and did not:**

1. About grading system
2. What we need in statistics

**Is the function named `analyze_marks` with the required signature?** yes / no — if no, what is it
called: load_csv, grade, analyze_students, analyze_subjects 

**First impression before testing** (one sentence — you will compare this with section 6 later):
I think that code is very detailed, but AI didn't know about the exactly grading system
---

## 3. Prompt B — structured context

**Prompt sent** (paste it in full, including any substitutions):

```
You are a Python developer. Implement analyze_marks(marks, pass_mark=50). Return average, highest, lowest and pass_rate in a dictionary. Accept marks from 0 to 100; raise ValueError for an empty list, non-numeric values, or out-of-range values. Use no external libraries. Return code plus a short explanation.
```

**What B fixed compared to A:**

1. Unlike a code from prompt A it doesn't add information such as "analyze_subject, hardest/easiest subject, students who failed and need support and more"
2. This code raises ValueError if list is empty, non-numeric and out-of-range values

**What B still leaves open:**

1. In prompt we don't have data type of pass_rate
2. Rounding system

---

## 4. Prompt C — examples and tests

**What I appended to Prompt B:**

```
You are a Python developer. Implement analyze_marks(marks, pass_mark=50). Return average, highest, lowest and pass_rate in a dictionary. Accept marks from 0 to 100; raise ValueError for an empty list, non-numeric values, or out-of-range values. Use no external libraries. Return code plus a short explanation. 
Example: analyze_marks ([40, 60, 80], 50) -> average 60, highest 80,
lowest 40, pass rate 66.67. Include tests for: one mark, decimals, custom pass_mark, empty list, text value, and marks below 0 or above 100. State any remaining assumptions before the code.
```

**Tests the AI wrote for itself** — how many, and which situations do they cover?

| Situation | Covered by the AI's tests? |
| --- | --- |
| one mark | | Yes
| decimals | | Yes
| custom pass_mark | | Yes
| empty list | | Yes
| text value | | Yes
| below 0 / above 100 | | Yes

**Do the AI's own tests pass against the AI's own code?** yes / no Yes

**Do they agree with the harness in section 6?** yes / no — if no, where do they disagree: yes

**Assumptions C stated explicitly before the code:** A mark equal to pass_mark counts as a pass (>=).
pass_rate is a percentage rounded to 2 decimals. average is also rounded to 2 decimals, so the example returns 60.0.
bool values (True/False) are rejected as non-numeric, even though Python treats them as ints.
NaN and inf are rejected, since they aren't valid marks.
pass_mark must itself be a number between 0 and 100, otherwise ValueError.
Any iterable of marks is accepted, not just lists, but an empty one raises ValueError. The function first converts the input to a list and rejects an empty one. It then validates pass_mark and each mark: the type must be int or float (not bool), the value must be finite, and it must lie in 0-100. Only after validation does it compute the results with built-ins (sum, max, min), counting marks >= pass_mark for the pass rate. Tests use the standard unittest module and cover every case you listed, plus the example and the 0/100 boundaries. Run them with python file.py.

---

## 5. Prompt D — my combined prompt

**The complete prompt I wrote** (one message, sent to a fresh chat):

```
You are a Python developer. Please write a function analyze_marks(marks, pass_mark=50) in one runnable Python file. The function takes a list of student marks and returns a dictionary with exactly four keys: average, highest, lowest and pass_rate. Average and pass_rate must be rounded to 2 decimal places, and pass_rate is a percentage, for example 66.67. A mark that is equal to pass_mark counts as a pass. Marks can be integers or decimals from 0 to 100, including 0 and 100. The function must raise ValueError if the list is empty, if any value is not a number (strings like "60", booleans, NaN and infinity also count as not valid), if a mark is below 0 or above 100, or if pass_mark is outside 0-100. It must not change the list that was passed in. Use no external libraries and do not add any extra features like reading files or ranking students.

Example: analyze_marks([40, 60, 80], 50) should return {"average": 60.0, "highest": 80, "lowest": 40, "pass_rate": 66.67}.

Please also write unit tests with unittest for these cases: one mark, decimals, custom pass_mark, a mark exactly equal to pass_mark, empty list, text value, numeric string, boolean, mark below 0, mark above 100, and marks exactly 0 and 100.

Before the code, write any assumptions you made. After the code, give a short explanation in two sentences.
```

**What I deliberately added that A, B and C did not have:**

1. Format of output and rounding. A didn't returned a dictionary, B didn't have rounding system and the output was "66.6666666....." instead of "66.67"
2. A mark equal to pass_mark counts as a pass, 0 and 100 are valid, and strings like "60", booleans, NaN and infinity are invalid. B and C made these decisions on their own without telling me, so I put them into the prompt instead of leaving them to the model
3. No extra features (files, rankings), the input list must not be modified, and the model must write its assumptions before the code and a two-sentence explanation after it. A did a whole CSV and ranking system, and B and C didn't state their assumptions clearly

**The ambiguity I found in the specification, and how I resolved it inside Prompt D:**
A mark exactly equal to pass_mark is a pass or a fail, so "pass_rate" could be calculated in two ways. For example, with [40, 60, 80] and pass_mark=60 the answer is 66.67 if 60 passes and 33.33 if it does not. I resolved it by writing "A mark that is equal to pass_mark counts as a pass" directly in the prompt and adding a test for it.
---

## 6. Test results — the evidence

Six cases × four prompts. Verdicts are **PASS**, **FAIL** or **ERROR** only.

| # | Call | Required | A | B | C | D |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `analyze_marks([40, 60, 80], 50)` | avg 60 · high 80 · low 40 · rate 66.67 | ERROR |  PASS |  PASS |  PASS |
| 2 | `analyze_marks([100], 50)` | avg 100 · high 100 · low 100 · rate 100 | ERROR |  PASS |  PASS |  PASS |
| 3 | `analyze_marks([49.5, 50], 50)` | avg 49.75 · high 50 · low 49.5 · rate 50 | ERROR | | | |
| 4 | `analyze_marks([], 50)` | raises ValueError | ERROR |  PASS |  PASS |  PASS |
| 5 | `analyze_marks([40, "60"], 50)` | raises ValueError | ERROR |  PASS |  PASS |  PASS |
| 6 | `analyze_marks([-1, 50, 101], 50)` | raises ValueError | ERROR |  PASS |  PASS |  PASS |
| | **Totals** | | 0/6 | 6/6 | 6/6 | 6/6 |

**For every FAIL and ERROR above, one line: what was returned or raised instead.**

| Prompt | Case | What actually happened |
| --- | --- | --- |
| A | 1-6 | Harness stopped at load: prompt_a.py defines no callable named 'analyze_marks' (it has load_csv, analyze_students, analyze_subjects, print_report), so all six cases count as ERROR |
| | | |
| | | |

### Pasted terminal output — all four runs

> This is the part that makes the table above count. Paste the **whole** output, unedited,
> including the header lines. A table with nothing behind it is not accepted.

**Prompt A**

```
ERROR: week-02/code/prompt_a.py defines no callable named 'analyze_marks'.
All six cases count as ERROR. Record that in lab-report.md
```

**Prompt B**

```
========================================================================
analyze_marks harness — week-02/code/prompt_b.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.66666666666666
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks must be a non-empty list
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: non-numeric mark: '60'
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: mark out of range 0-100: -1
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (week-02/code/prompt_b.py)
========================================================================
```

**Prompt C**

```
========================================================================
analyze_marks harness — week-02/code/prompt_c.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks must not be empty
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: non-numeric mark: '60'
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: mark out of range 0-100: -1
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (week-02/code/prompt_c.py)
========================================================================
```

**Prompt D**

```
========================================================================
analyze_marks harness — week-02/code/prompt_d.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks must not be empty
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: invalid mark: '60'
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: mark out of range 0-100: -1
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (week-02/code/prompt_d.py)
========================================================================
```

---

## 7. Scoring

0–2 per criterion, using the rubric in `README.md` Part 7.

| Criterion | A | B | C | D |
| --- | --- | --- | --- | --- |
| Correctness (cases passed) | 0 | 2 | 2 | 2 |
| Requirement coverage | 0| 2 | 2 | 2 |
| Verifiability (tests) | 0 | 0 | 2 | 2 |
| Assumptions stated | 0 | 0 | 0 | 0 |
| Noise (2 = none) | 0 | 2 | 2 | 2 |
| **Total / 10** | 0 | 6 | 8 | 8 |

**Prompt length, in words:** A 7 · B 44 · C 86 · D 224

**Words added per point gained** — B over A, C over B, D over C. One line on what that ratio says:
B over A: 37 words for 6 points (about 6 words per point). C over B: 40 words for 2 points (about 20 words per point). D over C: 140 words for 0 points (undefined). One line on what that ratio says: the first step (naming the function, signature and error rules) is very cheap, and after that each extra word buys much less, so D's extra length gave no measurable gain on this harness.
---

## 8. Conclusion — 150–200 words

Answer in this order: (1) which prompt scored best, and whether it is the one you would actually
use at work; (2) which single addition bought the most correctness, naming the exact case that
changed verdict; (3) what was pure noise; (4) the ambiguity and your resolution.

Name test cases and real returned values. "More detailed prompts work better" scores zero.

```
(150–200 words)

```
Prompts B, C and D all scored 6/6, so the harness cannot separate them; I would use C at work, because it reached the same result as D in 84 words instead of about 224 and it came with its own tests. The single addition that mattered most was in B: naming the function and its signature, analyze_marks(marks, pass_mark=50), together with the ValueError rules. Prompt A had none of this, so it wrote a CSV and ranking program with no analyze_marks, and all six cases were ERROR. In B every case changed to PASS, for example case 5, analyze_marks([40, "60"], 50), which now raised ValueError: non-numeric mark: '60'. Rounding was the only visible difference afterwards: B returned pass_rate=66.66666666666666 for case 1, while C and D returned 66.67. In D, the rules about booleans, NaN, infinity and not modifying the input list were mostly noise for this harness, because none of the six cases tests them; D added about 140 words and 0 points over C. The ambiguity was whether a mark equal to pass_mark passes. Case 3, [49.5, 50] with pass_mark 50, expects pass_rate 50.0, so equal counts as a pass, and I wrote that into Prompt D.

```

**Word count:** 196

---

## 9. Two questions for the debrief

Written before class, answered in class.

1. My harness has only six cases, and B, C and D all passed them. How can I tell which prompt produced the better code when the tests cannot separate them?
2. The model's own tests in Prompt C agreed with the harness. If a model writes both the code and the tests, can the tests catch a mistake the model makes in understanding the requirement?
