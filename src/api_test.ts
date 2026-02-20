import { assertEquals, assertMatch } from '@std/assert';
import { router } from './router.ts';

// Validate /health response matches OpenAPI HealthResponse schema
Deno.test('API /health matches OpenAPI schema', async () => {
  const req = new Request('http://localhost:8000/health');
  const res = router(req);
  assertEquals(res.status, 200);
  assertEquals(res.headers.get('content-type'), 'application/json');
  const body = await res.json();
  assertEquals(typeof body.status, 'string');
  assertEquals(body.status, 'ok');
  assertEquals(typeof body.version, 'string');
  assertMatch(body.version, /^\d+\.\d+\.\d+$/);
});

// Validate /api/info response matches OpenAPI InfoResponse schema
Deno.test('API /api/info matches OpenAPI schema', async () => {
  const req = new Request('http://localhost:8000/api/info');
  const res = router(req);
  assertEquals(res.status, 200);
  assertEquals(res.headers.get('content-type'), 'application/json');
  const body = await res.json();
  assertEquals(typeof body.name, 'string');
  assertEquals(typeof body.version, 'string');
  assertEquals(typeof body.deno, 'object');
  assertMatch(body.version, /^\d+\.\d+\.\d+$/);
});
