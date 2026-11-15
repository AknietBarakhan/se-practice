# Traceability — use cases → stories → criteria

One row per use case. All six rows stay, even the ones with nothing behind them: an empty cell is a
finding you report, not a failure you hide. Use real IDs, comma-separated; write `none` where there
is nothing.

| Use case | Stories (US-nn) | Criteria (AC-nn) | Gap? |
| --- | --- | --- | --- |
| UC-01 View availability | US-01 | none | yes |
| UC-02 Book room | US-02 | AC-01, AC-02, AC-03, AC-04, AC-05 | no |
| UC-03 Cancel booking | US-03 | AC-06, AC-07, AC-08 | no |
| UC-04 Block or unblock room | US-05 | AC-09, AC-10, AC-11, AC-12 | no |
| UC-05 Review usage | US-06 | none | yes |
| UC-06 Send confirmation | US-04 | none | yes |

**Stories that belong to no use case:** none

**What the gaps tell you:** Only 3 of 6 use cases have acceptance criteria, because Part 3 only asked for criteria on three selected stories. UC-01, UC-05 and UC-06 are fully specified as user stories but have no tests behind them yet.
