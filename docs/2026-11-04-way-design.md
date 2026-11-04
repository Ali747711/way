# Way — Design

| | |
|---|---|
| Date | 2026-11-04 |
| Status | Approved by owner, 2026-11-04 |
| Plan | `docs/2026-11-04-way-plan.md` |
| Owner | Azamat Nabiev |
| Working name | "Way" (taken from the repo folder; see §15) |

## 1. Intent

Way is a free web app that replaces late-night scrolling with short bursts of real thinking.

Each day it offers a small, finite set of problems across different areas. You solve them one at a time. You cannot see the next one until you answer or give up on the current one. Hints only ask you questions. The answer appears only after you commit. When the set is done, the app says so and stops.

The first user is the author. Version 1 exists to test one claim on one person: that this can win the moment where a tired brain reaches for a feed.

### Why

AI has made thinking optional. Any question can be answered instantly, so the effortful parts of life, reading, reasoning, searching, discussing, stop getting exercised. The author is an AI engineer and likes the technology. The worry is about the habit, not the tool.

Over the past month the author noticed it in themselves: more scrolling and entertainment, less reading, a brain that avoids anything requiring effort. The fixes tried were deactivating social media, reading books, and going for walks. All failed for the same reason: each one meant leaving the device, and the author lives on devices.

Chess worked for a couple of months. It is a game, not a lesson. Rounds are short. There is nothing to look up mid-game. It faded anyway. The author did not say why; the author of this document's guess is that one skill plateaus and gets repetitive.

So Way lives inside screen time and replaces the content instead of fighting the device. It keeps what worked in chess (short rounds, no lookup, a game not a lesson) and adds what chess lacked (variety across subjects).

The larger purpose: an AI-era product whose whole point is to make people think more, not less.

## 2. The moment it is built for

Late evening. Tired. Laptop or phone in hand. Thumb about to open YouTube.

Way wins only if, in that moment, opening it costs less effort than opening a feed, and gives a faster hit of "I figured it out" than a video gives. Every decision below follows from this.

## 3. Principles

1. **Ten seconds to thinking.** Open it and a problem is already on screen. No dashboard, no sign-in, no category to pick. Choosing is effort, and effort is what the tired brain refuses.
2. **One problem at a time.** The next one is invisible until you answer the current one or explicitly give up. Nothing scrolls.
3. **The set ends.** Five problems a day, then a "done" screen. No infinite mode, no "one more".
4. **Coach, not oracle.** Hints are questions. Solutions appear only after you commit an answer or give up.
5. **Variety over depth, daily.** Five different areas every day. Depth lives in the weekly problem.
6. **No guilt.** No streaks, no notifications, no "you missed 3 days". Come back whenever.
7. **Free, no ads, no paywall, no data harvesting.** Not as a launch tactic; as the point.

## 4. Goals (v1)

v1 is built for one user, the author, for a two-week self-test. Everything that does not serve that test is out.

- **G1** A daily set of 5 problems, one per area, ordered easy to hard, about 20 minutes in total.
- **G2** The first problem of each day is solvable in under 2 minutes. It is the hook.
- **G3** One-at-a-time flow with no skipping. "Give up" exists but asks for confirmation.
- **G4** Every problem has a pre-written hint ladder of 3 hints, each phrased as a question.
- **G5** After solving or giving up: the solution and a short explanation of the reasoning.
- **G6** A "done for today" screen with the area map (§8.1).
- **G7** One deep problem per week for days with more time.
- **G8** Works one-handed on a phone and with the keyboard on a laptop.
- **G9** A content bank of at least 150 published problems (30 per area) at launch, plus a pipeline that produces more faster than they are consumed.
- **G10** Zero running cost: static deploy, no database, no runtime AI calls.

## 5. Non-goals (v1)

Explicitly not in v1. Several are strong candidates for v2 (§13).

- Accounts, sign-in, cross-device sync
- Discussion threads or comments
- Community-submitted problems
- Leaderboards, ratings, scores, streaks
- Browsing past days, an archive, or a practice mode
- A live AI coach you can chat with
- AI feedback on creative submissions
- Native mobile apps
- Multiple languages. Exception added 2026-11-05 at the owner's request: an Uzbek interface at `/uz` (problems stay English), with an EN/UZ switch.
- Analytics or telemetry
- Monetization of any kind

## 6. Anti-goals

Outcomes that make this a failure even if everything "works":

- **It becomes a scroll.** Any interface that lets you swipe or flick past problems.
- **It becomes a chore.** Streak guilt, nagging, red badges.
- **It gives answers before commitment.** A hint that states instead of asks.
- **A wrong answer key.** One confidently wrong "correct answer" destroys trust in all the others.
- **It only works for programmers.** Four of the five areas must need no coding.
- **It has a login wall.**

## 7. Constraints

- Free to use, no ads. Hosting and operation must cost about $0 per month at small scale.
- TypeScript throughout. The author is a JavaScript/TypeScript full-stack developer and will maintain it.
- Every published problem has a verified answer: machine-verified where the type allows it, and always human-reviewed.
- Problems live as files in the repository and pass through review states before publishing. Content changes are diffs.
- Privacy: in v1 nothing leaves the browser. There is no server to send anything to.

## 8. Experience

### 8.1 Screens

**Play** (`/`, the landing screen)

- A small wordmark, "3 of 5", and the area label ("Logic").
- The problem statement. Markdown; may include a code block or a small image.
- An answer control that matches the answer type: a text or number field, multiple-choice buttons, a code editor, or a free-text area.
- Three actions: **Hint** (reveals the next hint in the ladder, with a counter "Hint 1 of 3"), **Submit**, **Give up** (asks "Show the solution? You can't retry today.").
- Code problems add a fourth action, **Run**, which runs the visible examples and shows expected versus actual for each. **Submit** runs the hidden tests and reports "passed 5 of 7" plus the first failing hidden input with its expected and actual output. Solved means all hidden tests pass. This is a nudge, not an answer: it tells you where you are wrong, not what is right.
- After a correct answer: "Solved", the explanation, and **Next**.
- After a wrong answer: "Not quite", attempts remaining, and the field stays editable.
- After giving up: the solution, the explanation, and **Next**.
- Keyboard on laptop: Enter submits. A visible shortcut reveals a hint.
- If you have not started today, problem 1 of 5 is on screen the instant the page loads. Nothing sits in front of it.

**Done** (`/`, once the set is complete)

- "That's today." A short summary: solved 4 of 5, 2 hints, 17 minutes.
- **The area map:** five tiles, one per area. Each tile's brightness fades with the number of days since that area was last exercised, with a caption like "last: 2 days ago". This replaces streaks. It shows what has gone quiet without punishing you.
- A link to this week's deep problem.
- "Come back tomorrow." No countdown timer.

**Deep** (`/deep`)

- One hard, multi-step problem, available Monday through Sunday. Same interaction as Play, with a 5-hint ladder and unlimited attempts. Any area.

**About** (`/about`)

- The why, in about 150 words, and a link to the repository.

### 8.2 Rules of play

- A "day" is the device's local date.
- The daily set is the same for everyone on a given date, Wordle-style. This costs nothing now and makes sharing and discussion possible later.
- Attempts per problem by answer type: exact text or number, 3; multiple choice, 1; code, unlimited runs and submissions; creative, 1 submission.
- Hints: up to 3, revealed in order. Using hints never prevents "Solved". Hint count is recorded.
- Give up: confirmation, then the full solution. Recorded as "gave up". No retry.
- Past days are not replayable. A missed day is gone. This keeps the set finite and prevents backlog guilt.
- A set belongs to its date. The date is checked on page load and whenever **Next** is pressed. If the stored date is not today, today's set starts at problem 1. Problems already answered on the old date keep their records; the rest of that set is discarded like a missed day. Two sets are never played in one day.
- When the set is done, the Done screen is all there is. No "one more".

### 8.3 Local state

Everything is stored in the browser's localStorage, validated on read with Zod, and nothing is sent anywhere.

- Per-problem record: status (solved or gave up), attempts, hints used, date, time spent.
- Today's record: date, index of the current problem, in-progress draft answer (so a refresh does not lose work).
- Per-area record: last exercised date (derivable from the above; kept as a cache).

Clearing browser storage resets everything. That is acceptable in v1.

"Report a problem" is a link that opens a pre-filled GitHub issue with the problem id. No backend needed.

## 9. Content

### 9.1 The five areas

| Area | What it is | Answer type |
|---|---|---|
| **Logic** | Deduction: knights and knaves, grid puzzles, rule finding | text, number, or choice |
| **Math** | Short numeric answers; paper and pen, at most 10 minutes, no heavy computation | number |
| **Code** | Write a small JavaScript function that passes hidden tests | code, run in the browser |
| **Words** | Anagrams, word ladders, "what connects these", light cryptic clues | text |
| **Create** | An open prompt with a constraint: "explain recursion to a 7-year-old in three sentences", "a 50-word story with no letter e" | free text, no checker |

The area list is configuration, not code, so areas can be added later without touching the flow.

Create has no right answer. Submitting marks it solved. After submission the author's note is shown: what a strong answer tends to do, and one example. This is the only area with no machine check, and in v1 no AI feedback (§15).

### 9.2 Difficulty

A 1 to 5 scale, assigned by the reviewer. The deep problem is 5. Calibration from real solve rates is a v2 concern.

The order of areas within a day is fixed. Each area therefore only needs problems in a narrow difficulty band, which keeps the content bank small and shaped.

| Slot | Area | Difficulty | Why here |
|---|---|---|---|
| 1 | Words | 1 | The fastest "aha". This is the hook (G2). |
| 2 | Logic | 2 | Warmed up, still quick. |
| 3 | Math | 3 | The middle of the set. |
| 4 | Code | 3–4 | The longest problem, while energy is still there. |
| 5 | Create | 3–4 | No right answer, so it cannot frustrate. Ends the day on making something rather than consuming. |

Create and Code are never slot 1: neither gives a quick "I figured it out" moment.

### 9.3 Problem schema

One JSON file per problem, validated with Zod. Fields:

- `id`, `area`, `difficulty` (1–5), `title`
- `prompt` (markdown)
- `answer`, one of:
  - `exact`: accepted strings, normalization rule (trim and lowercase by default)
  - `number`: value, optional tolerance
  - `choice`: options, index of the correct one
  - `code`: function signature, 1 to 3 visible examples (shown in the prompt as input and expected output), hidden tests as input/expected pairs, time limit in ms
  - `open`: optional min/max words, author's note
- `hints`: exactly 3 strings for daily problems, 5 for deep, each ending in a question mark
- `solution` (markdown): the answer and the reasoning, not just the result
- `source`: original, adapted, or generated; attribution when adapted
- `status`: draft, verified, approved, published
- `tags`, `createdAt`

### 9.4 Pipeline

Four scripts in the repository, run offline by whoever is producing content (see §16), never at runtime. The generate step needs an Anthropic API key and a small budget; the others run locally for free.

1. **generate** — An LLM drafts N problems for a given area and difficulty from a prompt template. Output is draft files. The template requires: hints phrased as questions, a solution that shows reasoning, and alternative accepted answers where wording could vary.
2. **verify** — Automatic checks by type. Code: run the reference solution against the tests. Number and exact: run a small solver script when one is supplied. Choice: the correct index is valid. Words: accepted answers exist in a word list. All types: no hint contains an accepted answer, every hint ends with a question mark. Passing drafts become `verified`.
3. **review** — Two passes. The builder reads each verified problem and fixes or discards it. The owner then reads each one and sets `approved`. Nothing is published without the owner's read.
4. **schedule** — Assigns approved problems to dates: one per area per day in difficulty order, never repeating a problem. Writes a schedule file and marks the problems `published`.

The build compiles problem files and the schedule into the app. Only `published` problems ship. Answers ship to the browser with the problems, because checking is client-side. For a free app with no competition between users this is fine, and it is what Wordle did.

Seed content: the builder writes about five problems per area first, so the generation template has concrete examples of the intended quality, then generates the rest.

### 9.5 Code runner

Code problems run in a Web Worker inside the browser. The worker is created from a blob URL, has no network access under the page's content security policy, receives inputs by structured clone, and is terminated at the time limit (2 seconds by default). JavaScript only in v1.

### 9.6 Quality bar

- No problem is published without a verified answer and the owner's read.
- Hints are questions. The verify step enforces the punctuation; the reviewer enforces the spirit.
- Every problem shows a "report" link.
- A wrong answer key found in use is unpublished the same day.

## 10. Technical decisions

These are the document author's calls, chosen to fit the owner's stack and the zero-cost constraint. The owner may override any of them.

- **Framework:** Next.js with the App Router, TypeScript, Tailwind CSS, shadcn/ui. No server-side state; the app can be statically exported.
- **Content:** JSON files under `content/problems/<area>/`, the schedule under `content/`, both loaded at build time.
- **State:** localStorage behind a small typed store, with Zod validation on read.
- **Code runner:** Web Worker as in §9.5.
- **Scripts:** TypeScript run with `tsx`. The generate step uses the Vercel AI SDK with a Claude model (default Claude Sonnet 5.5; the builder may choose). The API key is used only offline, never in the deployed app.
- **Tests:** unit tests for answer normalization and checking, schedule generation, and the verify script. A small set of browser end-to-end tests for the core flow: open and solve five to reach Done; give up; use the hint ladder; refresh mid-set without losing the draft.
- **Hosting:** Vercel free tier.
- **Repository layout:** `app/`, `components/`, `lib/`, `content/`, `scripts/`, `docs/`.

## 11. Success criteria for the two-week self-test

Measured from local state only, read by the author:

- Used on at least 10 of 14 days with no reminders (none exist).
- Reached the Done screen on at least 7 of those days.
- The author can name at least 5 occasions of opening Way instead of a feed.
- Zero days with a known-wrong answer key.
- Time from page load to first interaction under 10 seconds, by feel.

If the test fails, the fix is in the loop or the content, not in adding features.

## 12. Risks

| Risk | Mitigation |
|---|---|
| Content runs out | 150 problems before launch; the pipeline must produce more per hour of review than a day consumes |
| Wrong answer key | verify, human review, report link, same-day unpublish |
| Hint leaks the answer | verify rule plus review |
| First problem too hard | difficulty 1 by rule; tune from the author's own experience |
| Code runner hangs or escapes | Worker with hard timeout, no network, JavaScript only |
| Five areas get boring | areas are configuration; v2 adds more |
| The app itself becomes a chore | finite set, no guilt mechanics, no archive to "catch up" on |

## 13. Later (candidates, not commitments)

- A live AI coach: free-text, constrained to asking questions, answers cached per problem.
- AI feedback on Create submissions.
- Accounts and cross-device sync.
- Discussion under a problem, unlocked after solving it, like Project Euler's forums.
- Community-submitted problems with ratings; difficulty calibrated from solve rates.
- More areas: science, spatial, music, strategy.
- A share card for today's result.
- Public open-source release.

## 14. Left to the builder

- Component structure, styling, typography, colors. Dark mode follows the system setting.
- Markdown renderer. Code editor control (a textarea with tab support is enough in v1).
- Exact localStorage shape and how to migrate it.
- Worker sandbox internals.
- Wording of the generation prompt. Review tooling (editing files directly is acceptable).
- Test framework choices.

## 15. Decisions log

**Said by the owner in conversation:**

- Free, no paid tier. Existing paid puzzle sites are not a reason to stop.
- Built for the owner first.
- Must live on the device; leaving the device has already failed.
- Many problem types across subjects and difficulties, including creative activities.
- The purpose is keeping people thinking, reasoning, curious, in an AI-saturated time.
- Content production (2026-11-04): the AI builder writes seeds, generates, verifies, and does the first review; the owner reads and approves every problem before it is published.

**Made by the document author (override if wrong):**

- The name "Way", from the repository folder.
- Exactly five areas and the specific five chosen.
- Five problems per day, one per area, difficulty order 1, 2, 3, 3–4, 4.
- No accounts in v1; localStorage only; no cross-device sync.
- No runtime AI in v1. The "coach, not oracle" principle is delivered through pre-written hint ladders generated offline and reviewed. Live coaching is v2.
- No AI feedback on Create submissions in v1.
- The same daily set for everyone, keyed on device local date.
- Attempt limits per answer type.
- No archive, no replaying past days.
- Next.js App Router, Tailwind, shadcn/ui, Vercel.
- Code problems are JavaScript only, run in a Web Worker.
- A content bank of 150 at launch.
- A fixed area order within the day (Words, Logic, Math, Code, Create), so Words is always the hook.
- An unfinished set from an earlier date is discarded, never resumed.
- Code problems show visible examples with a Run action, and on Submit report the pass count and the first failing hidden case.

## 16. Open questions for the owner

One question remained after an independent builder read this document.

**Who produces and reviews the 150 launch problems?**

§9.6 says nothing is published unread by a human, and §9.4 says the author hand-writes the seeds. If the owner does all of that, launch is gated on the owner's time: roughly 25 seed problems to write and 150 to read, at about a minute each. If the builder (an AI agent) writes the seeds, runs generation and verification, and does the first review pass, the owner's part shrinks to a final read of the 150 before launch, but the owner must decide whether that is enough to satisfy "unread by a human", and an API key and budget are needed for generation.

**Decided 2026-11-04 by the owner:** the builder produces everything through `verified` and does a first review; the owner does the final read and sets `approved`. The owner's time is a final read of 150 problems, about a couple of hours. Generation needs an Anthropic API key supplied by the owner at build time.
