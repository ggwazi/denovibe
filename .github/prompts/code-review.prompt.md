---
mode: 'ask'
description: 'Review Deno TypeScript code for correctness and best practices'
---

Review the selected Deno TypeScript code and provide structured feedback.

Check for each of the following categories and report findings — skip categories with no issues:

**Deno anti-patterns**

- `process.env` used instead of `Deno.env.get()`
- `require()` used instead of ESM `import`
- `npm:` specifiers where `jsr:` or `deno.land/x` is available
- `var` declarations
- `any` type annotations
- Missing or incorrect permission flags in task definitions (`deno.json`)

**Test coverage**

- Exported functions or classes with no corresponding `_test.ts`
- Tests that only cover the happy path (missing error/edge cases)
- Assertions that are too broad (e.g. `assertExists` where `assertEquals` is possible)

**Error handling**

- `catch` blocks that silently swallow errors
- Unhandled promise rejections
- Missing input validation on public API boundaries

**Security / permissions**

- Unnecessarily broad permission flags (`--allow-all`)
- User-controlled input passed directly to `Deno.run` / `new Deno.Command`
- Secrets or tokens hardcoded in source

**Suggestions**

- For each finding: quote the relevant line(s), explain the issue, and provide a corrected snippet
- Prioritise findings as **critical**, **warning**, or **suggestion**
