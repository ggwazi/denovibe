---
mode: 'ask'
description: 'Debug a Deno 2 / TypeScript error'
---

Analyze and explain the following error:

```
${input:error:Paste the full error message here}
```

In your response:

1. **Explain** what the error means in plain language within the Deno 2 runtime context
2. **Identify the root cause** — point to the likely file/line if inferable
3. **Suggest a concrete fix** with a code snippet
4. **Check for common Deno-specific pitfalls**:
   - Missing permission flags (`--allow-net`, `--allow-read`, `--allow-env`, etc.)
   - Using `process.env` instead of `Deno.env.get()`
   - Using `require()` instead of ESM `import`
   - Using `npm:` specifiers where a JSR (`jsr:`) or `deno.land/x` import is preferred
   - Top-level `await` outside a module context
   - Misconfigured `deno.json` import map entries
5. **List any follow-up steps** to prevent the same error in future
