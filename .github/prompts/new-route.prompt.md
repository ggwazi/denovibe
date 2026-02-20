---
mode: 'edit'
description: 'Add a new HTTP route to the Deno router'
---

Add a new HTTP route to `src/router.ts`.

Requirements:

- Method: ${input:method:GET,POST,PUT,DELETE,PATCH}
- Path: ${input:path:/api/}
- Description: ${input:description:What this route does}

Follow these rules:

- Use the existing if/else pattern in `src/router.ts`
- Return `Response` with appropriate `Content-Type` header
- For JSON responses use `JSON.stringify()` and `application/json`
- For errors use `new Response('message', { status: 4xx })`
- Add a corresponding test in `src/router_test.ts` using `Deno.test`
- Test must assert status code and Content-Type at minimum
