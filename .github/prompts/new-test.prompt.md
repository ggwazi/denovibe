---
mode: 'edit'
description: 'Write a Deno test for a function or module'
---

Write a Deno test for the following:

- Function/module: ${input:target:The function or module to test}
- Description: ${input:description:What behaviour to verify}

Follow these rules:

- Use `Deno.test('descriptive name', () => { ... })` for each test case
- Import assertions from `@std/assert` (e.g. `assertEquals`, `assertThrows`, `assertRejects`)
- Co-locate the test file as `<source>_test.ts` next to the source file
- Cover at minimum: happy path, error/rejection path, and at least one edge case
- Use descriptive test names that read as sentences (e.g. `'returns 404 for unknown route'`)
- Do not use `any` — type all variables explicitly
- Group related cases with a shared setup variable rather than repeating setup code
