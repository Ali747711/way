import { z } from 'zod';

import { AREAS, DAILY_HINTS, DEEP_DIFFICULTY, DEEP_HINTS } from '@/lib/areas';

export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
export const WEEK_RE = /^\d{4}-W\d{2}$/;

export const areaSchema = z.enum(AREAS);

export const testCaseSchema = z.object({
  input: z.array(z.unknown()),
  expected: z.unknown()
});
export type TestCase = z.infer<typeof testCaseSchema>;

export const answerSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('exact'),
    accepted: z.array(z.string().min(1)).min(1),
    normalize: z.enum(['trim-lower', 'none']).default('trim-lower')
  }),
  z.object({
    type: z.literal('number'),
    value: z.number(),
    tolerance: z.number().nonnegative().default(0)
  }),
  z.object({
    type: z.literal('choice'),
    options: z.array(z.string()).min(2),
    correctIndex: z.number().int().nonnegative()
  }),
  z.object({
    type: z.literal('code'),
    signature: z.string(),
    entry: z.string(),
    examples: z.array(testCaseSchema).min(1).max(3),
    tests: z.array(testCaseSchema).min(1),
    timeLimitMs: z.number().int().positive().default(2000),
    reference: z.string()
  }),
  z.object({
    type: z.literal('open'),
    minWords: z.number().int().positive().optional(),
    maxWords: z.number().int().positive().optional(),
    authorNote: z.string()
  })
]);
export type Answer = z.infer<typeof answerSchema>;
export type AnswerType = Answer['type'];

export const contentStatusSchema = z.enum([
  'draft',
  'verified',
  'approved',
  'published'
]);
export type ContentStatus = z.infer<typeof contentStatusSchema>;

export const problemObjectSchema = z.object({
  id: z.string(),
  area: areaSchema,
  difficulty: z.number().int().min(1).max(5),
  title: z.string(),
  prompt: z.string(),
  answer: answerSchema,
  hints: z.array(z.string()),
  solution: z.string(),
  solver: z.string().optional(),
  source: z.object({
    kind: z.enum(['original', 'adapted', 'generated']),
    attribution: z.string().optional()
  }),
  status: contentStatusSchema,
  tags: z.array(z.string()).default([]),
  createdAt: z.string()
});

export const problemSchema = problemObjectSchema.superRefine((problem, ctx) => {
  const expectedHints =
    problem.difficulty === DEEP_DIFFICULTY ? DEEP_HINTS : DAILY_HINTS;
  if (problem.hints.length !== expectedHints) {
    ctx.addIssue({
      code: 'custom',
      path: ['hints'],
      message: `Difficulty ${problem.difficulty} requires exactly ${expectedHints} hints, got ${problem.hints.length}`
    });
  }
  if (
    problem.answer.type === 'choice' &&
    problem.answer.correctIndex >= problem.answer.options.length
  ) {
    ctx.addIssue({
      code: 'custom',
      path: ['answer', 'correctIndex'],
      message: `correctIndex ${problem.answer.correctIndex} is outside options (length ${problem.answer.options.length})`
    });
  }
});
export type Problem = z.infer<typeof problemSchema>;

export const scheduleSchema = z.object({
  days: z.record(z.string().regex(DATE_RE), z.record(areaSchema, z.string())),
  weeks: z.record(z.string().regex(WEEK_RE), z.string())
});
export type Schedule = z.infer<typeof scheduleSchema>;

export const dayFileSchema = z.object({
  date: z.string().regex(DATE_RE),
  problems: z.array(problemSchema).length(5)
});
export type DayFile = z.infer<typeof dayFileSchema>;

export const deepFileSchema = z.object({
  week: z.string().regex(WEEK_RE),
  problem: problemSchema
});
export type DeepFile = z.infer<typeof deepFileSchema>;
