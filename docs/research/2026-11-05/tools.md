# Research: tools, datasets and techniques for Way (research date 2026-11-05)

Conventions: FACT = sourced claim, [n] = source number below. INFERENCE = mine. "Not found" means I did not locate it in the sources checked; it does not mean it does not exist. Many sources are secondary blogs; verify numbers on the official page before building on them.

## 1. Key findings

- FACT: The Lichess puzzle database has 6,193,530 puzzles, is CC0 (public domain, redistributable), updated 2026-11-03. Each record has FEN, UCI move list, Glicko-2 Rating and RatingDeviation, Popularity (-100 to 100), NbPlays, Themes, and an optional DailyDate [1]. Chess is the one area where Way could have an essentially unlimited, pre-rated, pre-verified problem pool at zero authoring cost.
- FACT: Simon Tatham's Portable Puzzle Collection has 40 puzzles under the MIT licence, with JavaScript/WebAssembly versions linked from its page [2]. No build instructions for embedding were on that page (not found there).
- FACT: Dataset licences differ sharply. Republishable: Lichess puzzles (CC0) [1], Wikidata (CC0) [10], GSM8K (MIT, per multiple dataset listings) [7]. Share-alike: OEIS is CC BY-SA 4.0 [6]. Non-commercial and share-alike: Project Euler problem content is CC BY-NC-SA 4.0 (title of its copyright page; I could not fetch the page, it returned HTTP 401) [5]. MATH: no licence statement found; the paper attributes problems to the MAA [7]. Treat MATH/AoPS as inspiration only.
- FACT: Research on LLM-generated puzzles converges on generate-then-verify. ZebraLogic builds a puzzle from a full solution, removes clues one at a time, and uses a solver to keep exactly one solution [3]. A 6x6 Sudoku study seeds with Z3 and filters to unique, minimal puzzles [3]. SymStep found two published puzzles that each had two valid solutions [3]. One blog (anecdotal) found "no unique solution" was the top rejection reason (39.55%) in an alphametic generate/verify loop [3].
- FACT: Lichess rates puzzles with Glicko-2; each attempt counts as a game between player and puzzle, so solving lowers the puzzle's rating and failing raises it (forum descriptions, not an official spec) [8].
- FACT: Chrome shipped the Prompt API (Gemini Nano) in Chrome 148 (May 2026). Requirements per Google docs: 22 GB free disk, more than 4 GB VRAM or 16 GB RAM with 4+ cores; not on Chrome for Android/iOS; languages en, ja, es, de, fr (so no Uzbek). Mozilla, Apple, Microsoft opposed it per a secondary report [4].
- FACT: Pyodide first load is about 6.4 MB download; older benchmarks show 0.5-1.3 s init on fast connections [9]. PGlite is cited at about 3.7 MB gzipped (2024 figure, likely dated) [11]. I found no sql.js size.
- FACT: z3-solver for the browser uses pthreads, so it needs SharedArrayBuffer and cross-origin isolation headers (COOP/COEP); in Node no headers are needed [12]. Static hosts like GitHub Pages cannot set these headers (INFERENCE; not verified for the host Way uses).
- FACT: WebLLM needs WebGPU with no CPU fallback; Transformers.js falls back to WASM on CPU; iOS Safari got WebGPU with iOS 26 (secondary sources, unverified against Apple/MDN); a 1B Q4 model is roughly 750 MB (one blog) [13].
- FACT: Next.js static export PWA: use a hand-written `public/sw.js` registered from a client component; iOS has no programmatic install prompt, users use Share > Add to Home Screen [14]. Build-time OG images via Satori work with `generateStaticParams`, but TTF/OTF fonts only, no CSS grid, and an open issue reports problems with `output: "export"` [15].
- FACT: Supabase free projects pause after a week of inactivity (secondary sources, conflicting on current status); Turso free tier does not pause; Cloudflare D1 free plan queries fail after daily row read/write limits since 2026-09-01 (limit numbers not given on the changelog page) [16][17].

## 2. Datasets and licences

| Source | Use for | Licence | Can Way republish? |
|---|---|---|---|
| Lichess puzzles [1] | Chess tactics: FEN + solution moves + rating + themes | CC0 | Yes, including bundled subsets |
| Wikidata [10] | Geography/history/science "which is bigger / order these" questions | CC0 | Yes (some argue EU database-right edge cases; low risk) |
| GSM8K [7] | Word-problem style and seed ideas | MIT (listings) | Yes with notice, but problems are widely seen by models; low novelty |
| OEIS [6] | Pattern/sequence problems | CC BY-SA 4.0 | Only with attribution and share-alike on derived content; safer to use as inspiration and generate sequences from formulas |
| Project Euler [5] | Number-theory puzzles | CC BY-NC-SA 4.0 | Way is free but "non-commercial" and share-alike obligations apply to the content; inspiration only |
| MATH / AoPS [7] | Competition math | No licence found; MAA-origin | Inspiration only |
| SCOWL [18] | Word lists for Words area | BSD-compatible/MIT-like (repo claim; check the Copyright file) | Yes with notice |
| WordNet [18] | Synonym/relations puzzles | WordNet 3.0 licence: keep the disclaimer in distributions | Yes with notice |
| Wiktionary dumps [18] | Etymology, definitions | CC BY-SA (older page; confirm) | Share-alike; inspiration only |
| dwyl english-words, Open Trivia DB | Word lists, trivia | Not found | Check before use |

INFERENCE: Do not republish any third-party hand-written riddle collection without a licence check. Prefer problems that Way generates itself from a structure (see section 3), which sidesteps licensing and answer-key risk at once.

## 3. Generators, solvers and verification

- Simon Tatham's collection [2]: MIT, 40 puzzles (Towers, Tents, Unequal, Keen, Light Up, Pattern, Slant, Mosaic, etc.). Each has a generator that guarantees unique solutions. The JS/WASM builds exist, but I found no documented embedding guide; embedding means compiling C with Emscripten (INFERENCE: effort L) or linking out. Using the original code as a reference for a TypeScript port of 3-4 puzzles is more realistic.
- Solver-in-the-loop pipeline (offline, in Node, in the existing content pipeline): LLM proposes a puzzle spec (constraints, theme, story); a script encodes it, enumerates all solutions (SAT/SMT or plain backtracking), rejects anything with 0 or 2+ solutions, and records the unique answer and a minimal-clue check [3]. This matches Way's "scripts verify answers, owner approves" rule and runs at build time, so no runtime cost.
- Z3 via `z3-solver` npm: works in Node with no special headers [12]; browser use needs cross-origin isolation, which complicates a static host. Keep Z3 offline only (INFERENCE).
- Chess UI: chessground (Lichess's board) is GPL-3.0 [19]. Bundling it would likely require Way's source to be GPL-3.0-compatible; Way's repo is public (brief), so this may be acceptable, but it is a licence decision for the owner. chess.js licence: I could not confirm (one third-party page lists it as MIT) [19]. A tiny custom SVG board for puzzle display avoids the issue.
- Verification of chess puzzles: Lichess puzzles are already engine-verified; Way only needs to replay moves with chess.js in a unit test.

## 4. Difficulty calibration

- Lichess approach: Glicko-2 per puzzle and per player, rating deviation tracks confidence [1][8].
- Zero-server option (INFERENCE): store a local Glicko/Elo per Area in localStorage; pick the next day's difficulty from that. Initial puzzle difficulty comes from the author/LLM estimate plus, for chess, the Lichess rating. Because Way gives the same set to everyone, per-user adaptation needs a different design (e.g. choose among 2-3 tiers per area) and would weaken the shared "same set" property; flag this conflict.
- Calibration against real solve rates needs aggregated data, which conflicts with "no analytics". A free backend (below) would only be needed for opt-in anonymous counts. Not found: any published study of calibration for ~5 puzzles/day apps.

## 5. Runtime AI for a questions-only coach

- Chrome Prompt API [4]: free, on-device, but desktop Chrome only, large hardware bar, English/Japanese/Spanish/German/French only. Cannot serve Uzbek or mobile.
- WebLLM / Transformers.js [13]: 0.4-1+ GB downloads, WebGPU needed for WebLLM; heavy for a 20-minute daily habit and risky on phones.
- INFERENCE: The coach only needs to ask questions. Pre-write the 3-question hint ladder offline (already in v1) and verify it by script. A runtime model adds failure risk (leaking answers, wrong hints) for little gain. Treat runtime AI as a later opt-in, progressive enhancement for Chrome desktop only.

## 6. Code, SQL, regex in the browser

- Pyodide [9]: about 6.4 MB first download, around 1 s init; lazy-load only on days with a Python problem. Offers non-JS audience coverage. Cost: cache and offline need service-worker handling.
- PGlite [11]: about 3.7 MB gzipped (2024); sql.js size not found. For SQL puzzles, sql.js (SQLite) is probably lighter; measure before deciding.
- Regex puzzles need no library: JS `RegExp` in the existing Web Worker, with a timeout, and a verifier that tests the learner's pattern against hidden match/non-match lists. Effort S.

## 7. PWA, sharing, social backends

- PWA on static export [14]: manifest via the App Router plus a manual `public/sw.js`; iOS install is manual (Share > Add to Home Screen), no install prompt. Offline play is a natural fit because the day's JSON can be precached.
- Share cards [15]: Satori-based OG images can be generated at build time with `generateStaticParams`, but there is an open issue with `output: "export"`; fonts must be TTF/OTF. Fallback (INFERENCE): generate PNGs in the offline content script or a canvas at share time. Web Share API support: not verified in these searches; check MDN.
- Backends, only if social is ever added: Turso free tier does not pause [16]; Supabase free pauses after a week idle [16]; Cloudflare D1 free queries fail past daily limits [17]. A Cloudflare Worker plus D1 or a static JSON counter suits anonymous aggregate stats. All conflict with "no accounts/no analytics" unless strictly opt-in. Local-first sync options were not researched in depth (not found).

## 8. Implications for Way (ranked)

1. Solver-verified generator pipeline for Logic (S-M). Extend the offline pipeline: LLM drafts a puzzle spec; a Node script enumerates solutions and rejects non-unique ones; owner approves. Why: research shows non-unique answers are the main LLM failure mode [3]; it enforces "every answer key correct". License risk none; bundle impact zero; $0.
2. Chess tactics as a new area or weekly deep problem, from Lichess CC0 data (M). Pick about 365 puzzles per band by Rating and Popularity, ship as static JSON (a few hundred KB), replay moves in a unit test. Why: the owner's own history shows chess worked [brief]; data is free and rated [1]. Risk: board UI; custom SVG avoids GPL [19]. Fits "short rounds, no lookup". $0.
3. Programmatic problem families with parameterized generators (M). Math word problems, sequences, cryptarithms, and grid puzzles generated from templates with a deterministic seed; answer computed by code, not by an LLM. Why: sidesteps licences (OEIS share-alike, Euler NC-SA [5][6]) and answer-key risk. No runtime cost.
4. Port 2-3 Tatham-style puzzles to TypeScript (L). Candidates: Towers, Tents, Unequal (unique-solution generators). MIT allows porting with notice [2]. Interactive grid UI is the main cost. Only if the owner wants a visual puzzle area.
5. Offline PWA with manual service worker (S-M). Precache app shell and upcoming week's JSON [14]. iOS install is manual; add a one-line hint. $0, no tracking. Bundle impact: tiny.
6. Regex and SQL puzzle types (S for regex, M for SQL). Regex in the existing Worker; SQL via lazy-loaded sql.js or PGlite [11] (measure size). Widens beyond JS, still programmer-leaning, which conflicts with "not only programmers"; keep them as one of several Code variants.
7. Pyodide for Python code problems (M). About 6.4 MB lazy-loaded [9]. Gives a second language but adds weight; do only if demand appears. Heavy for mobile data.
8. Local-only adaptive difficulty (S-M). Per-area Elo in localStorage choosing between 2-3 pre-made tiers. Conflict: weakens the shared "same set for everyone" feel; make it optional. No server.
9. Build-time share cards (S-M). Satori or canvas PNG per day, no answers revealed [15]. Verify the static-export issue; otherwise generate the PNG in the content script. Share is a social option, not a hook; keep it quiet.
10. Wikidata-derived "estimate/order" questions (M). CC0 [10]; verify facts by script against a snapshot; good for general-audience Words/Logic. Risk: stale or wrong facts; owner approval needed.
11. Runtime AI coach (L, defer). Chrome Prompt API only on desktop, five languages, heavy hardware [4]; WebLLM downloads large models [13]. Pre-written hints already deliver the goal. Flag as conflicting with $0-simple and Uzbek support.
12. Backend for social/calibration (L, defer, opt-in only). Turso or Cloudflare Workers/D1 stay near $0 but D1 now hard-fails past daily limits [17]. Conflicts with "no accounts, no analytics" unless anonymous and opt-in.

## 9. Sources

1. Lichess open database (puzzles section). https://database.lichess.org/#puzzles (page updated 2026-11-03)
2. Simon Tatham's Portable Puzzle Collection. https://www.chiark.greenend.org.uk/~sgtatham/puzzles/ (copyright 2004-2021; fetched 2026-11-05)
3. ZebraLogic https://arxiv.org/pdf/2502.01100 (Feb 2025); AutoLogi https://arxiv.org/pdf/2502.16906 (Feb 2025); 6x6 Sudoku explanations https://arxiv.org/pdf/2505.15993 (May 2025); SymStep https://arxiv.org/pdf/2607.23055 (2026); Solvability boundary https://arxiv.org/pdf/2512.01661 (Dec 2025); alphametic blog https://dev.to/feed/hidetzu (undated)
4. Chrome Prompt API docs https://developer.chrome.com/docs/ai/prompt-api (updated 2026-05-19); news report https://www.shopifreaks.com/google-ships-chrome-prompt-api-embedding-gemini-nano-despite-formal-opposition-from-mozilla-apple-microsoft-and-w3c/ (2026-05-17)
5. Project Euler copyright page. https://projecteuler.net/copyright (undated; fetch returned 401, title seen in search)
6. OEIS licence. https://oeis.org/LICENSE (undated)
7. MATH paper https://arxiv.org/pdf/2103.03874 (2021); GSM8K listing https://huggingface.co/datasets/Pq234/gsm8k (undated)
8. Lichess forum threads on puzzle rating. https://lichess.org/forum/general-chess-discussion/puzzle-rating-question (undated, community not official)
9. Pyodide 0.23 release https://blog.pyodide.org/posts/0.23-release/ (2023); roadmap https://pyodide.org/en/314.0.5/_sources/project/roadmap.md (undated)
10. Wikidata licensing. https://www.wikidata.org/wiki/Wikidata:Licensing (undated)
11. Simon Willison on PGlite https://feeds.simonwillison.net/2024/Feb/23/pglite (2024-02-23)
12. Z3 JS docs mirror https://www.mintlify.com/Z3Prover/z3/bindings/javascript/installation (undated)
13. WebGPU/browser LLM overviews https://pinggy.io/blog/run_llm_in_browser_webgpu/ and https://appdevelopermagazine.com/webgpu-in-ios-26/amp/ (2025-2026, secondary)
14. Next.js PWA guide https://nextjs.org/docs/app/guides/progressive-web-apps (current docs); skill page https://skills.cat/skills/jakerains/agentskills/nextjs-pwa (undated); iOS notes https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide (undated)
15. OG image guides https://dev.to/mitsuashi/how-i-built-19-per-topic-og-images-with-japanese-fonts-at-build-time-nextjs-satori-1ako (undated); issue https://github.com/vercel/next.js/issues/51147 (2023)
16. Free database comparisons https://flaviocopes.com/database-hosting-options/ and https://agentdeals.dev/database-free-tier-comparison-2026 (2026, secondary)
17. Cloudflare D1 free-tier enforcement changelog. https://developers.cloudflare.com/changelog/post/2026-09-01-d1-free-tier-limit-enforcement/ (2026-09-01)
18. SCOWL https://www.github.com/kevina/wordlist ; WordNet licence note https://en.wiktionary.com/wiki/Wiktionary:Princeton_WordNet (undated)
19. Chessground repo https://github.com/ornicar/chessground (GPL-3.0); third-party licence list https://chess-openings-app.pages.dev/licenses (undated)
