import fs from 'node:fs/promises';
import path from 'node:path';

export default async function globalSetup(): Promise<void> {
  const src = path.join(process.cwd(), 'e2e', 'fixtures');
  const dest = path.join(process.cwd(), 'public', 'content');
  await fs.mkdir(dest, { recursive: true });
  await fs.cp(src, dest, { recursive: true });
}
