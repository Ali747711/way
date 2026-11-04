import { summarize, timedOutResult } from './summarize';
import type { CaseResult, RunRequest, RunResult } from './types';

export type WorkerFactory = () => Worker;

const defaultFactory: WorkerFactory = () => new Worker('/runner.worker.js');

const allFailed = (req: RunRequest, message: string): RunResult =>
  summarize(
    req.cases,
    req.cases.map(() => ({ passed: false, error: message }))
  );

export const runCode = (
  req: RunRequest,
  timeLimitMs: number,
  createWorker: WorkerFactory = defaultFactory
): Promise<RunResult> =>
  new Promise<RunResult>((resolve) => {
    let settled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let worker: Worker | undefined;

    // Settles exactly once; late events are ignored and terminate runs once.
    const finish = (result: RunResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker?.terminate();
      resolve(result);
    };

    try {
      worker = createWorker();
      worker.onmessage = (event: MessageEvent<CaseResult[]>) =>
        finish(summarize(req.cases, event.data));
      worker.onerror = (event: ErrorEvent) =>
        finish(allFailed(req, event.message));
      timer = setTimeout(
        () => finish(timedOutResult(req.cases.length)),
        timeLimitMs
      );
      worker.postMessage(req);
    } catch (err) {
      finish(allFailed(req, String(err)));
    }
  });
