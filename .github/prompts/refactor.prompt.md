---
mode: 'edit'
description: 'Refactor Deno TypeScript code for quality and maintainability'
---

Refactor the following file:

- File: ${input:file:Path to the file to refactor}
- Goal: ${input:goal:What to improve (e.g. type safety, readability, error handling)}

Apply these improvements — only where they genuinely improve the code:

1. **Constants**: extract magic strings, numbers, and repeated literals into named `const` values at
   the top of the file
2. **Return types**: add explicit return types to all exported functions and any non-trivial
   internal functions
3. **Type safety**: replace every `any` with a precise type or a well-named interface/type alias
4. **Variable declarations**: replace `let` with `const` wherever the binding is never reassigned
5. **Error handling**: replace bare `catch (e)` with typed guards; ensure errors are propagated or
   logged, never silently swallowed
6. **Readability**: break long functions (>40 lines) into focused single-responsibility helpers

Constraints:

- **Do not change any observable behaviour** — all existing tests must still pass
- **Do not add new dependencies**
- Preserve the existing public API (exported names and signatures)
- Leave comments that explain _why_, not _what_
