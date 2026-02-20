import { assertEquals, assertStringIncludes } from '@std/assert';
import {
  handleGetRoutes,
  handleRunFmt,
  handleRunLint,
  handleRunTask,
  handleTypeCheck,
} from './server.ts';

Deno.test('handleGetRoutes parses routes from router.ts', async () => {
  const result = await handleGetRoutes();
  assertEquals(result.isError, undefined);
  const routes = JSON.parse(result.content[0].text) as Array<{ method: string; path: string }>;
  assertEquals(Array.isArray(routes), true);
  assertEquals(routes.length, 3);
  assertEquals(routes[0], { method: 'GET', path: '/' });
  assertEquals(routes[1], { method: 'GET', path: '/health' });
  assertEquals(routes[2], { method: 'GET', path: '/api/info' });
});

Deno.test('handleRunFmt check mode returns formatted output', async () => {
  const result = await handleRunFmt({ check: true });
  assertEquals(result.content[0].type, 'text');
  assertStringIncludes(result.content[0].text, 'exit code:');
});

Deno.test('handleRunLint returns lint result', async () => {
  const result = await handleRunLint({});
  assertEquals(result.content[0].type, 'text');
  assertStringIncludes(result.content[0].text, 'Lint');
});

Deno.test('handleTypeCheck returns type check result', async () => {
  const result = await handleTypeCheck();
  assertEquals(result.content[0].type, 'text');
  assertStringIncludes(result.content[0].text, 'Type check');
});

Deno.test('handleRunTask with unknown task returns error', async () => {
  const result = await handleRunTask({ task: 'nonexistent-task-xyz' });
  assertEquals(result.isError, true);
  assertStringIncludes(result.content[0].text, 'exit code:');
});

Deno.test('handleRunTask passes extra args', async () => {
  const result = await handleRunTask({ task: 'fmt', args: ['--check'] });
  assertEquals(result.content[0].type, 'text');
  assertStringIncludes(result.content[0].text, 'exit code:');
});
