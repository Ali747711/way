import { z } from 'zod';

import { areaSchema, DATE_RE } from '@/lib/content/schema';

export const recordStatusSchema = z.enum(['solved', 'gave_up', 'failed']);
export type RecordStatus = z.infer<typeof recordStatusSchema>;

export const recordSchema = z.object({
  area: areaSchema,
  status: recordStatusSchema,
  attempts: z.number().int(),
  hints: z.number().int(),
  date: z.string().regex(DATE_RE),
  seconds: z.number().int()
});
export type ProblemRecord = z.infer<typeof recordSchema>;

export const currentSchema = z.object({
  attempts: z.number().int(),
  hints: z.number().int(),
  draft: z.string(),
  startedAt: z.number(),
  result: recordStatusSchema.nullable()
});
export type Current = z.infer<typeof currentSchema>;

export const sessionSchema = z.object({
  key: z.string(),
  index: z.number().int(),
  current: currentSchema
});
export type Session = z.infer<typeof sessionSchema>;

export const stateSchema = z.object({
  version: z.literal(1),
  daily: sessionSchema.nullable(),
  deep: sessionSchema.nullable(),
  records: z.record(z.string(), recordSchema)
});
export type WayState = z.infer<typeof stateSchema>;

export type Slot = 'daily' | 'deep';

/** Shared, frozen baseline. Reducers copy, so it is never mutated. */
export const EMPTY_STATE: WayState = Object.freeze({
  version: 1,
  daily: null,
  deep: null,
  records: Object.freeze({})
});
