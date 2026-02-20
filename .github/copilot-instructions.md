# Copilot Instructions for denovibe

## Project Overview

**denovibe** is a Deno 2 HTTP server and DevOps boilerplate template. It provides a
production-ready starting point for building HTTP APIs with Deno, including a built-in MCP
(Model Context Protocol) server for Copilot tool use, GitHub Actions CI/CD, and a set of
reusable Copilot skills.

---

## Tech Stack

| Concern      | Tool / Library                                    |
| ------------ | ------------------------------------------------- |
| Runtime      | **Deno 2.x** — NOT Node.js                        |
| Language     | **TypeScript** (strict mode)                      |
| HTTP         | `Deno.serve` / `jsr:@std/http`                    |
| Testing      | `Deno.test` + `jsr:@std/assert`                   |
| Import style | `jsr:` and `https://` URLs — **no npm: prefixes** |
| Build step   | **None** — Deno runs TypeScript natively          |

---

## Coding Conventions

### Imports
- Use `jsr:@std/*` for all standard library imports (e.g., `jsr:@std/assert`, `jsr:@std/path`).
- Map short specifiers in `deno.json` `imports` map; reference them as bare specifiers in source.
- Never use `require()`, CommonJS, or `npm:` unless a package has no JSR/HTTPS equivalent.
- Never use `import type` for value imports.

### Variables & Types
- Use `const` over `let`; never use `var`.
- No `any` — use `unknown` and narrow with `instanceof` / type guards, or define proper types.
- Explicit return types on all exported / public functions.

### Style
- `async/await` over raw Promises.
- Prefer named exports over default exports.
- File naming: `snake_case` for files, `PascalCase` for classes.
- Test files: `*_test.ts` co-located with the source file they test.
- Line width: 100 characters. Indent: 2 spaces. Quotes: single.

### Error Handling
Always type-narrow errors before accessing properties:

```ts
try {
  // ...
} catch (err) {
  if (err instanceof Error) {
    console.error(err.message);
  }
}
```

---

## Deno-Specific Patterns

### HTTP Server
```ts
Deno.serve({ port: 8000 }, handler);
// or
Deno.serve({ port: Number(Deno.env.get('PORT') ?? '8000') }, handler);
```

### Environment Variables
```ts
// ✅ correct
const apiKey = Deno.env.get('API_KEY');

// ❌ never
const apiKey = process.env.API_KEY;
```

### File I/O
```ts
const text = await Deno.readTextFile('./data.json');
await Deno.writeTextFile('./out.json', JSON.stringify(data));
```

### Permissions
Always declare permissions explicitly in `deno.json` tasks rather than using `--allow-all`.
Example: `--allow-net --allow-read --allow-env`.

### Standard Library Modules
| Need            | Import                          |
| --------------- | ------------------------------- |
| Path utilities  | `jsr:@std/path`                 |
| Terminal colors | `jsr:@std/fmt/colors`           |
| Assertions      | `jsr:@std/assert`               |
| HTTP utilities  | `jsr:@std/http`                 |

---

## Testing

- All tests use `Deno.test` with `jsr:@std/assert` assertions.
- Test files are named `*_test.ts` and live next to their source file.
- Run tests with `deno task test`.
- Coverage: `deno test --coverage=coverage/`.
- Never suggest Jest, Mocha, Vitest, or any Node test runner.

```ts
import { assertEquals } from '@std/assert';

Deno.test('handler returns 200', async () => {
  const resp = await handler(new Request('http://localhost/health'));
  assertEquals(resp.status, 200);
});
```

---

## GitHub Actions & CI

- All workflows install Deno via `denoland/setup-deno@v2`.
- Cache key is based on the hash of `deno.lock`.
- CI step order: **fmt check → lint → type check → test**.
- Use `deno fmt --check` (not `--write`) in CI.
- Coverage artifact upload uses `deno test --coverage=coverage/`.

---

## MCP Server (`src/mcp/`)

The `src/mcp/` directory implements a Model Context Protocol server for Copilot tool use.

- **Tools exposed**: `run_tests`, `lint`, `fmt`, `type_check`, `get_routes`.
- Use `Deno.Command` (not `Deno.run`) to spawn subprocesses:

```ts
const cmd = new Deno.Command('deno', { args: ['task', 'test'] });
const { stdout, stderr } = await cmd.output();
```

- Always return structured JSON results from tool handlers.
- Permissions needed: `--allow-run=deno --allow-read --allow-net`.

---

## Agent Skills (`.github/skills/`)

- Skill definitions live in `.github/skills/` as YAML files.
- Each skill maps to a `deno task` or a GitHub Actions workflow dispatch.
- Skills can be invoked by Copilot during coding sessions to run checks, generate
  boilerplate, or trigger CI.
- Skill YAML fields: `name`, `description`, `triggers`, `action`.

---

## Repository Structure

```
denovibe/
├── src/
│   ├── main.ts            # Entry point — starts Deno.serve
│   ├── router.ts          # HTTP router / request handler
│   ├── router_test.ts     # Tests co-located with router
│   └── mcp/               # MCP server for Copilot tool use
├── .github/
│   ├── copilot-instructions.md   # This file
│   ├── copilot-setup-steps.md    # Workspace setup guide
│   ├── skills/            # Copilot skill definitions (YAML)
│   ├── workflows/         # GitHub Actions CI/CD
│   ├── ISSUE_TEMPLATE/    # Issue templates
│   ├── CODEOWNERS         # Code ownership
│   ├── dependabot.yml     # Dependency update config
│   └── pull_request_template.md
├── .vscode/
│   ├── settings.json      # Deno-optimised VS Code settings
│   └── extensions.json    # Recommended extensions
├── deno.json              # Tasks, import map, fmt/lint config
├── deno.lock              # Lockfile (commit this)
├── .env.example           # Example environment variables
└── README.md
```

---

## What NOT To Do

| ❌ Never                              | ✅ Instead                          |
| ------------------------------------- | ----------------------------------- |
| `require('module')`                   | `import { x } from 'jsr:...'`      |
| `process.env.FOO`                     | `Deno.env.get('FOO')`               |
| `package.json` / `node_modules/`      | `deno.json` import map              |
| `npm install` / `yarn add`            | Add to `deno.json` imports          |
| `npm:` prefix (unless no alternative) | `jsr:` or `https://` URL            |
| `ts-node` / `tsx`                     | `deno run file.ts`                  |
| Jest / Mocha / Vitest                 | `Deno.test` + `jsr:@std/assert`     |
| `--allow-all` in production tasks     | Explicit permission flags           |
| `any` type                            | `unknown` + type narrowing          |
| `var`                                 | `const` (or `let` if reassignment)  |
| Default exports                       | Named exports                       |
