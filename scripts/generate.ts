import fs from 'node:fs/promises';

import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateText, type LanguageModel } from 'ai';
import { z } from 'zod';

import { AREAS, AREA_CONFIG, DEEP_DIFFICULTY, type Area } from '@/lib/areas';
import { problemSchema, type Problem } from '@/lib/content/schema';
import {
  buildGenerationPrompt,
  draftSchema,
  idPrefixFor,
  nextId
} from '@/lib/pipeline/prompt';

import { extractDraftArray } from './lib/drafts';
import { problemPath, readProblemFiles, writeProblemFile } from './lib/files';
import {
  OPENROUTER_BASE_URL,
  resolveProvider,
  type ProviderChoice
} from './lib/provider';

const MAX_EXAMPLES = 3;
// A batch of 10 drafts runs to roughly 25k tokens; leave headroom so the
// reply is never cut off mid-array.
const MAX_OUTPUT_TOKENS = 48_000;
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
      'HTTP-Referer': 'https://github.com/Ali747711/way',
      'X-Title': 'Way'
    }
  })(provider.model);
};

/**
 * The draft schema goes into the prompt as text instead of a JSON-schema
 * response_format: Anthropic's structured outputs reject the `oneOf` that the
 * answer union produces ("Schema type 'oneOf' is not supported"), and through
 * OpenRouter that surfaced only as "Provider returned error".
 */
const schemaBlock = (): string =>
  [
    '## Schema',
    'Each problem in the array is one JSON object matching this JSON Schema:',
    '```json',
    JSON.stringify(z.toJSONSchema(draftSchema, { io: 'input' })),
    '```',
    'Reply with the JSON array only: start with [ and end with ], with no prose before or after it and no code fence.'
  ].join('\n');

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
  const basePrompt = buildGenerationPrompt({
    area,
    difficulty,
    count,
    examples,
    existingTitles: problems.filter((p) => p.area === area).map((p) => p.title),
    template: await loadTemplate(area, deep)
  });
  const prompt = `${basePrompt}\n\n${schemaBlock()}`;

  if (args.dryRun) {
    console.log(prompt);
    return 0;
  }

  if (provider.kind === 'none') return 1;
  console.log(`using ${provider.kind} ${provider.model}`);
  const { text, finishReason } = await generateText({
    model: buildModel(provider),
    maxOutputTokens: MAX_OUTPUT_TOKENS,
    prompt
  });
  if (finishReason === 'length') {
    console.error('the reply hit the output token limit and was cut off');
  }
  const elements = extractDraftArray(text);

  const ids = problems.map((p) => p.id);
  const prefix = idPrefixFor(area, difficulty);
  let written = 0;
  for (const [i, element] of elements.entries()) {
    const shape = draftSchema.safeParse(element);
    if (!shape.success) {
      const issue = shape.error.issues[0];
      console.error(
        `skipped draft ${i}: ${issue.path.join('.')} ${issue.message}`
      );
      continue;
    }
    const draft = shape.data;
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
