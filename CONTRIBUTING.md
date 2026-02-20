# Contributing to DenoVibe

Thank you for your interest in contributing! This guide will help you get started.

## Prerequisites

- [Deno](https://deno.land/) 2.x

## Development Setup

1. **Clone the repository:**
   ```sh
   git clone https://github.com/waz/denovibe.git
   cd denovibe
   ```

2. **Start the development server:**
   ```sh
   deno task dev
   ```

## Running Tests

```sh
deno task test
```

## Code Style

This project uses Deno's built-in formatter and linter.

**Format code:**
```sh
deno task fmt
```

**Lint code:**
```sh
deno task lint
```

Please ensure both pass before submitting a PR.

## Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <short summary>
```

**Types:**

| Type       | Description                                    |
|------------|------------------------------------------------|
| `feat`     | A new feature                                  |
| `fix`      | A bug fix                                      |
| `docs`     | Documentation changes only                     |
| `chore`    | Build process, tooling, or dependency updates  |
| `refactor` | Code change that is neither a fix nor feature  |
| `test`     | Adding or updating tests                       |
| `ci`       | CI/CD configuration changes                    |

**Examples:**
```
feat(auth): add JWT token refresh
fix(router): handle trailing slash correctly
docs: update contributing guide
```

## Branch Naming Conventions

| Prefix    | Use for                          |
|-----------|----------------------------------|
| `feat/`   | New features                     |
| `fix/`    | Bug fixes                        |
| `docs/`   | Documentation changes            |
| `chore/`  | Tooling, deps, or config changes |

**Example:** `feat/add-websocket-support`

## Pull Request Process

1. Fork the repository and create your branch from `main`.
2. Follow the branch naming conventions above.
3. Make your changes, ensuring tests and linting pass.
4. Open a PR against `main` and fill out the PR template.
5. A maintainer will review your PR. Please address any requested changes.
6. Once approved, your PR will be merged.

## Reporting Issues

Use the [GitHub issue templates](.github/ISSUE_TEMPLATE/) to report bugs or request features.
