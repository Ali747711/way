/// <reference lib="webworker" />
import { evaluate } from './evaluate';
import type { RunRequest } from './types';

declare const self: DedicatedWorkerGlobalScope;

// User code must not reach the network; stub before any handler is set.
const g = self as unknown as Record<string, unknown>;
g.fetch = undefined;
g.XMLHttpRequest = undefined;
g.WebSocket = undefined;
g.importScripts = undefined;

self.onmessage = (e: MessageEvent<RunRequest>) => {
  self.postMessage(evaluate(e.data));
};
