import { describe, expect, it } from 'vitest';

import {
  DEFAULT_ANTHROPIC_MODEL,
  DEFAULT_OPENROUTER_MODEL,
  resolveProvider
} from './provider';

describe('resolveProvider', () => {
  it('prefers openrouter when both keys are set', () => {
    expect(
      resolveProvider({ OPENROUTER_API_KEY: 'or', ANTHROPIC_API_KEY: 'an' })
    ).toEqual({
      kind: 'openrouter',
      apiKey: 'or',
      model: DEFAULT_OPENROUTER_MODEL
    });
  });

  it('uses anthropic when only its key is set', () => {
    expect(resolveProvider({ ANTHROPIC_API_KEY: 'an' })).toEqual({
      kind: 'anthropic',
      apiKey: 'an',
      model: DEFAULT_ANTHROPIC_MODEL
    });
  });

  it('lets GENERATE_MODEL override either default', () => {
    expect(
      resolveProvider({ OPENROUTER_API_KEY: 'or', GENERATE_MODEL: 'x/y' })
    ).toMatchObject({ kind: 'openrouter', model: 'x/y' });
    expect(
      resolveProvider({ ANTHROPIC_API_KEY: 'an', GENERATE_MODEL: 'z' })
    ).toMatchObject({ kind: 'anthropic', model: 'z' });
  });

  it('treats empty keys as unset', () => {
    expect(
      resolveProvider({ OPENROUTER_API_KEY: '', ANTHROPIC_API_KEY: 'an' })
    ).toMatchObject({ kind: 'anthropic' });
    expect(
      resolveProvider({ OPENROUTER_API_KEY: '', ANTHROPIC_API_KEY: '' })
    ).toMatchObject({ kind: 'none' });
  });

  it('returns the exact message when no key is set', () => {
    expect(resolveProvider({})).toEqual({
      kind: 'none',
      message: 'set OPENROUTER_API_KEY or ANTHROPIC_API_KEY in .env.local'
    });
  });
});
