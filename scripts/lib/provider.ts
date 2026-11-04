export type ProviderChoice =
  | { kind: 'openrouter'; apiKey: string; model: string }
  | { kind: 'anthropic'; apiKey: string; model: string }
  | { kind: 'none'; message: string };

export const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
// Newest Sonnet on OpenRouter's public model list, looked up 2026-11-04.
export const DEFAULT_OPENROUTER_MODEL = 'anthropic/claude-sonnet-5.5';
export const DEFAULT_ANTHROPIC_MODEL = 'claude-sonnet-5-5';

/** Picks the generation provider from env; OpenRouter wins when both keys are set. */
export const resolveProvider = (
  env: Record<string, string | undefined>
): ProviderChoice => {
  if (env.OPENROUTER_API_KEY) {
    return {
      kind: 'openrouter',
      apiKey: env.OPENROUTER_API_KEY,
      model: env.GENERATE_MODEL || DEFAULT_OPENROUTER_MODEL
    };
  }
  if (env.ANTHROPIC_API_KEY) {
    return {
      kind: 'anthropic',
      apiKey: env.ANTHROPIC_API_KEY,
      model: env.GENERATE_MODEL || DEFAULT_ANTHROPIC_MODEL
    };
  }
  return {
    kind: 'none',
    message: 'set OPENROUTER_API_KEY or ANTHROPIC_API_KEY in .env.local'
  };
};
