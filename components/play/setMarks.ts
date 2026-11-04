import { AREAS, type Area } from '@/lib/areas';
import type { RecordStatus, WayState } from '@/lib/state/schema';

export type MarkStatus = RecordStatus | 'open';

export interface SetMark {
  id: string;
  area: Area;
  status: MarkStatus;
  current: boolean;
}

/**
 * One mark per problem, in slot order. Problems up to and including `index`
 * take the status of their record; later ones are open. An `index` past the
 * end means the set is finished, so no mark is current.
 */
export const toMarks = (
  items: ReadonlyArray<{ id: string; area: Area }>,
  records: WayState['records'],
  index: number
): SetMark[] =>
  items.map((item, i) => ({
    id: item.id,
    area: item.area,
    status: i <= index ? (records[item.id]?.status ?? 'open') : 'open',
    current: i === index
  }));

/** Marks for a finished day, from the day's problem ids and their records. */
export const doneMarks = (
  ids: string[],
  records: WayState['records']
): SetMark[] =>
  toMarks(
    ids.map((id, i) => ({
      id,
      // Slot order matches AREAS, so a missing record still gets its colour.
      area: records[id]?.area ?? AREAS[i % AREAS.length]
    })),
    records,
    ids.length
  );
