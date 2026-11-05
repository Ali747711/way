const FALLBACK_REPO_URL = 'https://github.com/Ali747711/way';

/** An empty or blank value (as in a stub `.env.local`) counts as unset. */
export const resolveRepoUrl = (value: string | undefined): string =>
  value?.trim() || FALLBACK_REPO_URL;

// The env access stays literal so Next inlines it at build time.
export const REPO_URL = resolveRepoUrl(process.env.NEXT_PUBLIC_REPO_URL);

export const reportIssueUrl = (problemId: string): string =>
  `${REPO_URL}/issues/new?title=${encodeURIComponent(`Problem ${problemId}`)}`;
