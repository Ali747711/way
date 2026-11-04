import { AREAS } from '@/lib/areas';

import {
  dayFileSchema,
  deepFileSchema,
  type DayFile,
  type DeepFile,
  type Problem,
  type Schedule
} from './schema';

/** Thrown when a schedule entry cannot be turned into a publishable file. */
export class AssembleError extends Error {
  constructor(public readonly problems: string[]) {
    super(`Cannot assemble content, offending: ${problems.join(', ')}`);
    this.name = 'AssembleError';
  }
}

// Returns the id when the problem cannot ship (missing or unpublished).
const findOffender = (
  id: string,
  byId: Map<string, Problem>
): string | undefined => {
  const problem = byId.get(id);
  return problem?.status === 'published' ? undefined : id;
};

export const assembleDay = (
  schedule: Schedule,
  byId: Map<string, Problem>,
  date: string
): DayFile => {
  const day = schedule.days[date];
  if (!day) throw new AssembleError([`${date} (not in schedule)`]);

  const ids = AREAS.map((area) => day[area]);
  const offenders = ids
    .map((id) => findOffender(id, byId))
    .filter((id): id is string => id !== undefined);
  if (offenders.length > 0) throw new AssembleError(offenders);

  const problems = ids.map((id) => byId.get(id) as Problem);
  return dayFileSchema.parse({ date, problems });
};

export const assembleWeek = (
  schedule: Schedule,
  byId: Map<string, Problem>,
  week: string
): DeepFile => {
  const id = schedule.weeks[week];
  if (!id) throw new AssembleError([`${week} (not in schedule)`]);

  const offender = findOffender(id, byId);
  if (offender) throw new AssembleError([offender]);

  return deepFileSchema.parse({ week, problem: byId.get(id) });
};
