import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { runCode } from './runCode';
import type { CaseResult, RunRequest } from './types';

class FakeWorker {
  onmessage: ((event: { data: CaseResult[] }) => void) | null = null;
  onerror: ((event: { message: string }) => void) | null = null;
  terminate = vi.fn();
  reply?: CaseResult[];
  postMessage = vi.fn(() => {
    if (this.reply) {
      setTimeout(
        () => this.onmessage?.({ data: this.reply as CaseResult[] }),
        0
      );
    }
  });
}

const req: RunRequest = {
  code: 'function f(n){return n}',
  entry: 'f',
  cases: [
    { input: [1], expected: 1 },
    { input: [2], expected: 3 }
  ]
};

describe('runCode', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('resolves the summarized result when the worker replies', async () => {
    const fake = new FakeWorker();
    fake.reply = [{ passed: true }, { passed: false, actual: 2 }];
    const promise = runCode(req, 1000, () => fake as unknown as Worker);
    await vi.advanceTimersByTimeAsync(0);
    const result = await promise;
    expect(fake.postMessage).toHaveBeenCalledWith(req);
    expect(result.passed).toBe(1);
    expect(result.total).toBe(2);
    expect(result.timedOut).toBe(false);
    expect(result.firstFailure?.index).toBe(1);
    expect(fake.terminate).toHaveBeenCalled();
  });

  it('resolves timedOut and terminates when no reply arrives', async () => {
    const fake = new FakeWorker();
    const promise = runCode(req, 1000, () => fake as unknown as Worker);
    await vi.advanceTimersByTimeAsync(1000);
    const result = await promise;
    expect(result).toEqual({ passed: 0, total: 2, timedOut: true });
    expect(fake.terminate).toHaveBeenCalled();
  });

  it('fails every case when the worker errors', async () => {
    const fake = new FakeWorker();
    const promise = runCode(req, 1000, () => fake as unknown as Worker);
    fake.onerror?.({ message: 'bad script' });
    const result = await promise;
    expect(result.passed).toBe(0);
    expect(result.total).toBe(2);
    expect(result.timedOut).toBe(false);
    expect(result.firstFailure?.error).toBe('bad script');
    expect(fake.terminate).toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('ignores a reply that arrives after the timeout', async () => {
    const fake = new FakeWorker();
    const promise = runCode(req, 1000, () => fake as unknown as Worker);
    await vi.advanceTimersByTimeAsync(1000);
    fake.onmessage?.({ data: [{ passed: true }, { passed: true }] });
    fake.onerror?.({ message: 'late' });
    const result = await promise;
    expect(result).toEqual({ passed: 0, total: 2, timedOut: true });
    expect(fake.terminate).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('resolves with failures when the factory throws', async () => {
    const result = await runCode(req, 1000, () => {
      throw new Error('no worker');
    });
    expect(result.passed).toBe(0);
    expect(result.total).toBe(2);
    expect(result.firstFailure?.error).toContain('no worker');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('resolves and cleans up when postMessage throws', async () => {
    const fake = new FakeWorker();
    fake.postMessage.mockImplementation(() => {
      throw new Error('DataCloneError');
    });
    const result = await runCode(req, 1000, () => fake as unknown as Worker);
    expect(result.firstFailure?.error).toContain('DataCloneError');
    expect(fake.terminate).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });
});
