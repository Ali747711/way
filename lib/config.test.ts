import { describe, expect, it } from 'vitest';

import { reportIssueUrl, REPO_URL } from '@/lib/config';

describe('config', () => {
  it('builds an issue URL under the repo', () => {
    expect(reportIssueUrl('w-001')).toBe(
      `${REPO_URL}/issues/new?title=Problem%20w-001`
    );
  });

  it('encodes the problem id', () => {
    expect(reportIssueUrl('a b&c')).toContain('title=Problem%20a%20b%26c');
  });
});
