import fs from 'node:fs/promises';

export const WORDLIST_PATH = 'content/wordlist.txt';

/** The Words area's dictionary: one lowercase word per line. */
export const loadWords = async (
  file: string = WORDLIST_PATH
): Promise<Set<string>> => {
  const text = await fs.readFile(file, 'utf8');
  return new Set(
    text
      .split('\n')
      .map((line) => line.trim().toLowerCase())
      .filter((line) => line !== '')
  );
};
