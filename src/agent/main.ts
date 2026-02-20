#!/usr/bin/env -S deno run --allow-run --allow-env --allow-net --allow-read

import { parseArgs } from '@std/cli/parse-args';
import { fmt, lint, release, test, typeCheck } from './skills.ts';
import type { SkillResult } from './skills.ts';

const SKILLS = ['deno-test', 'deno-lint', 'deno-fmt', 'deno-check', 'deno-release'] as const;
type SkillId = (typeof SKILLS)[number];

function printHelp(): void {
  console.log(`
denovibe-agent — GitHub Copilot agent CLI

USAGE
  deno task agent --skill <skill-id> [options]
  deno task agent --help

SKILLS
  deno-test     Run the test suite
    --filter <pattern>   Filter tests by name
    --coverage           Collect coverage into coverage/

  deno-lint     Lint source code
    --fix                Also auto-format with deno fmt

  deno-fmt      Format source code
    --check              Check only (exit non-zero if unformatted)

  deno-check    Type-check the project

  deno-release  Create and push a versioned release
    --version <semver>   Version to release (required)
    --prerelease         Mark as pre-release

EXAMPLES
  deno task agent --skill deno-test
  deno task agent --skill deno-test --filter router --coverage
  deno task agent --skill deno-lint --fix
  deno task agent --skill deno-fmt --check
  deno task agent --skill deno-check
  deno task agent --skill deno-release --version 1.2.3
`.trimStart());
}

async function dispatch(skillId: SkillId, args: ReturnType<typeof parseArgs>): Promise<SkillResult> {
  switch (skillId) {
    case 'deno-test':
      return test(args['filter'] as string | undefined, args['coverage'] as boolean | undefined);

    case 'deno-lint':
      return lint(args['fix'] as boolean | undefined);

    case 'deno-fmt':
      return fmt(args['check'] as boolean | undefined);

    case 'deno-check':
      return typeCheck();

    case 'deno-release': {
      const version = args['version'] as string | undefined;
      if (!version) {
        return { success: false, output: 'Error: --version is required for deno-release', exitCode: 1 };
      }
      return release(version, args['prerelease'] as boolean | undefined);
    }
  }
}

const args = parseArgs(Deno.args, {
  string: ['skill', 'filter', 'version'],
  boolean: ['help', 'fix', 'check', 'coverage', 'prerelease'],
  alias: { h: 'help', s: 'skill' },
});

if (args['help'] || !args['skill']) {
  printHelp();
  Deno.exit(0);
}

const skillId = args['skill'] as string;
if (!(SKILLS as readonly string[]).includes(skillId)) {
  console.error(`Unknown skill: "${skillId}". Valid skills: ${SKILLS.join(', ')}`);
  Deno.exit(1);
}

const result = await dispatch(skillId as SkillId, args);
if (result.output) console.log(result.output);
Deno.exit(result.exitCode);
