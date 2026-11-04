export type Outcome =
  | { kind: 'solved' }
  | { kind: 'wrong'; attemptsLeft: number }
  | { kind: 'gave_up' }
  | { kind: 'failed' };
