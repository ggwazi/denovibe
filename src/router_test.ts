import { assertEquals } from '@std/assert';
import { router } from './router.ts';

Deno.test('GET / returns HTML homepage', async () => {
  const req = new Request('http://localhost:8000/');
  const res = await router(req);
  assertEquals(res.status, 200);
  assertEquals(res.headers.get('content-type'), 'text/html; charset=utf-8');
  const body = await res.text();
  assertEquals(body.includes('denovibe'), true);
});

Deno.test('GET /health returns JSON with status ok', async () => {
  const req = new Request('http://localhost:8000/health');
  const res = await router(req);
  assertEquals(res.status, 200);
  assertEquals(res.headers.get('content-type'), 'application/json');
  const body = await res.json();
  assertEquals(body.status, 'ok');
  assertEquals(body.version, '0.1.0');
});

Deno.test('GET /api/info returns app info JSON', async () => {
  const req = new Request('http://localhost:8000/api/info');
  const res = await router(req);
  assertEquals(res.status, 200);
  assertEquals(res.headers.get('content-type'), 'application/json');
  const body = await res.json();
  assertEquals(body.name, '@denovibe/app');
  assertEquals(body.version, '0.1.0');
  assertEquals(typeof body.deno.version, 'string');
});

Deno.test('GET /unknown returns 404', async () => {
  const req = new Request('http://localhost:8000/unknown');
  const res = await router(req);
  assertEquals(res.status, 404);
  assertEquals(res.headers.get('content-type'), 'application/json');
  const body = await res.json();
  assertEquals(body.error, 'Not Found');
});
