# Copilot Workspace Setup Steps

This document describes how to set up a working development environment for **denovibe** inside a
Copilot Workspace session (or any fresh machine).

---

## Prerequisites

| Tool    | Version  | Install                                         |
| ------- | -------- | ----------------------------------------------- |
| Deno    | ≥ 2.0.0  | `curl -fsSL https://deno.land/install.sh \| sh` |
| Git     | any      | pre-installed in most environments              |

Verify Deno is available:

```sh
deno --version
# deno 2.x.x (release, ...)
```

> **Note:** This project does **not** use Node.js, npm, or any build toolchain.
> Do not run `npm install` or create a `package.json`.

---

## Setup

### 1. Clone the repository

```sh
git clone https://github.com/<org>/denovibe.git
cd denovibe
```

### 2. Copy environment variables

```sh
cp .env.example .env
# Edit .env and fill in any required values
```

### 3. Cache dependencies

Deno resolves and caches all imports on first run. Force a cache pass with:

```sh
deno install
```

This respects `deno.lock` and ensures reproducible dependency versions.

### 4. Verify the environment

Run the built-in check task to confirm everything is wired up:

```sh
deno task check
```

This runs `deno check src/main.ts` (TypeScript type checking, no emit).

---

## Daily Workflow

| Goal                        | Command               |
| --------------------------- | --------------------- |
| Start dev server (watch)    | `deno task dev`       |
| Run tests                   | `deno task test`      |
| Format code                 | `deno task fmt`       |
| Lint code                   | `deno task lint`      |
| Type-check only             | `deno task check`     |
| Start production server     | `deno task start`     |

---

## Running Tests

```sh
deno task test
# or with coverage:
deno test --coverage=coverage/ --allow-net --allow-read --allow-env
```

Test files follow the `*_test.ts` naming convention and are co-located with source files.

---

## Environment Variables

All configuration is passed through environment variables. Copy `.env.example` to `.env`
before running the server locally:

```sh
cp .env.example .env
```

| Variable   | Default | Description                         |
| ---------- | ------- | ----------------------------------- |
| `PORT`     | `8000`  | Port the HTTP server listens on     |
| `LOG_LEVEL`| `info`  | Logging verbosity (`debug`/`info`)  |

Access variables in code with `Deno.env.get('PORT')` — never `process.env`.

---

## VS Code

Install the recommended extensions when prompted (see `.vscode/extensions.json`).
The workspace settings in `.vscode/settings.json` enable the Deno language server,
format-on-save, and JSR import suggestions automatically.

---

## CI (GitHub Actions)

The CI pipeline runs automatically on pull requests:

1. `deno fmt --check`
2. `deno lint`
3. `deno check src/main.ts`
4. `deno task test`

All steps must pass before a PR can be merged.
