# Track: Problems beyond word games (research date 2026-11-05)

Convention: [F] = fact with source number; [I] = my inference/opinion; "not found" = searched, not confirmed.

## 1. Key findings

- Almost every famous problem SOURCE is copyrighted and not reusable. Project Euler problem text is CC BY-NC-SA 4.0 [F1]; OEIS is CC BY-SA 4.0 [F3]; Advent of Code says it is "free to use, not free to copy" and asks that puzzle text and inputs stay out of repos [F2]; AMC problems are (c) MAA and the old pamphlet bans electronic copies [F5]; UKMT claims copyright on BMO papers and bars public-facing "systematic analysis" of multiple questions without written permission (BMO page; Junior/Senior Challenge terms not found) [F6]. Consequence [I]: Way's content must be ORIGINAL problems written in a known format, not copied. The formats themselves (Fermi, base-rate, "what does this print") are not ownable ideas.
- Only a few sources are clearly reusable: Exercism exercises are mainly MIT (platform text is (c) Exercism, user solutions CC BY-NC-SA) [F7]; xkcd is CC BY-NC 2.5 (comics; What If? terms not confirmed) [F8]; OEIS under share-alike [F3]. Way is non-commercial and free, so NC licenses are possible but SA would force Way's derived content open too [I].
- Estimation is a mature, verifiable problem family. Fermi problems are solved by splitting into small parts, stating assumptions, rounding aggressively; classic answers can be checked (Chicago piano tuners about 290) [F9]. Jane Street's Estimathon scores intervals (floor(U/L)-style scoring per a third-party guide; not official) [F10]. Calibration apps exist (Open Philanthropy's, thousands of questions, no longer maintained since 2024-06-19) [F11].
- Base-rate/Bayes problems are teachable: across 15 tasks, correct Bayesian answers rose from roughly 10-20% to about 50% when framed as natural frequencies (counts out of 1000) rather than probabilities [F12]. That is a ready "teachable explanation" for Way.
- Reflection puzzles (bat-and-ball CRT) exploit intuition-vs-reflection; Frederick 2005, 3 items [F13]. Reported failure rates come only from secondary sources (about 83% miss at least one; unverified) [F13].
- Critical-thinking skills are trainable in minutes. Bad News game: 21% less likely to rate fake headlines reliable after about 15 minutes (2019) [F14]. Jigsaw prebunking videos under 2 minutes: 5-10% better technique recognition in a YouTube field test (authors involved with Google) [F14]. Fact-checkers beat historians and students at judging sources because they read laterally (n=45, deliberately non-random) [F15]. SHEG/Civic Online Reasoning lessons are free but registration-gated; license not confirmed [F16].
- AI-image detection is near chance for typical people: about 51-65% accuracy across 2023-2026 studies, confident people err most, under an hour of training raised accuracy about 30% in one study [F17]. This is a strong, on-mission area ("AI-era skill") but detection is a moving target [F17].
- Open-ended answers can get feedback without a grader by comparing against exemplars: exemplar comparison produced higher-level self-feedback than checklist criteria in one study (small sample, effects not significant on writing) [F18]. Comparative judgement is documented with human judges only; no evidence found that it works without them [F18].

## 2. Problem families by subject

### 2.1 Math (contest/recreational)
Sources: AMC/AIME (MAA copyright) [F5], UKMT [F6], Project Euler (CC BY-NC-SA, computational, needs code) [F1], Fiddler on the Proof (successor to FiveThirtyEight's Riddler; weekly puzzles, some paywalled; reuse terms not found) [F19]. MATHCOUNTS, Brilliant, Jane Street monthly puzzles, Martin Gardner: license not checked, assume all rights reserved [I].
What makes one elegant for Way [I]: one clean statement, no machinery, a "trick" that collapses the work (invariants, parity, symmetry, counting two ways), numeric answer under 1000 or a short expression, checkable by script by brute force. Pen and paper, under 10 minutes. Way already has Math at difficulty 3; the gap is variety within it (number sense, counting, geometry-by-reasoning, parity/invariants).
Reuse: write originals; cite inspiration only.

### 2.2 Estimation and calibration
Fermi: decompose, state assumptions, round [F9]. Verifiability issue [I]: answer must be a published figure (census, physical constants), so every problem needs a cited true value; accept within a factor (order of magnitude). Format that fits Way: "pick the closest of 5 powers of ten" or "guess a range you are 80% sure about", then reveal the decomposition. Calibration quiz (give a 90% interval for 10 facts) is a distinct, replayable-feeling but finite format. Open Philanthropy app no longer maintained [F11]; Metaculus code is BSD-2 but question content license not found [F20].

### 2.3 Probability and statistics intuition
Monty Hall, birthday problem, base-rate (mammography), Simpson's paradox, regression to the mean, "is this chart misleading". Natural frequencies improve success [F12]. [I] These are the highest "aha per minute" family for non-programmers, all machine-verifiable by simulation or exact enumeration, and each explanation can be a short worked count.

### 2.4 Science and physics intuition
Force Concept Inventory (1992, (c) AAPT; instrument is published in the paper but reuse not allowed without check) [F21]. xkcd What If style questions are CC BY-NC for comics at least [F8]. [I] Format: conceptual multiple choice ("a ball is dropped from a moving train...", "which cup of tea cools faster"), one correct choice, explanation that names the misconception. Verifiable by textbook physics; risk is ambiguity, so each needs strict wording and an owner physics check. Everyday-engineering ("why is the handle on the left of the pot") is fuzzier; use only when answer is unambiguous.

### 2.5 Critical thinking and AI-era skills
- Lateral reading / source checking [F15, F16]. Problem in Way's shape: show a fictional site description, ask "what is the first thing you do?" with choices, explain. Cannot use live web (no lookup rule); use fictional, self-contained scenarios [I].
- Fallacy spotting and prebunking technique recognition [F14]: "which manipulation technique is this headline using?" (emotional language, false dichotomy, scapegoating, etc.). Multiple choice, strong explanation.
- Misleading charts: truncated axes, dual axes, cherry-picked windows. Render charts as SVG generated from JSON; answer "what is wrong" multiple choice [I].
- AI-image/real: near-chance baseline [F17]. Needs image assets: real photos (licensing burden) and AI images (generation cost, aging fast). Cost/benefit weak for a $0 static app unless using only owner-generated and public-domain photos [I]. Safer variant: text-based "which of these two answers was written by a model" is low-verifiability; skip.
- "Reasoning without a model": [I] a short set of problems where the intuitive/LLM-typical answer is wrong (CRT-style), explicitly on mission.

### 2.6 Philosophy, ethics, decisions, economics
Thought experiments (trolley, Ship of Theseus, Newcomb) have no single right answer, so they fit only as rubric/open format or as "which principle does this argument rely on" multiple choice [I]. Game-theory puzzles (prisoner's dilemma variants, pirate gold, beauty-contest 2/3 of average, unexpected hanging) have verifiable equilibria and are elegant; fits the Logic or a "Strategy" area [I]. Economics intuition (opportunity cost, sunk cost, incentives) works as scenario multiple choice. Not researched with primary sources beyond the above; treat as [I].

### 2.7 Spatial, pattern, memory, geography/history
Mental rotation, cube nets, tangram fit, matchsticks: verifiable by script, but need generated graphics (SVG; feasible with $0 static) [I]. Raven-style matrices and sequences: verifiable, and sequence answers can be generated programmatically; OEIS is share-alike [F3] so do not scrape; generate own sequences [I]. Geography deduction ("which country borders exactly these three") is the biggest existing daily-game ecosystem (Globle, Worldle, Travle, TimeGuessr, GeoGrid) [F22]; verified player counts not found [F22]. Those games depend on a lookup-free knowledge floor, so they fit "no lookup" but reward trivia over reasoning [I].

### 2.8 Code beyond "write a function"
Advent of Code: not redistributable and anti-AI-solving stance [F2]. Exercism MIT [F7] but multi-file, language-track exercises. Project Euler computational [F1]. Way already runs JS in a Web Worker. [I] Better non-programmer-friendly options than writing code: "what does this print" (verified by running it), find the bug from a described symptom (choice), regex "which of these strings match", SQL "how many rows" over a tiny table printed in the problem. All verifiable by execution during authoring. Programmer-only, so keep to at most one slot per day (anti-goal).

### 2.9 Creative problems with constraints
Oulipo-style constraints (lipogram, 5 words, one-syllable explanations), "explain X to a 10-year-old", design challenges. No checker. Evidence-backed options: compare your answer to 1-2 exemplars and self-assess against what the exemplar did, which gave higher-level self-feedback than checklists [F18]. [I] A deterministic partial checker is possible for constraints (e.g., "no letter e": script counts, "exactly 20 words") giving a verified pass/fail on the constraint plus an exemplar for craft. This converts Create into a hybrid that is machine-checkable for the hard part and honest about the soft part.

## 3. What the daily-game world suggests
[F22] Wordle-like daily games span words, geography, logic. [I] Takeaway: the strongest engagement here is a single shared daily with a share artifact, which Way already has. Nothing found supports an infinite mode being better; that conflicts with Way's anti-goals anyway.

## 4. Implications for Way (ranked)

Scoring: 2-10 min, no lookup, verifiable, teachable, broad appeal, volume. (5 = best)

1. **Probability and base-rate intuition (area name: "Chance")**. Fit 5/5/5/5/5/4. Verifiable by enumeration; natural-frequency explanations are proven to help [F12]. Candidate to replace Logic or rotate with it. Effort S-M, static. No anti-goal conflict.
2. **Estimation / Fermi ("Guess")**: answers as "closest power of ten" or range; every problem needs a cited true figure [F9]. Fit 5/5/4/5/5/3 (fact sourcing slows production). Rotate with Math. Effort M, static.
3. **Critical-thinking scenarios ("Spot")**: fallacies, misleading charts, source-checking decisions, prebunking techniques [F14, F15]. Fit 4/5/4/5/5/4. Directly on mission (AI era). Original fictional scenarios avoid license problems. Effort M, static; charts via generated SVG.
4. **Reflection traps (CRT style)** as the daily "hook" or Words replacement: 30-90 second problems where the intuitive answer is wrong [F13]. Fit 5/5/5/5/5/3 (few classics; must write new ones). Effort S, static.
5. **Game-theory/strategy puzzles** (equilibrium, guess-2/3-average): verifiable, elegant. Fit 4/5/5/4/4/3. Rotate with Logic. Effort M, static.
6. **Conceptual physics intuition ("Why")**: choice questions naming a misconception [F21]. Fit 4/5/4/5/4/3 (wording risk, needs owner physics check; FCI itself not reusable). Effort M, static.
7. **Spatial puzzles** (cube nets, rotation): script-verifiable, generated SVG, wide appeal, no language needed (helps Uzbek UI). Fit 4/5/5/3/4/5. Effort M, static, needs an SVG generator.
8. **Code made friendly** ("what does this print", find the bug, regex/SQL result): keep Code but shift most days to read-and-predict, which a non-programmer cannot do, so make it opt-in per day or rotate [I]. Effort S, static.
9. **Create with a constraint checker + exemplar compare**: script validates constraint, show exemplar after commit [F18]. Effort S-M, static. No grader needed. Keep as slot 5.
10. **Geography deduction**: popular genre [F22] but trivia-heavy and dates; lowest priority, fits only as occasional puzzle with clues that make it deducible.
11. **AI-image detection**: strong mission fit [F17] but asset licensing, aging models, and near-chance difficulty make it frustrating; defer. Effort L.
12. **Philosophy/ethics**: only as "which principle does this rely on" choice questions, or as weekly open "Deep" problem with exemplar comparison. Not verifiable otherwise. Effort S.

Which areas replace or rotate: keep Words as the hook, keep Math and Code and Create (Create gets the constraint-checker upgrade); rotate Logic with Chance/Strategy; add "Guess" (estimation) and "Spot" (critical thinking) as rotating slots rather than a 6th daily area (adding a sixth breaks the 20-minute budget) [I]. A weekly deep problem can host Fermi chains, longer Bayes, or an open ethics question.

Content rule [I]: never copy contest, Project Euler, AoC, OEIS, or FCI material; write originals, run verification scripts (enumeration/simulation/execution), and keep a "inspired by" note in the problem JSON.

## 5. Sources
1. Project Euler copyright page, projecteuler.net/copyright (HTTP 401 on direct fetch; CC BY-NC-SA 4.0 confirmed via search snippet), accessed 2026-11-05. https://projecteuler.net/copyright
2. Advent of Code About/FAQ, accessed 2026-11-05. https://adventofcode.com/about
3. OEIS End-User License Agreement (CC BY-SA 4.0, revision 2023-02-24). https://oeis.org/wiki/The_OEIS_End-User_License_Agreement
4. (reserved)
5. AoPS Wiki AMC pages and 2015 AMC 12 pamphlet note (MAA copyright), accessed via search 2026-11-05. https://artofproblemsolving.com/wiki/index.php/2025_AMC_12B
6. UKMT BMO usage terms (Nov 2023). https://bmos.ukmt.org.uk/home/usage.shtml
7. Exercism Terms of Service and licenses. https://exercism.org/docs/using/legal/terms-of-service ; https://exercism.org/docs/using/licenses
8. xkcd license page. https://www.xkcd.com/license.html
9. Stony Brook, Fermi estimates; SOINC Fermi handout. https://www.stonybrook.edu/laser/_melia/estimations.html ; https://www.soinc.org/sites/default/files/FermiQuestionsHandout.doc
10. Jane Street Estimathon Guide (third party). https://everythingquant.com/guides/jane-street-estimathon/
11. Open Philanthropy, calibration app (update 2024-06-19). https://www.openphilanthropy.org/blog/new-web-app-calibration-training
12. Gigerenzer and Hoffrage 1995, as summarised in Frontiers in Psychology 2015. https://pmc.ncbi.nlm.nih.gov/articles/PMC4604268
13. Frederick 2005, J. Economic Perspectives 19(4); Wikipedia summary. https://en.wikipedia.org/wiki/Cognitive_reflection_test
14. Roozenbeek et al., Bad News and prebunking (2019-2022). https://doi.org/10.17863/CAM.48846 ; https://zmescience.com/science/fake-news-pre-bunking-8246364
15. Stanford Daily on Wineburg and McGrew lateral reading study, 2017-10-26. https://stanforddaily.com/2017/10/26/fact-checkers-more-likely-than-peer-expert-groups-to-identify-credible-information-determine-gse-researchers/
16. Digital Inquiry Group (formerly SHEG), Civic Online Reasoning. https://cor.inquirygroup.org/
17. AI-face detection: Leeds news; APS 2026 poster; UVic. https://www.leeds.ac.uk/news/article/5897/learning-to-spot-ai-generated-faces ; https://www.psychologicalscience.org/conventions/archive/2026annual/paper/59791/ ; https://news.uvic.ca/media-release/humans-trained-to-spot-ai-faces-in-battle-against-deepfake-fraud/
18. Exemplar vs criteria self-feedback, Dawson College summary (2024-04). https://dawsonite.dawsoncollege.qc.ca/2024/04/do-students-generate-better-self-feedback-by-comparing-their-work-against-assessment-criteria-or-exemplars/
19. Fiddler on the Proof. https://thefiddler.substack.com
20. Metaculus (code BSD-2 per Wikipedia). https://en.wikipedia.org/wiki/Metaculus
21. Hestenes et al. 1992 FCI, (c) AAPT. https://www.compadre.org/portal/items/detail.cfm?ID=2641
22. Daily-game roundup (gist list of geography games). https://gist.github.com/mkosler/ac5a6310d98dfb8e98e0f07b09cf8228

Not found / unchecked: licenses for MATHCOUNTS, Brilliant, Jane Street puzzles, Martin Gardner, Wikipedia content (assumed CC BY-SA from general knowledge, unverified here), UKMT Challenge papers, SHEG/COR, Metaculus question content; Wordle-style daily player numbers; Wordle stats cited elsewhere are low-authority.
