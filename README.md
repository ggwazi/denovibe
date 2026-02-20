# denovibe

![CI](https://github.com/OWNER/REPO/actions/workflows/ci.yml/badge.svg)
![Deno](https://img.shields.io/badge/deno-2.x-black?logo=deno)
![License](https://img.shields.io/badge/license-MIT-blue)
![CodeQL](https://github.com/OWNER/REPO/actions/workflows/codeql.yml/badge.svg)

> A fully automated GitHub DevOps boilerplate template built with Deno 2

## Features

- ✅ **Automated CI/CD** — lint, format, type-check, and test on every push and pull request
- 🔒 **Security scanning** — CodeQL analysis on push and weekly schedule
- 🤖 **Dependency updates** — Dependabot keeps GitHub Actions dependencies current
- 🏷️ **Issue/PR management** — auto-labeling, stale bot, and auto-assign workflows
- 📝 **Conventional commits** — PR title linting enforces Conventional Commits format
- 🔖 **Auto-labeling** — labels applied automatically based on changed file paths

## Quick Start

```sh
git clone https://github.com/OWNER/REPO.git
cd denovibe
deno task dev
```

## Available Tasks

| Task    | Command          | Description                              |
| ------- | ---------------- | ---------------------------------------- |
| `start` | `deno task start` | Run the HTTP server                     |
| `dev`   | `deno task dev`   | Run with file watcher (hot reload)      |
| `test`  | `deno task test`  | Run all tests                           |
| `lint`  | `deno task lint`  | Lint source files                       |
| `fmt`   | `deno task fmt`   | Format source files                     |
| `check` | `deno task check` | Type-check without running              |

## Project Structure

```
denovibe/
├── src/
│   ├── main.ts          # Entry point — starts the HTTP server
│   ├── router.ts        # Request router
│   └── router_test.ts   # Router unit tests
├── .github/
│   ├── workflows/
│   │   ├── ci.yml           # Lint, format, type-check, test
│   │   ├── codeql.yml       # CodeQL security analysis
│   │   ├── release.yml      # Automated release workflow
│   │   ├── pr-check.yml     # PR title / conventional commit lint
│   │   ├── labeler.yml      # Auto-label PRs by changed paths
│   │   ├── stale.yml        # Mark stale issues and PRs
│   │   └── auto-assign.yml  # Auto-assign reviewers
│   ├── ISSUE_TEMPLATE/      # YAML issue forms
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── CODEOWNERS
│   ├── dependabot.yml
│   ├── SECURITY.md
│   └── SUPPORT.md
├── deno.json            # Tasks, lint, fmt, import map
├── deno.lock
├── LICENSE
└── README.md
```

## GitHub Actions Workflows

| Workflow | Trigger | Description |
| -------- | ------- | ----------- |
| **CI** | push, pull_request | Runs `deno lint`, `deno fmt --check`, `deno check`, and `deno test` |
| **CodeQL** | push, schedule | Static security analysis via GitHub CodeQL |
| **Release** | push to `main` | Creates versioned GitHub releases |
| **PR Check** | pull_request | Validates PR title conforms to Conventional Commits |
| **Labeler** | pull_request | Applies labels based on changed file paths |
| **Stale** | schedule | Closes stale issues/PRs after inactivity |
| **Auto-assign** | pull_request | Assigns reviewers automatically |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on submitting issues and pull requests.

## License

[MIT](LICENSE) © 2025 denovibe contributors
