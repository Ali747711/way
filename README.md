# Way

Way is a free web app that replaces late-night scrolling with short bursts of
real thinking. Each day it offers a small, finite set of problems across
different areas, solved one at a time. Hints only ask questions, the answer
appears after you commit, and when the set is done Way stops. No ads, no
paywall, no data harvesting.

## Requirements

- Node 24+
- npm

## Commands

- `npm test` runs unit tests
- `npm run e2e` runs Playwright tests
- `npm run lint` runs ESLint
- `npm run build` builds content (`prebuild`) and the static export in `out/`
- Dev server: start it inside tmux because of a local shell hook:
  `tmux new-session -d -s way "npm run dev"`

## Content pipeline

Problems, schedule, and generation are documented in `content/README.md`.

## Deploy

- Hosted on Vercel as a static export.
- Set `NEXT_PUBLIC_REPO_URL` at build time, otherwise "Report a problem"
  links point at a placeholder.
- `prebuild` needs devDependencies installed (it runs a TypeScript script).
- After the first deploy, confirm the worker CSP header:
  `curl -I <site>/runner.worker.js`
- `.env.local` (generation keys) is never needed at build or deploy time.
