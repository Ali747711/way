import { describe, expect, it } from 'vitest';

import { reportIssueUrl, REPO_URL, resolveRepoUrl } from '@/lib/config';

describe('config', () => {
  it('builds an issue URL under the repo', () => {
    expect(reportIssueUrl('w-001')).toBe(
      `${REPO_URL}/issues/new?title=Problem%20w-001`
    );
  });

  it('encodes the problem id', () => {
    expect(reportIssueUrl('a b&c')).toContain('title=Problem%20a%20b%26c');
  });

  it('falls back when the env value is missing, empty or blank', () => {
    const fallback = 'https://github.com/Ali747711/way';
    expect(resolveRepoUrl(undefined)).toBe(fallback);
    expect(resolveRepoUrl('')).toBe(fallback);
    expect(resolveRepoUrl('   ')).toBe(fallback);
  });

  it('uses a configured value, trimmed', () => {
    expect(resolveRepoUrl(' https://github.com/me/way ')).toBe(
      'https://github.com/me/way'
    );
  });
});
