import type { Area } from '@/lib/areas';
import { problemSchema, type Problem } from '@/lib/content/schema';

import { attributionFor, type ProblemDraft } from './family';

/** The next `n` free ids like 'm-006', after the highest one already used. */
export const nextIds = (
  existing: readonly string[],
  prefix: string,
  n: number
): string[] => {
  const pattern = new RegExp(`^${prefix}-(\\d+)$`);
  const highest = existing.reduce((max, id) => {
    const match = pattern.exec(id);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return Array.from(
    { length: n },
    (_, i) => `${prefix}-${String(highest + i + 1).padStart(3, '0')}`
  );
};

export interface DraftMeta {
  id: string;
  area: Area;
  familyId: string;
  key: string;
  createdAt: string;
}

/** A generated draft as a full problem file, validated against the schema. */
export const toProblem = (draft: ProblemDraft, meta: DraftMeta): Problem =>
  problemSchema.parse({
    id: meta.id,
    area: meta.area,
    difficulty: draft.difficulty,
    title: draft.title,
    prompt: draft.prompt,
    answer: draft.answer,
    hints: draft.hints,
    solution: draft.solution,
    ...(draft.solver === undefined ? {} : { solver: draft.solver }),
    source: {
      kind: 'generated',
      attribution: attributionFor(meta.familyId, meta.key)
    },
    status: 'draft',
    tags: draft.tags,
    createdAt: meta.createdAt
  });
