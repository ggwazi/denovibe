/** Result returned by every skill handler. */
export interface SkillResult {
  success: boolean;
  output: string;
  exitCode: number;
}

/** Low-level helper: run a command and collect stdout + stderr. */
export async function runCommand(
  cmd: string[],
  env?: Record<string, string>,
): Promise<SkillResult> {
  const proc = new Deno.Command(cmd[0], {
    args: cmd.slice(1),
    stdout: 'piped',
    stderr: 'piped',
    env: env ? { ...Deno.env.toObject(), ...env } : undefined,
  });

  const { code, stdout, stderr } = await proc.output();
  const decoder = new TextDecoder();
  const output = decoder.decode(stdout) + decoder.decode(stderr);

  return { success: code === 0, output: output.trimEnd(), exitCode: code };
}

/**
 * Run `deno task test` with optional name filter and coverage collection.
 */
export async function test(filter?: string, coverage?: boolean): Promise<SkillResult> {
  const cmd = ['deno', 'task', 'test'];
  if (coverage) cmd.push('--coverage=coverage/');
  if (filter) cmd.push('--filter', filter);
  return runCommand(cmd);
}

/**
 * Run `deno lint` and optionally `deno fmt` to auto-fix formatting.
 */
export async function lint(fix?: boolean): Promise<SkillResult> {
  const lintResult = await runCommand(['deno', 'task', 'lint']);
  if (!fix || !lintResult.success) return lintResult;

  const fmtResult = await runCommand(['deno', 'fmt']);
  return {
    success: fmtResult.success,
    output: [lintResult.output, fmtResult.output].filter(Boolean).join('\n'),
    exitCode: fmtResult.exitCode,
  };
}

/**
 * Run `deno fmt` or `deno fmt --check` (check-only mode).
 */
export async function fmt(check?: boolean): Promise<SkillResult> {
  const cmd = check ? ['deno', 'fmt', '--check'] : ['deno', 'task', 'fmt'];
  return runCommand(cmd);
}

/**
 * Run `deno task check` (type-check the project).
 */
export async function typeCheck(): Promise<SkillResult> {
  return runCommand(['deno', 'task', 'check']);
}

const SEMVER_RE = /^v?(\d+\.\d+\.\d+(?:[-+].+)?)$/;

/**
 * Validate semver, create an annotated git tag, and trigger the release
 * workflow via `gh workflow run`.
 */
export async function release(version: string, prerelease?: boolean): Promise<SkillResult> {
  const match = version.match(SEMVER_RE);
  if (!match) {
    return {
      success: false,
      output: `Invalid semver version: "${version}". Expected format: 1.2.3 or v1.2.3`,
      exitCode: 1,
    };
  }

  const tag = `v${match[1]}`;

  const tagResult = await runCommand(['git', 'tag', '-a', tag, '-m', `Release ${tag}`]);
  if (!tagResult.success) return tagResult;

  const pushResult = await runCommand(['git', 'push', 'origin', tag]);
  if (!pushResult.success) {
    return {
      success: false,
      output: [tagResult.output, pushResult.output].filter(Boolean).join('\n'),
      exitCode: pushResult.exitCode,
    };
  }

  const ghArgs = [
    'gh', 'workflow', 'run', 'release.yml',
    '--field', `version=${tag}`,
  ];
  if (prerelease) ghArgs.push('--field', 'prerelease=true');

  const ghResult = await runCommand(ghArgs);
  return {
    success: ghResult.success,
    output: [tagResult.output, pushResult.output, ghResult.output].filter(Boolean).join('\n'),
    exitCode: ghResult.exitCode,
  };
}
