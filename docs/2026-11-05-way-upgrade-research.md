# Way upgrade research

| | |
|---|---|
| Date | 2026-11-05 |
| Status | Research for the owner's review. Nothing here is decided. |
| Design it builds on | `docs/2026-11-04-way-design.md` |
| Track notes (full sources) | `docs/research/2026-11-05/` (puzzles, problems, humans, hooks, tools, market) |
| Method | Six parallel web-research tracks, then synthesis. The newest claims were re-checked by hand (see §10). |

## 0. Summary

Way's core bet holds up. The research supports a finite daily set, no streaks, hints that only ask questions, and no answers before commitment. The best daily puzzles in the world share the same shape. The strongest AI-and-learning study found that withholding answers is what prevents harm. Way already does both.

The gaps are elsewhere:

1. **Content runs out first.** Math, Code and Create have no unscheduled problems left, so nothing can be scheduled after 2026-11-08. Hand-made problems will not keep up with 5 a day. Way needs generators that compute the answer, with a solver that rejects any puzzle that does not have exactly one solution.
2. **The problem mix is narrow.** The research points to several problem families that are short, need no lookup, are machine-checkable, and suit non-programmers: probability and base rates, estimation, critical thinking, strategy, reflection traps, and grid deduction.
3. **Way has no way into the moment.** The feed wins because it is one tap away. The best-evidenced tool here is friction at the moment of the habit: a redirect from the social app, a home-screen install, and a self-chosen if-then plan.
4. **Nothing travels.** Wordle grew through a spoiler-free result line. Way has no share at all.

### Top 12 upgrades, ranked

| # | Upgrade | Why (evidence) | Effort | Conflicts with current design? |
|---|---|---|---|---|
| 1 | Solver-verified generators for Logic, Math, Code and Create | Non-unique answers are the main failure of AI-drafted puzzles. The schedule ends 2026-11-08. | M | No |
| 2 | New text-only problem families: Chance, Guess, Strategy, reflection traps | Natural-frequency framing lifts correct Bayesian answers from about 16% to about 46%. All are checkable by script and need no new UI. | M | Changes the fixed five areas (§5) |
| 3 | Spoiler-free share line on the Done screen | Wordle's growth came from the share grid. | S | No. Listed as "later" in §13 of the design. |
| 4 | "Tired tonight" short mode: 2 problems, then Done | Making the behavior easier beats raising motivation (Fogg). Designers cap play deliberately. | S | No |
| 5 | Installable offline app (PWA) with progress export and import | A home-screen icon is the most stable cue. iOS can wipe browser storage after about a week of disuse. | M | No |
| 6 | A setup page for redirecting social apps to Way (iOS Shortcuts recipe) | The one sec study cut actual opens of target apps by 57% over 6 weeks. | S to build, M to test on devices | No, but must be tested before it is promised |
| 7 | Create with a constraint checker plus an example to compare against | The hard constraint becomes checkable. Comparing against an exemplar gave better self-feedback than checklists in one small study. | S-M | No |
| 8 | Show the player's own attempt beside the solution, plus a private "how you did" note | Solutions you generate yourself are remembered better. WordleBot is NYT's most loved add-on. | S-M | No |
| 9 | Gentle progress: per-area mastery levels and a private calendar with no counter | Streak lifts at Duolingo are small (0.38% to 1.7%). One missed day barely affects habit forming. | M | No. Keep the area map. |
| 10 | A claims policy and honest positioning | The FTC fined Lumosity $2M in 2016 for unsupported claims. Spark, the closest competitor, makes unsupported claims. | S | No |
| 11 | A tap-grid component for Queens, Tango and Zip style puzzles | LinkedIn's flagship daily games. One sentence of rules, one solution, no language needed. | L | Adds a new area |
| 12 | Weekly chess tactic from the Lichess database | About 6.2 million puzzles, public domain (CC0), already rated and engine-checked. | M | Adds a weekly format |

**Defer:** a runtime AI coach, any server or social backend, percentiles, Python or SQL problems, and AI-image detection.

**Never:** streaks, notifications or badges, infinite mode, a "brain score" or IQ claim, ads, or a paywall.

## 1. The moment Way competes for

**What drives late-night phone use.** A 43-study meta-analysis links bedtime procrastination to shorter sleep, worse sleep and lower self-control. The certainty is low, and the studies show correlation, not cause (Hill et al., 2022). "Revenge bedtime procrastination" is a popular label, not a studied construct. Doomscrolling research is mostly cross-sectional and self-reported.

**What helps.** The best evidence is for planning, not willpower:

- Mental contrasting plus if-then plans reduced bedtime procrastination in two student trials (N=510 and N=250), including at 3 weeks (Valshtein, Oettingen, Gollwitzer, 2020).
- If-then plans have a medium-to-large effect on reaching goals in general, d=0.65 across 94 tests (Gollwitzer and Sheeran, 2006).
- Habits take a median of 66 days to become automatic. One missed day did not significantly hurt habit formation (Lally et al., 2009).
- Making the behavior easier is more dependable than raising motivation (Fogg Behavior Model).

**What this means for Way.** Way must cost less effort to open than the feed, give a quicker "I got it", and end. It already ends. The upgrades below make it easier to open (install, redirect, if-then plan) and easier to finish (short mode).

**Sleep honesty.** The harm of late nights is lost sleep. Way can say "20 minutes instead of 90 minutes of scrolling, then sleep". It should not imply that late use is good for you.

## 2. AI, effort and learning: what the evidence allows Way to say

| Study | What it found | Limits |
|---|---|---|
| Bastani et al., PNAS 2025, about 1,000 high-school students | A plain GPT-4 tutor improved practice scores, but students did worse than controls once it was removed. A tutor with learning guardrails largely avoided the harm. | One school, math only |
| Kosmyna et al., MIT Media Lab preprint, June 2025 | The LLM group showed the weakest EEG connectivity and had trouble quoting their own essays. | 54 people, 18 in the final session, not peer reviewed at release |
| Lee et al., CHI 2025, 319 knowledge workers | More confidence in AI went with less critical-thinking effort. | Self-report survey |
| Gerlich, Societies 2025, 666 people | Frequent AI use correlated with lower critical-thinking scores. | Correlation only |

Bastani's result is the one that matters for Way. A tutor that withholds answers is the design that avoided harm. Way's question-only hints and commit-first reveal match that design. Way should not claim that the study proves Way works.

**Learning findings that support the current design:**

- Solutions reached with an "aha" are remembered better, for up to two weeks (Danek and Wiley, 2020).
- Retrieval practice is one of the most reliable effects in learning research.
- Curiosity comes from a felt gap in knowledge, and it needs some prior knowledge to close the gap (Loewenstein, 1994). Problems should start from what any adult knows.
- Learning is fastest at about 85% success in models (Wilson et al., 2019). The link to human flow is speculation. Treat 75 to 90% solved-with-effort as a tuning target, not a claim.

**Brain training does not transfer.** Training improves the trained task. Broad transfer is not established (2014 Stanford and Max Planck consensus statement, Simons et al. 2016). The FTC fined Lumos Labs $2M in January 2016 for unsupported claims.

**Claims policy (proposed):**

| Way can say | Way must never say |
|---|---|
| "Practice thinking without looking it up." | "Makes you smarter", "boosts IQ or memory" |
| "Twenty minutes, then it's done." | "Prevents dementia or cognitive decline" |
| "Answers you work out yourself stick better." | "Rewires your brain", "science-backed brain training" |
| "Built to make you think, not to give you answers." | "Fixes the damage from AI" |
| "Early research suggests heavy AI use can reduce effort." | Any health or medical outcome |

**What people find interesting.** The evidence is thin. Mass-attention lists such as Wikipedia's top pages are dominated by news and celebrity, which is no guide for puzzles. Surveys show durable adult interest in health and medicine (70% of US adults in Pew's 2015 survey), psychology (top for people under 40 in one survey), nature and space. For a puzzle product, framing matters more than topic: problems about people, money, decisions, how things work and language.

## 3. What makes a great daily problem

Designers of Wordle, Connections, Spelling Bee, Puzzmo, LinkedIn's games and Nikoli puzzles say the same things:

1. **One a day, the same for everyone, done in minutes, with a deliberate stop.** Wardle: "you can play it in three minutes, and that is all you get." Puzzmo caps Pile-Up Poker at 5 hands a day, and its designer would prefer 3.
2. **Rules you can learn in one sentence.** No outside knowledge (the Nikoli rule).
3. **Exactly one solution, reachable by deduction.** Easy instances need one simple insight.
4. **The "aha" is the product.** Spelling Bee's editor wants "smile-inducing aha moments". Mystery Hunt constructors say a great aha is the hardest part to find.
5. **A tiny, spoiler-free result** that people can share.
6. **Failure feels like your own miss**, never a trick.

**Scale of the category.** NYT Games puzzles were played 11.1 billion times in 2024: Wordle 5.3 billion, Connections 3.3 billion, Strands 1.3 billion. LinkedIn says 84% of its game players return the next day, and every LinkedIn board is human-made.

**Lesson on volume.** NYT and LinkedIn hand-make puzzles with teams. Way has one owner, so the only path to volume is "generate, then verify with a solver, then the owner approves a short list". Research on AI-generated puzzles agrees: ZebraLogic builds the solution first, removes clues one at a time, and uses a solver to keep exactly one solution. An LLM pipeline produced Connections puzzles close to NYT quality (58.5% vs 69.1% solve rate, not significant, n=78), but the categories still need human judgment.

**What faded.** Wordle clones built on trivia (geography, film, music) need lookup and mostly faded. Spotify shut Heardle in May 2023. Way should skip trivia-shaped games.

## 4. The problem catalog

Scored on Way's criteria: 2 to 10 minutes, no lookup, a machine-checkable answer, broad appeal beyond programmers, producible at volume, and a quick "I got it".

### 4.1 Ranked problem types

| Rank | Type | Original example | Verify by | Answer UI | Effort |
|---|---|---|---|---|---|
| 1 | **Knights and knaves** (Logic) | A says "B is a knave." B says "A and I are the same type." Who is what? (A knight, B knave.) | Enumerate every truth assignment and require exactly one consistent one | Short text or toggles | S |
| 2 | **Reflection traps** (hook) | A phone and a case cost $210. The phone costs $200 more than the case. What does the case cost? ($5, not $10.) | Arithmetic | Number | S |
| 3 | **Chance: base rates and probability** | 1 in 100 people have a condition. A test catches 90% of them and wrongly flags 9% of healthy people. You test positive. About what chance do you have it? (About 9%.) | Exact enumeration or simulation | Number or choice | S-M |
| 4 | **Gardner-style math** | Weighings, river crossings, handshakes, cutting and folding counts, parity and invariants | Brute force | Number | S |
| 5 | **Guess: Fermi estimation** | About how many times does a heart beat in a 70-year life? Pick the closest power of ten. (10^9.) | A cited true figure, accepted within an order of magnitude | Choice of powers of ten, or a range | M |
| 6 | **Strategy: game theory** | 21 coins, take 1 to 3 per turn, whoever takes the last coin wins. You go first. How many do you take? (1.) | Game-tree search | Number | M |
| 7 | **Logic grids (zebra)**, 3x3 to 4x4 | Who owns the fish? | Solver counts solutions | Short text | M |
| 8 | **Code: read and predict** | What does `[1, 2, 3].map(x => x * 2).filter(x => x > 2).length` return? (2.) | Run it at authoring time | Number or text | S |
| 9 | **Create with a constraint** | Describe your morning in exactly 30 words without the letter "a". | Script checks the constraint. Craft is self-judged against an example. | Free text | S-M |
| 10 | **Spot: critical thinking** | A chart's axis starts at 95. What makes it misleading? Also fallacies, manipulation techniques, source-checking choices. | Owner review of the single correct choice | Choice, with charts as generated SVG | M |
| 11 | **Grid deduction** (Queens, Tango, Zip) | Place one queen per row, column and color region, with no two touching. | Solver uniqueness check | Tap grid | L (one component serves all three) |
| 12 | **Why: physics intuition** | You drop a ball on a smoothly moving train. Where does it land? (At your feet.) | Textbook physics plus an owner check | Choice | M |
| 13 | **Spatial** | Which of these nets folds into a cube? | Script | Choice with generated SVG | M |
| 14 | **Chess tactic** (weekly) | A mate-in-2 from the Lichess database | Replay the moves with a chess library in a unit test | Board | M |
| 15 | **Mini-meta** (weekly deep) | Five small answers spell a final word | Owner craft | Text | M |

**Skip or limit:**

- **Cryptic crosswords:** the answer is checkable but the clue quality is not.
- **Rebus and lateral thinking as core types:** the answers are ambiguous.
- **Trivia-shaped games:** they need lookup.
- **AI-image detection:** people score only about 51 to 65%, image assets carry licensing problems, and the task ages fast.
- **Philosophy and ethics:** only as "which principle does this argument rely on" choice questions, or as an open weekly problem.

**Uzbek bonus.** Grid, spatial and chess puzzles need no language. They are the cheapest way to give Uzbek players problems in their own terms while text problems stay in English.

### 4.2 How each type gets made

| Type | Who drafts | What verifies | Rejection rule |
|---|---|---|---|
| Knights and knaves, zebra, grids | Generator, or an AI-drafted story on a generated structure | A solver enumerates solutions | Reject unless exactly one solution |
| Math, Chance, Strategy | A parameterized template with a seed | The answer is computed by code, never by the model | Reject if the computed answer differs from the draft |
| Code read-and-predict | An AI draft | Run the code in Node at authoring time | Reject if the output differs |
| Guess | An AI draft with a cited source | The owner checks the source | Reject if there is no primary source |
| Spot, Why | An AI draft | Owner review | Reject if any second choice is defensible |
| Create | An AI draft with a constraint spec | A script validates the exemplar against the constraint | Reject if the exemplar fails |
| Chess | The Lichess dataset filtered by rating and popularity | Replay with a chess library | Reject if the puzzle has more than one solution line |

This extends the current pipeline (AI drafts, script verifies, owner approves) rather than replacing it.

### 4.3 What Way may republish

| Source | License | Use |
|---|---|---|
| Lichess puzzle database | CC0 (public domain) | Republish freely |
| Wikidata | CC0 | Republish; facts still need a check |
| dwyl english-words (already used) | Unlicense | Republish |
| Simon Tatham's Portable Puzzle Collection | MIT (code) | Port the generators to TypeScript with the notice kept |
| Exercism exercises | Mostly MIT | Republish with the notice |
| GSM8K | MIT | Ideas only; it is overused in AI training data |
| Project Euler | CC BY-NC-SA 4.0 | Inspiration only |
| OEIS | CC BY-SA 4.0 | Inspiration only; generate sequences from formulas |
| Advent of Code | "Free to use, not free to copy" | Never copy |
| AMC, UKMT, MATH/AoPS, Force Concept Inventory | Copyright or unclear | Inspiration only |
| Chessground (Lichess board UI) | GPL-3.0 | Avoid in an MIT repo. Draw a small SVG board instead. |

Rule: write original problems in known formats. Keep an "inspired by" note in the problem JSON.

## 5. A proposed daily structure

Today the five areas are fixed in order: Words, Logic, Math, Code, Create. The proposal keeps five problems and about 20 minutes, but turns areas into slots with rotating types.

| Slot | Role | Difficulty | Rotates between |
|---|---|---|---|
| 1 | Hook, under 2 minutes | 1 | Words, reflection trap, quick knights and knaves |
| 2 | Reason | 2 | Logic (knights, zebra), Strategy, later Grid |
| 3 | Numbers | 3 | Math, Chance, Guess |
| 4 | Build or judge | 3-4 | Code (read and predict, or write), Spot |
| 5 | Make | 3-4 | Create with a constraint checker |
| Weekly | Deep | 5 | Mini-meta, Fermi chain, long Bayes, chess, open ethics |

**What this changes:**

- Code moves from every day to some days, which helps non-programmers. Four of the five slots still need no code on Code days.
- A sixth daily problem is not proposed. It would break the 20-minute budget.
- The area map would track types or slots. That is a design decision for the owner.

## 6. Hooks that bring people back without guilt

Each item below is checked against Way's anti-goals: no scroll, no guilt, no nagging.

1. **Spoiler-free share line** (S, no server). Something like `Way 11/05 · Words 🟩 Logic 🟨 Math 🟩 Code ⬜ Create ✍️`, plus the URL. Use neutral marks, never red. Wordle's grid was invented by players in New Zealand, and Wardle then added a button. Reported growth was from about 90 players on 2021-11-01 to over 300,000 by 2022-01-02 (secondary sources).
2. **Redirect from social apps** (S to build, M to test). The one sec PNAS study (2023; 280 people over 6 weeks) found 57% fewer actual opens of the target apps. A dismiss option worked best, and a reflection message did not work. Users rebound after breaks (CHI 2024), so this is a standing routine, not a cure. On iOS, a Shortcuts automation such as "When Instagram is opened, open URL" is the only hook. Three things are unverified: whether it runs without a tap, whether it opens the installed app or Safari, and what happens to the social app. **Test on a real iPhone before promising it.**
3. **Installable offline app** (M, no server). Add a manifest, a hand-written service worker and an "Add to Home Screen" hint, since iOS has no install prompt. Safari can evict storage after about a week of disuse, and installed apps keep separate storage. That makes **export and import of progress** necessary. Do not use the badge API, because a badge is a red-dot mechanic.
4. **Short mode** (S). "Just two tonight" leads to the normal Done screen. Nothing is lost.
5. **An if-then plan** (S, local only). An optional line on the Done screen, such as "When I put my phone on the charger, I open Way, then I sleep." No notification.
6. **Gentle progress** (M, local only). Keep the fading area map. Add per-area levels ("Seen", "Steady", "Fluent") based on hints used over time, and a private month calendar with no counter. Never use loss language. Duolingo's own published lifts from streak features are small (Streak Freeze raised daily actives by 0.38%; a streak animation raised new-learner 7-day return by 1.7%). The company also says some slack motivates more than rigid rules.
7. **A "how you did" review** (S-M, local only). Show your committed answer beside the solution. Compare your hints with your own history ("fewer hints than your last 10 Logic problems"). Global percentiles would need a server, so skip them.
8. **"Send this problem to a friend"** (S-M). Link only to today's or a past problem, never a future one.
9. **Defer: discussion after solving** (Project Euler style). It needs a server and moderation. A $0 stand-in is a GitHub Discussions thread per problem.
10. **Do not adopt:**
    - Leaderboards
    - Streaks and streak freezes
    - Push notifications and badges
    - Variable rewards from the Hook model
    - Hint currencies

## 7. Tools and techniques

| Need | Choice | Notes |
|---|---|---|
| Uniqueness checks | A plain backtracking solver in TypeScript. Use `z3-solver` in Node only if needed. | Z3 in the browser needs cross-origin isolation headers. Keep it offline. |
| Grid puzzle generators | Port 2 or 3 of Tatham's generators (MIT) | Effort L. Queens: place the solution first, grow regions, and re-check uniqueness. |
| Chess | Lichess CC0 dataset, filtered to about 365 per difficulty band. Draw a custom SVG board. | A few hundred KB of static JSON. Avoid GPL chessground. |
| Charts and spatial figures | Generate SVG from JSON at build time | No runtime cost |
| Share card | Text to clipboard first. Add a PNG later via canvas or the content script. | Satori with static export has an open issue. |
| Offline | A manual `public/sw.js` that precaches the next week of day files | Fits a static export |
| Runtime AI coach | **Skip for now.** | Chrome's Prompt API shipped in Chrome 148 (May 2026), but it is desktop-only, needs a large download and strong hardware, and supports 5 languages, not Uzbek. WebLLM needs WebGPU and 0.4 to 1 GB downloads. Pre-written, script-checked question hints already do the job. |
| Python or SQL problems | Defer | Pyodide is about 6.4 MB. They are programmer-only. |
| Backend, if social features ever come | Turso's free tier does not pause. Supabase's free tier pauses when idle. Cloudflare D1's free tier hard-fails past its daily limits since 2026-09-01. | Opt-in and anonymous only, or not at all |

## 8. Market and positioning

**The gap.** No product was found that is free, ad-free and account-free, covers several subjects including code and open creativity, gives question-only hints, and ends after a finite set. Not finding one does not prove none exists.

**The closest competitor** is Spark by The Mind Company, formerly Elevate Labs, launched 2025-11-12:

- **What it is:** three handcrafted daily puzzles built on real-world facts, free, with a $11.99 a year archive.
- **How it sells itself:** explicitly as the counter to "cognitive offloading" to AI, without published evidence.
- **The difference:** Spark is trivia and knowledge. Way is reasoning and making, is fully free, needs no account and keeps data on the device. Way can no longer claim to be first with an anti-AI framing, but an honest version of that framing is still open.

**User complaints Way can turn into strengths:**

| Complaint about others | Way's answer |
|---|---|
| Surprise billing, thin content for the price (Brilliant, Headway, Blinkist) | Free, with no paywall ever |
| Free tiers capped at about 3 games a day (Lumosity, Elevate, Peak) | The cap is the design, and it's free |
| Hints and error flags that give answers away | Hints that only ask questions |
| Forced sign-up (the top complaint on a 2026 Show HN thread about an ad-free puzzle site) | No account |
| Suspected AI-made puzzles with multiple solutions | "Verified by script, approved by a human" shown on every problem |
| NYT moved the Mini Crossword behind a paywall in August 2025 | Free stays free |

**Signals about restraint:**

- Wordle shipped with no ads and no notifications.
- Puzzmo caps play.
- Advent of Code cut 2025 to 12 days and removed its global leaderboard.
- LinkedIn allows one play per game per day.

**Tailwind with a caveat.** "Brain rot" was Oxford's 2024 Word of the Year. Duolingo's "AI-first" backlash in April 2025 did not stop 40% year-on-year growth in daily users. Anti-AI sentiment is a real identity for some people, not a mass-market growth engine.

**Positioning line (proposal):** "A daily workout for your thinking that you finish in 20 minutes. Free, no account, and no answers until you try."

**Sustainability.** Lichess shows that free at scale works as a donation-funded non-profit. Puzzmo and Spark both ended up charging for archives. Way needs a plan without ads or a paywall, such as a GitHub Sponsors link. Decide before any growth.

## 9. Decisions for the owner

These change the approved design, so they are the owner's call.

1. **Rotating slots instead of five fixed areas** (§5). This is needed for most new problem types.
2. **A share line.** It is already listed as "later" in §13 of the design.
3. **A weekly "revisit" problem.** Spaced retrieval supports it, but it touches the "no archive" rule.
4. **The grid component** (effort L). It is worth it only if a visual area is wanted.
5. **Chess as a weekly format.** It would use a custom SVG board.
6. **Sustainability:** a donation link, yes or no.
7. **How to know Way works without analytics:** an optional, local-only self-report on the Done screen ("Did this replace a scroll tonight?"), visible only to the player.

## 10. Proposed roadmap

**Now, before 2026-11-08 (the schedule ends):**

- Build generators for Math (parameterized), Code (read-and-predict, run to verify) and Create (a constraint spec plus an exemplar check), then refill the schedule.
- Words (9 approved) and Logic (13 approved) have a short buffer.

**Phase 1, text-only, no new UI (about 1 to 2 weeks):**

- Add problem types: knights and knaves, zebra, Chance, Guess, Strategy and reflection traps, with their verifiers.
- Ship the share line, short mode and the claims page.
- Add the Create constraint checker and the attempt-beside-solution reveal.

**Phase 2, the way in:** the installable offline app, progress export and import, the redirect setup page (tested on a real iPhone and Android phone), the if-then plan, gentle progress and the "how you did" note.

**Phase 3, visual:** the tap-grid component (Queens, Tango, Zip), Spot with SVG charts, spatial puzzles and the weekly chess tactic.

**Later:** a runtime AI coach, social features and other languages for problems.

## 11. Evidence quality

**Checked by hand on 2026-11-05:**

- Spark's launch on 2025-11-12 and its framing (Business Wire, MediaPost).
- The Chrome Prompt API in Chrome 148, released 2026-05-05 (Gigazine, Shopifreaks).
- The Lichess puzzle database's CC0 license (Hugging Face dataset card; the Lichess page was fetched by the tools researcher).

**Weak or second-hand:**

- Wordle growth numbers.
- NYT per-game splits.
- Competitor prices.
- LinkedIn's 84% return rate (company-reported).
- The Show HN complaints, which come from a single thread.
- Most AI-and-cognition studies, which are small, correlational or preprints.

Re-verify any number before quoting it publicly.

**Not found:**

- A study comparing substitution with abstinence for late-night phone use.
- Independent churn data for learning apps.
- Player counts for Puzzmo and LinkedIn Games.
- Whether an iOS Shortcuts redirect opens an installed web app.
- The Center for Humane Technology design guide (the page returned 404).

## 12. Key sources

Full numbered source lists, with dates, are in the six track notes in `docs/research/2026-11-05/`. The most load-bearing sources:

**Human behavior and learning**

- Hill et al., bedtime procrastination meta-analysis, Sleep Medicine Reviews, 2022. https://www.pubmed.gov/36375334/
- Valshtein, Oettingen, Gollwitzer, MCII and bedtime procrastination, 2020. https://www.psy.uni-hamburg.de/arbeitsbereiche/paedagogische-psychologie-und-motivation/personen/oettingen-gabriele/dokumente/valshtein-oettingen-gollwitzer-2020-bedtime-procrastination.pdf
- Bastani et al., "Generative AI without guardrails can harm learning", PNAS, 2025. https://papers.ssrn.com/abstract=4895486
- Kosmyna et al., "Your Brain on ChatGPT", arXiv, 2025-06-10. https://arxiv.org/abs/2506.08872
- Danek and Wiley, insight memory advantage, Cognition, 2020. https://www.psycharchives.org/handle/20.500.12034/2732
- Stanford Center on Longevity, brain-training consensus, 2014-10-20. https://longevity.stanford.edu/a-consensus-on-the-brain-training-industry-from-the-scientific-community-2
- FTC, Lumosity settlement, 2016-01-05. https://ftc.gov/news-events/press-releases/2016/01/lumosity-pay-2-million-settle-ftc-deceptive-advertising-charges
- Gigerenzer and Hoffrage natural frequencies, summarized in Frontiers in Psychology, 2015. https://pmc.ncbi.nlm.nih.gov/articles/PMC4604268

**Habits and engagement**

- Grüning, Riedel, Lorenz-Spreen, one sec, PNAS, 2023-02-21. https://www.pnas.org/doi/10.1073/pnas.2213114120
- Duolingo, "How the Duolingo streak builds habit", 2022-01-31. https://blog.duolingo.com/how-duolingo-streak-builds-habit
- Six Colors, interview with Zach Gage, 2024-08-14. https://sixcolors.com/post/2024/08/interview-game-developer-zach-gage-on-pile-up-poker-and-resisting-dark-patterns/
- TIME, Josh Wardle interview, 2022-02-01. https://time.com/6143715/wordle-sale-josh-wardle-interview
- The Spinoff, origin of the Wordle share grid, 2022-01-13. https://thespinoff.co.nz/business/13-01-2022/those-coloured-boxes-on-twitter-are-new-zealands-fault

**Puzzle design and generation**

- arXiv 2407.11240, LLMs as Connections puzzle generators, 2024. https://arxiv.org/html/2407.11240v1
- ZebraLogic, arXiv 2502.01100, 2025. https://arxiv.org/pdf/2502.01100
- UVA Magazine, "Bee Keeper" (Sam Ezersky). https://digital.uvamagazine.org/articles/bee-keeper/

**Tools and datasets**

- Lichess open database, puzzles. https://database.lichess.org/#puzzles
- Simon Tatham's Portable Puzzle Collection. https://www.chiark.greenend.org.uk/~sgtatham/puzzles/
- Chrome Prompt API docs. https://developer.chrome.com/docs/ai/prompt-api

**Market**

- Spark launch, Business Wire, 2025-11-12. https://www.businesswire.com/news/home/20251112891470/en
- Advent of Code. https://adventofcode.com/about
