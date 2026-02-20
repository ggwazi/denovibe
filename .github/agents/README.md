# denovibe Copilot Agent

The **denovibe-agent** is a GitHub Copilot Extension agent for the denovibe project. It provides Copilot with structured, executable skills to run tests, lint, format, type-check, and release the project — both locally and via GitHub Actions.

---

## Available Skills

| Skill ID | Description |
|---|---|
| `deno-test` | Run the full test suite (`deno task test`) |
| `deno-lint` | Lint source code (`deno lint`) and optionally auto-format |
| `deno-fmt` | Format or check formatting (`deno fmt` / `deno fmt --check`) |
| `deno-check` | Type-check the project (`deno task check`) |
| `deno-release` | Validate semver, tag, push, and trigger the release workflow |
| `deno-deploy` | Start or deploy the server |

Skill definitions live in [`.github/skills/`](../skills/).

---

## Running Locally

Use `deno task agent` (or invoke `src/agent/main.ts` directly):

```bash
# Show help
deno task agent --help

# Run tests
deno task agent --skill deno-test

# Run tests with a name filter and collect coverage
deno task agent --skill deno-test --filter router --coverage

# Lint (check only)
deno task agent --skill deno-lint

# Lint and auto-format
deno task agent --skill deno-lint --fix

# Check formatting without modifying files
deno task agent --skill deno-fmt --check

# Type-check
deno task agent --skill deno-check

# Create a release (tags + triggers workflow)
deno task agent --skill deno-release --version 1.2.3
deno task agent --skill deno-release --version 1.2.3 --prerelease
```

Or invoke the entry point directly with explicit permissions:

```bash
deno run --allow-run --allow-env --allow-net --allow-read src/agent/main.ts --skill deno-test
```

---

## How Skills Connect to GitHub Actions

| Skill | Workflow |
|---|---|
| `deno-test`, `deno-lint`, `deno-fmt`, `deno-check` | [`ci.yml`](../workflows/ci.yml) |
| `deno-release` | [`release.yml`](../workflows/release.yml) |

The `deno-release` skill creates and pushes a semver git tag. The release workflow is triggered automatically by the `v*.*.*` tag push and also dispatched via `gh workflow run release.yml`.

---

## Agent Manifest

The agent is defined in [`denovibe-agent.yml`](./denovibe-agent.yml). Key fields:

- **`runtime: deno`** — the agent runs under Deno 2.
- **`entrypoint: src/agent/main.ts`** — CLI entry point.
- **`capabilities`** — `code_analysis`, `test_execution`, `workflow_dispatch`, `mcp_tools`.
- **`mcp_servers`** — points to [`.github/mcp.json`](../mcp.json) for MCP tool declarations.
- **`permissions`** — requests `contents:read`, `actions:write`, `issues:write`, `pull-requests:write`.

---

## MCP Server Integration

The MCP configuration at [`.github/mcp.json`](../mcp.json) exposes the agent's skills as MCP tools so that GitHub Copilot Chat can invoke them conversationally:

| MCP Tool | Maps To |
|---|---|
| `run_tests` | `deno-test` skill |
| `run_lint` | `deno-lint` skill |
| `run_fmt` | `deno-fmt` skill |
| `type_check` | `deno-check` skill |
| `create_release` | `deno-release` skill |

Example Copilot Chat prompt: _"Run the tests filtering for the router suite and collect coverage."_

---

## Project Structure

```
.github/
  agents/
    denovibe-agent.yml   ← agent manifest
    README.md            ← this file
  mcp.json               ← MCP tool declarations
  skills/
    deno-test.yml
    deno-lint.yml
    deno-release.yml
    deno-deploy.yml
src/
  agent/
    main.ts              ← CLI entry point
    skills.ts            ← skill handler implementations
    skills_test.ts       ← tests for skill handlers
```
