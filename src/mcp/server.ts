// MCP (Model Context Protocol) server — JSON-RPC 2.0 over stdio

interface McpRequest {
  jsonrpc: '2.0';
  id: number | string | null;
  method: string;
  params?: unknown;
}

interface McpResponse {
  jsonrpc: '2.0';
  id: number | string | null;
  result?: unknown;
  error?: { code: number; message: string };
}

export interface ToolResult {
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
}

interface Route {
  method: string;
  path: string;
}

class McpError extends Error {
  constructor(
    public readonly code: number,
    message: string,
  ) {
    super(message);
    this.name = 'McpError';
  }
}

// ---------------------------------------------------------------------------
// Tool definitions (schema for MCP clients)
// ---------------------------------------------------------------------------

const TOOLS = [
  {
    name: 'run_tests',
    description: 'Run Deno tests using `deno task test`. Returns stdout, stderr, and exit code.',
    inputSchema: {
      type: 'object',
      properties: {
        filter: { type: 'string', description: 'Filter tests by name pattern' },
        coverage: { type: 'boolean', description: 'Enable coverage collection' },
      },
    },
  },
  {
    name: 'run_lint',
    description: 'Run Deno linter using `deno task lint`. Returns lint output and pass/fail status.',
    inputSchema: {
      type: 'object',
      properties: {
        fix: { type: 'boolean', description: 'Automatically fix lint errors' },
      },
    },
  },
  {
    name: 'run_fmt',
    description: 'Run Deno formatter. Use check=true to verify formatting without modifying files.',
    inputSchema: {
      type: 'object',
      properties: {
        check: { type: 'boolean', description: 'Check formatting without modifying files' },
      },
    },
  },
  {
    name: 'type_check',
    description: 'Run TypeScript type checking via `deno task check`. Returns type errors if any.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_routes',
    description: 'Parse src/router.ts and return all HTTP routes with their method and path.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'run_task',
    description: 'Run any Deno task by name with optional additional arguments.',
    inputSchema: {
      type: 'object',
      required: ['task'],
      properties: {
        task: { type: 'string', description: 'Deno task name to run' },
        args: {
          type: 'array',
          items: { type: 'string' },
          description: 'Additional arguments to pass to the task',
        },
      },
    },
  },
];

// ---------------------------------------------------------------------------
// Subprocess helpers
// ---------------------------------------------------------------------------

async function runDeno(
  args: string[],
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  const cmd = new Deno.Command('deno', { args, stdout: 'piped', stderr: 'piped' });
  const output = await cmd.output();
  const decoder = new TextDecoder();
  return {
    stdout: decoder.decode(output.stdout),
    stderr: decoder.decode(output.stderr),
    exitCode: output.code,
  };
}

function formatOutput(
  label: string,
  exitCode: number,
  stdout: string,
  stderr: string,
): string {
  const parts = [`${label} (exit code: ${exitCode})`];
  if (stdout.trim()) parts.push(`\nstdout:\n${stdout.trim()}`);
  if (stderr.trim()) parts.push(`\nstderr:\n${stderr.trim()}`);
  return parts.join('');
}

// ---------------------------------------------------------------------------
// Tool handlers (exported for testing)
// ---------------------------------------------------------------------------

export async function handleRunTests(
  params: { filter?: string; coverage?: boolean },
): Promise<ToolResult> {
  const args = ['task', 'test'];
  if (params.filter) args.push('--filter', params.filter);
  if (params.coverage) args.push('--coverage');
  const { stdout, stderr, exitCode } = await runDeno(args);
  return {
    content: [{ type: 'text', text: formatOutput('Tests', exitCode, stdout, stderr) }],
    isError: exitCode !== 0,
  };
}

export async function handleRunLint(params: { fix?: boolean }): Promise<ToolResult> {
  const args = params.fix ? ['lint', '--fix'] : ['task', 'lint'];
  const { stdout, stderr, exitCode } = await runDeno(args);
  const label = `Lint ${exitCode === 0 ? 'passed' : 'failed'}`;
  return {
    content: [{ type: 'text', text: formatOutput(label, exitCode, stdout, stderr) }],
    isError: exitCode !== 0,
  };
}

export async function handleRunFmt(params: { check?: boolean }): Promise<ToolResult> {
  const args = params.check ? ['fmt', '--check'] : ['task', 'fmt'];
  const { stdout, stderr, exitCode } = await runDeno(args);
  const label = params.check
    ? `Format check ${exitCode === 0 ? 'passed' : 'failed'}`
    : `Format ${exitCode === 0 ? 'complete' : 'failed'}`;
  return {
    content: [{ type: 'text', text: formatOutput(label, exitCode, stdout, stderr) }],
    isError: exitCode !== 0,
  };
}

export async function handleTypeCheck(): Promise<ToolResult> {
  const { stdout, stderr, exitCode } = await runDeno(['task', 'check']);
  const label = `Type check ${exitCode === 0 ? 'passed' : 'failed'}`;
  return {
    content: [{ type: 'text', text: formatOutput(label, exitCode, stdout, stderr) }],
    isError: exitCode !== 0,
  };
}

export async function handleGetRoutes(): Promise<ToolResult> {
  const routerPath = `${Deno.cwd()}/src/router.ts`;
  let source: string;
  try {
    source = await Deno.readTextFile(routerPath);
  } catch {
    return {
      content: [{ type: 'text', text: 'Error: Could not read src/router.ts' }],
      isError: true,
    };
  }

  const routes: Route[] = [];
  const pattern =
    /req\.method\s*===\s*['"](\w+)['"]\s*&&\s*url\.pathname\s*===\s*['"]([^'"]+)['"]/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(source)) !== null) {
    routes.push({ method: match[1], path: match[2] });
  }

  return {
    content: [{ type: 'text', text: JSON.stringify(routes, null, 2) }],
  };
}

export async function handleRunTask(
  params: { task: string; args?: string[] },
): Promise<ToolResult> {
  const args = ['task', params.task, ...(params.args ?? [])];
  const { stdout, stderr, exitCode } = await runDeno(args);
  return {
    content: [
      { type: 'text', text: formatOutput(`Task "${params.task}"`, exitCode, stdout, stderr) },
    ],
    isError: exitCode !== 0,
  };
}

// ---------------------------------------------------------------------------
// JSON-RPC dispatch
// ---------------------------------------------------------------------------

async function callTool(name: string, toolArgs: unknown): Promise<ToolResult> {
  const a = (toolArgs ?? {}) as Record<string, unknown>;
  switch (name) {
    case 'run_tests':
      return handleRunTests(a as { filter?: string; coverage?: boolean });
    case 'run_lint':
      return handleRunLint(a as { fix?: boolean });
    case 'run_fmt':
      return handleRunFmt(a as { check?: boolean });
    case 'type_check':
      return handleTypeCheck();
    case 'get_routes':
      return handleGetRoutes();
    case 'run_task':
      return handleRunTask(a as { task: string; args?: string[] });
    default:
      return { content: [{ type: 'text', text: `Unknown tool: ${name}` }], isError: true };
  }
}

async function dispatch(request: McpRequest): Promise<unknown> {
  switch (request.method) {
    case 'initialize':
      return {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'denovibe-tools', version: '0.1.0' },
      };
    case 'tools/list':
      return { tools: TOOLS };
    case 'tools/call': {
      const params = request.params as { name: string; arguments?: unknown };
      return callTool(params.name, params.arguments);
    }
    default:
      throw new McpError(-32601, `Method not found: ${request.method}`);
  }
}

// ---------------------------------------------------------------------------
// Stdio loop
// ---------------------------------------------------------------------------

async function* readLines(stream: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const decoder = new TextDecoder();
  let buffer = '';
  for await (const chunk of stream) {
    buffer += decoder.decode(chunk, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) yield line;
  }
  if (buffer) yield buffer;
}

export async function startServer(): Promise<void> {
  const encoder = new TextEncoder();

  async function send(response: McpResponse): Promise<void> {
    await Deno.stdout.write(encoder.encode(JSON.stringify(response) + '\n'));
  }

  for await (const line of readLines(Deno.stdin.readable)) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    let request: McpRequest;
    try {
      request = JSON.parse(trimmed) as McpRequest;
    } catch {
      await send({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } });
      continue;
    }

    // Notifications don't get a response
    if (request.method.startsWith('notifications/')) continue;

    try {
      const result = await dispatch(request);
      await send({ jsonrpc: '2.0', id: request.id, result });
    } catch (err) {
      const e = err instanceof McpError ? err : new McpError(-32603, String(err));
      await send({ jsonrpc: '2.0', id: request.id, error: { code: e.code, message: e.message } });
    }
  }
}

if (import.meta.main) {
  await startServer();
}
