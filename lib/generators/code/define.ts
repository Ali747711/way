// Node only (uses node:vm): offline content generation, never app code.
import vm from 'node:vm';

import type { TestCase } from '@/lib/content/schema';

import { isEqual } from '@/lib/runner/evaluate';

import { defineFamily, type Family } from '../family';
import type { Rng } from '../rng';

const TIME_LIMIT_MS = 2000;

export interface CodeTask<V> {
  /** Like 'code/digit-persistence'. */
  id: string;
  difficulty: 3 | 4;
  variants: readonly V[];
  key: (v: V) => string;
  title: (v: V) => string;
  /** The task in Markdown. Examples are appended automatically. */
  task: (v: V) => string;
  entry: (v: V) => string;
  /** Parameter list for the empty signature, like 'n' or 'words, k'. */
  params: (v: V) => string;
  /** Full JavaScript source of a correct function named `entry`. */
  reference: (v: V) => string;
  /**
   * Independent check of the reference: written differently from it, never
   * sharing its code. Every example and test is compared against it.
   */
  oracle: (v: V, args: unknown[]) => unknown;
  /** True when an argument list stays inside the ranges the task text states. */
  inDomain: (v: V, args: unknown[]) => boolean;
  /** One to three inputs shown to the player, each an argument list. */
  examples: (v: V) => unknown[][];
  /** Hidden inputs: fixed edge cases plus generated ones. At least five. */
  tests: (v: V, rng: Rng) => unknown[][];
  hints: (v: V) => string[];
  /** Markdown before the solution code: the idea in a sentence or two. */
  approach: (v: V) => string;
  /** Markdown after the code: pitfalls, edge cases, a curiosity. */
  notes: (v: V) => string;
  tags: string[];
}

/** Runs the reference on each input to get the expected outputs. */
export const runCases = (
  reference: string,
  entry: string,
  inputs: readonly unknown[][]
): TestCase[] => {
  const fn: unknown = vm.runInNewContext(
    `${reference}\n;${entry}`,
    {},
    {
      timeout: TIME_LIMIT_MS,
      microtaskMode: 'afterEvaluate'
    }
  );
  if (typeof fn !== 'function') throw new Error(`${entry} is not a function`);
  return inputs.map((input) => ({
    input,
    // Round-trip through JSON so the stored value is exactly what tests compare.
    expected: JSON.parse(
      JSON.stringify(
        vm.runInNewContext(
          'fn(...args)',
          { fn, args: structuredClone(input) },
          {
            timeout: TIME_LIMIT_MS,
            microtaskMode: 'afterEvaluate'
          }
        ) ?? null
      )
    ) as unknown
  }));
};

const uniqueInputs = (inputs: unknown[][]): unknown[][] => {
  const seen = new Set<string>();
  return inputs.filter((input) => {
    const k = JSON.stringify(input);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};

/** Throws if a case is outside the stated input ranges or disagrees with the oracle. */
const verifyCases = <V>(
  task: CodeTask<V>,
  v: V,
  cases: readonly TestCase[]
): void => {
  for (const { input, expected } of cases) {
    const where = `${task.id} ${task.key(v)} input ${JSON.stringify(input)}`;
    if (!task.inDomain(v, input)) {
      throw new Error(`${where}: input is outside the range the task states`);
    }
    const independent = task.oracle(v, structuredClone(input)) ?? null;
    if (!isEqual(expected, independent)) {
      throw new Error(
        `${where}: reference gave ${JSON.stringify(expected)} but the oracle gave ${JSON.stringify(independent)}`
      );
    }
  }
};

const call = (entry: string, input: unknown[]): string =>
  `${entry}(${input.map((arg) => JSON.stringify(arg)).join(', ')})`;

export const defineCodeFamily = <V>(task: CodeTask<V>): Family =>
  defineFamily<V>({
    id: task.id,
    area: 'code',
    slot: 'daily',
    params: () => task.variants,
    key: task.key,
    build: (v, rng) => {
      const entry = task.entry(v);
      const reference = task.reference(v);
      const examples = runCases(reference, entry, task.examples(v));
      const shown = new Set(examples.map((c) => JSON.stringify(c.input)));
      const hidden = uniqueInputs(task.tests(v, rng)).filter(
        (input) => !shown.has(JSON.stringify(input))
      );
      const tests = runCases(reference, entry, hidden);
      verifyCases(task, v, [...examples, ...tests]);
      const exampleList = examples
        .map(
          (c) =>
            `- \`${call(entry, c.input)}\` returns \`${JSON.stringify(c.expected)}\``
        )
        .join('\n');
      return {
        difficulty: task.difficulty,
        title: task.title(v),
        prompt: `${task.task(v)}\n\nExamples:\n\n${exampleList}`,
        answer: {
          type: 'code',
          signature: `function ${entry}(${task.params(v)}) {\n  \n}`,
          entry,
          examples,
          tests,
          timeLimitMs: TIME_LIMIT_MS,
          reference
        },
        hints: task.hints(v),
        solution: `${task.approach(v)}\n\n\`\`\`js\n${reference}\n\`\`\`\n\n${task.notes(v)}`,
        tags: task.tags
      };
    }
  });
