# Content pipeline

Problems live in `content/problems/<area>/<id>.json`. The offline scripts move each problem through a status flow.

## Status flow

`draft -> verified -> approved -> published`

- `draft`: set by `npm run content:generate` (or by hand when authoring).
- `verified`: set by `npm run content:verify` once every automatic check passes (hint rules, difficulty band, word list, reference solution, solver).
- `approved`: set by the owner after reading the problem.
- `published`: set by `npm run content:schedule` when the problem is placed on the schedule.

## Reviewing

1. Run `npm run content:status` to see counts per status and area, plus the `verified` problems waiting for review.
2. Open each listed file under `content/problems/`, read it, and fix anything wrong.
3. Set `"status": "approved"` in the file. Problems left at `verified` are never scheduled.

## Word list

`content/wordlist.txt` is `words_alpha.txt` from [dwyl/english-words](https://github.com/dwyl/english-words), released under the Unlicense (public domain). It has one lowercase word per line and is used to check that every answer in the Words area is a real English word.

## Unpublishing a bad problem the same day

1. Remove the problem from `content/schedule.json`.
2. Set its `status` back to `draft` in its problem file.
3. Rebuild and redeploy the site.
