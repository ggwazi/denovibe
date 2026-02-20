# Agent CLI — Copilot Instructions

This directory is the Copilot agent CLI entry point.

## Adding a New Skill

1. Add skill ID to `SKILLS` const in `main.ts`
2. Export handler function in `skills.ts` returning `Promise<SkillResult>`
3. Add case to `dispatch()` switch in `main.ts`
4. Create `.github/skills/<id>.yml` YAML definition
5. Add tests in `skills_test.ts`

## SkillResult Contract

`{ success: boolean; output: string; exitCode: number }`

## Running a Skill Locally

`deno task agent --skill deno-test --coverage`

## Key Rules

- Never use `async` on functions that don't `await` inside
- Use `runCommand(cmd[])` for all subprocess execution
- Validate inputs before spawning subprocesses
