import { summarize, timedOutResult } from './summarize';
import type { CaseResult, RunRequest, RunResult } from './types';

export type WorkerFactory = () => Worker;

const defaultFactory: WorkerFactory = () => new Worker('/runner.worker.js');

export const runCode = (
  req: RunRequest,
  timeLimitMs: number,
  createWorker: WorkerFactory = defaultFactory
): Promise<RunResult> =>
  new Promise<RunResult>((resolve) => {
    const worker = createWorker();
    const finish = (result: RunResult) => {
      clearTimeout(timer);
      worker.terminate();
      resolve(result);
    };

    worker.onmessage = (event: MessageEvent<CaseResult[]>) =>
      finish(summarize(req.cases, event.data));
    worker.onerror = (event: ErrorEvent) => {
      const failed = req.cases.map(() => ({
        passed: false,
        error: event.message
      }));
      finish(summarize(req.cases, failed));
    };
    const timer = setTimeout(
      () => finish(timedOutResult(req.cases.length)),
      timeLimitMs
    );
    worker.postMessage(req);
  });
