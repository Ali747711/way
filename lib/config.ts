export const REPO_URL =
  process.env.NEXT_PUBLIC_REPO_URL ?? 'https://github.com/OWNER/way';

export const reportIssueUrl = (problemId: string): string =>
  `${REPO_URL}/issues/new?title=${encodeURIComponent(`Problem ${problemId}`)}`;
