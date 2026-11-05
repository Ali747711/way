import type { Problem } from '@/lib/content/schema';
import type { StatusChange } from '@/lib/pipeline/review';

import { writeProblemFile } from './files';

export const parseIdsFlag = (argv: string[], command: string): string[] => {
  const i = argv.indexOf('--ids');
  const ids = (i === -1 ? '' : (argv[i + 1] ?? ''))
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
  if (ids.length === 0) throw new Error(`usage: ${command} --ids id1,id2`);
  return ids;
};

/** Writes each changed problem back to the file it was read from. */
export const writeChanged = async (
  files: readonly { path: string; problem: Problem }[],
  { changed, skipped }: StatusChange,
  verb: string
): Promise<void> => {
  const pathOf = new Map(files.map((f) => [f.problem.id, f.path]));
  for (const p of changed) {
    const path = pathOf.get(p.id);
    if (path === undefined) throw new Error(`no file for ${p.id}`);
    await writeProblemFile(path, p);
    console.log(`${verb} ${p.id}`);
  }
  for (const s of skipped) console.log(`skipped ${s.id}: ${s.reason}`);
  if (skipped.length > 0) process.exitCode = 1;
};
