import { build } from 'esbuild';

const main = async (): Promise<void> => {
  await build({
    entryPoints: ['lib/runner/worker.entry.ts'],
    bundle: true,
    format: 'iife',
    target: 'es2020',
    outfile: 'public/runner.worker.js',
    logLevel: 'info'
  });
};

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
