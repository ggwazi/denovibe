// Benchmarks for the denovibe HTTP router
// Run with: deno bench --allow-net --allow-read --allow-env

import { router as handleRequest } from './router.ts';

const makeReq = (path: string) =>
  new Request(`http://localhost:8000${path}`, { method: 'GET' });

Deno.bench('GET / (homepage)', async () => {
  await handleRequest(makeReq('/'));
});

Deno.bench('GET /health (JSON)', async () => {
  await handleRequest(makeReq('/health'));
});

Deno.bench('GET /api/info (JSON)', async () => {
  await handleRequest(makeReq('/api/info'));
});

Deno.bench('GET /notfound (404)', async () => {
  await handleRequest(makeReq('/notfound'));
});
