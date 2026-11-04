import fs from 'node:fs/promises';

import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateText, Output, type LanguageModel } from 'ai';

import { AREAS, AREA_CONFIG, DEEP_DIFFICULTY, type Area } from '@/lib/areas';
import { problemSchema, type Problem } from '@/lib/content/schema';
import {
  buildGenerationPrompt,
  draftSchema,
  idPrefixFor,
  nextId
} from '@/lib/pipeline/prompt';

import { problemPath, readProblemFiles, writeProblemFile } from './lib/files';
import {
  OPENROUTER_BASE_URL,
  resolveProvider,
  type ProviderChoice
} from './lib/provider';

const MAX_EXAMPLES = 3;
const USAGE =
  'usage: generate --area <area> --difficulty N --count N [--dry-run]';

/** A bad command line; only these print the usage line, runtime failures do not. */
class UsageError extends Error {}

interface Args {
  area: Area;
  difficulty: number;
  count: number;
  dryRun: boolean;
}

const flagValue = (argv: string[], flag: string): string | undefined => {
  const i = argv.indexOf(flag);
  return i === -1 ? undefined : argv[i + 1];
};

const parseArgs = (argv: string[]): Args => {
  const area = AREAS.find((a) => a === flagValue(argv, '--area'));
  const difficulty = Number(flagValue(argv, '--difficulty'));
  const count = Number(flagValue(argv, '--count'));
  if (!area) throw new UsageError(`--area must be one of ${AREAS.join(', ')}`);
  if (!Number.isInteger(difficulty) || difficulty < 1 || difficulty > 5) {
    throw new UsageError('--difficulty must be an integer from 1 to 5');
  }
  if (
    difficulty !== DEEP_DIFFICULTY &&
    !AREA_CONFIG[area].difficulty.includes(difficulty)
  ) {
    throw new UsageError(
      `difficulty ${difficulty} is outside the ${area} band (${AREA_CONFIG[area].difficulty.join(', ')}, or 5)`
    );
  }
  if (!Number.isInteger(count) || count < 1 || count > 20) {
    throw new UsageError('--count must be an integer from 1 to 20');
  }
  return { area, difficulty, count, dryRun: argv.includes('--dry-run') };
};

const loadTemplate = async (area: Area, deep: boolean): Promise<string> => {
  const read = (name: string) =>
    fs.readFile(new URL(`./prompts/${name}.md`, import.meta.url), 'utf8');
  const parts = [await read(area)];
  if (deep) parts.push(await read('deep'));
  return parts.join('\n\n');
};

const loadEnv = (): void => {
  try {
    process.loadEnvFile('.env.local');
  } catch {
    // A missing .env.local is fine; the key may come from the environment.
  }
};

const buildModel = (
  provider: Exclude<ProviderChoice, { kind: 'none' }>
): LanguageModel => {
  if (provider.kind === 'anthropic') {
    return createAnthropic({ apiKey: provider.apiKey })(provider.model);
  }
  return createOpenAICompatible({
    name: 'openrouter',
    baseURL: OPENROUTER_BASE_URL,
    apiKey: provider.apiKey,
    headers: {
      'HTTP-Referer': 'https://github.com/OWNER/way',
      'X-Title': 'Way'
    },
    // Makes Output.array send a JSON-schema response_format.
    supportsStructuredOutputs: true
  })(provider.model);
};

const main = async (): Promise<number> => {
  const args = parseArgs(process.argv.slice(2));
  const { area, difficulty, count } = args;
  const deep = difficulty === DEEP_DIFFICULTY;

  loadEnv();
  const provider = resolveProvider(process.env);
  if (!args.dryRun && provider.kind === 'none') {
    console.error(provider.message);
    return 1;
  }

  const files = await readProblemFiles();
  const problems = files.map(({ problem }) => problem);
  const examples = problems
    .filter(
      (p) =>
        p.area === area &&
        (p.difficulty === DEEP_DIFFICULTY) === deep &&
        (p.status === 'approved' || p.status === 'published')
    )
    .slice(0, MAX_EXAMPLES);
  const prompt = buildGenerationPrompt({
    area,
    difficulty,
    count,
    examples,
    existingTitles: problems.filter((p) => p.area === area).map((p) => p.title),
    template: await loadTemplate(area, deep)
  });

  if (args.dryRun) {
    console.log(prompt);
    return 0;
  }

  if (provider.kind === 'none') return 1;
  console.log(`using ${provider.kind} ${provider.model}`);
  const { output } = await generateText({
    model: buildModel(provider),
    output: Output.array({ element: draftSchema }),
    prompt
  });

  const ids = problems.map((p) => p.id);
  const prefix = idPrefixFor(area, difficulty);
  let written = 0;
  for (const draft of output) {
    const candidate: Problem = {
      ...draft,
      id: nextId(prefix, ids),
      status: 'draft',
      source: { kind: 'generated' },
      createdAt: new Date().toISOString()
    };
    const parsed = problemSchema.safeParse(candidate);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      console.error(
        `skipped ${draft.title}: ${issue.path.join('.')} ${issue.message}`
      );
      continue;
    }
    await writeProblemFile(problemPath(parsed.data), parsed.data);
    ids.push(parsed.data.id);
    written += 1;
    console.log(`wrote ${parsed.data.id}  ${parsed.data.title}`);
  }
  console.log(`wrote ${written} drafts`);
  return written === 0 ? 1 : 0;
};

main().then(
  (code) => process.exit(code),
  (error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    if (error instanceof UsageError) console.error(USAGE);
    process.exit(1);
  }
);
