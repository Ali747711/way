import { AREA_CONFIG, DEEP_ID_PREFIX, type Area } from '@/lib/areas';
import type { Problem } from '@/lib/content/schema';

import { nextIds, toProblem } from './assemble';
import type { Family, ProblemDraft } from './family';
import type { Rng } from './rng';
import { pickCandidates, type Picked } from './select';

export interface BatchRequest {
  /** Every problem already in the bank, any status (rejected ones too). */
  existing: readonly Problem[];
  area: Area;
  daily: readonly Family[];
  deep: readonly Family[];
  count: number;
  deepCount: number;
  rng: Rng;
  createdAt: string;
}

export interface Batch {
  problems: Problem[];
  /** How many fewer than asked, because the families ran out. */
  missing: { daily: number; deep: number };
  /** Candidates passed over because every wording repeated a title. */
  titleSkips: number;
}

const TITLE_TRIES = 8;

/** Plans new draft problems without touching the disk. */
export const planBatch = (req: BatchRequest): Batch => {
  const used = new Set(
    req.existing.flatMap((p) =>
      p.source.attribution ? [p.source.attribution] : []
    )
  );
  const ids = req.existing.map((p) => p.id);
  const titles = new Set(req.existing.map((p) => p.title));
  let titleSkips = 0;

  // Families pick wording with the rng. Redraw a few times to find a title not
  // already used; if every wording clashes, move on to the next candidate.
  const buildFresh = ({ candidate }: Picked): ProblemDraft | null => {
    for (let tries = 0; tries < TITLE_TRIES; tries++) {
      const draft = candidate.build(req.rng);
      if (!titles.has(draft.title)) {
        titles.add(draft.title);
        return draft;
      }
    }
    return null;
  };

  const take = (
    families: readonly Family[],
    count: number,
    prefix: string
  ): Problem[] => {
    const order = pickCandidates(
      families,
      used,
      Number.MAX_SAFE_INTEGER,
      req.rng
    );
    const built: { pick: Picked; draft: ProblemDraft }[] = [];
    for (const pick of order) {
      if (built.length >= count) break;
      const draft = buildFresh(pick);
      if (draft) built.push({ pick, draft });
      else titleSkips++;
    }
    const newIds = nextIds(ids, prefix, built.length);
    return built.map(({ pick, draft }, i) =>
      toProblem(draft, {
        id: newIds[i],
        area: req.area,
        familyId: pick.family.id,
        key: pick.candidate.key,
        createdAt: req.createdAt
      })
    );
  };

  const daily = take(req.daily, req.count, AREA_CONFIG[req.area].idPrefix);
  const deep = take(req.deep, req.deepCount, DEEP_ID_PREFIX);
  return {
    problems: [...daily, ...deep],
    missing: {
      daily: req.count - daily.length,
      deep: req.deepCount - deep.length
    },
    titleSkips
  };
};
