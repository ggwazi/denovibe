# Source Code — Copilot Instructions

## HTTP Router (`router.ts`)

- All routes follow the `if (req.method === 'X' && url.pathname === '/y')` pattern
- Always return `new Response(body, { status, headers })`
- JSON: `Content-Type: application/json`
- HTML: `Content-Type: text/html; charset=utf-8`
- Fallthrough at end: `return new Response('Not Found', { status: 404 })`

## Entry Point (`main.ts`)

- Reads `PORT` from env: `parseInt(Deno.env.get('PORT') ?? '8000')`
- Uses `Deno.serve({ port, handler })`

## Test Conventions

- File: `*_test.ts` co-located with source
- Import: `import { assertEquals } from '@std/assert'`
- Pattern: `Deno.test('description', async () => { ... })`
- Test each route: status code + Content-Type + body shape
