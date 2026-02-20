---
mode: 'edit'
description: 'Add a new MCP tool to the denovibe MCP server'
---

Add a new MCP tool to `src/mcp/server.ts`:

- Tool name: ${input:name:tool-name}
- Description: ${input:description:What this tool does}
- Parameters: ${input:parameters:JSON Schema properties for the tool input}

Implement across these locations:

**`src/mcp/server.ts` — TOOLS array**

```ts
{
  name: '<name>',
  description: '<description>',
  inputSchema: {
    type: 'object',
    properties: { /* parameters */ },
    required: [/* required param names */],
  },
}
```

**`src/mcp/server.ts` — handler function**

- Export an async function named `handle<ToolName>` (PascalCase)
- Accept a single typed `params` argument matching the inputSchema
- Return `ToolResult` — `{ content: [{ type: 'text', text: string }], isError?: boolean }`
- Use only Deno-native APIs; no Node.js globals

**`src/mcp/server.ts` — `callTool` switch**

- Add a `case '<name>':` branch that calls `handle<ToolName>`

**`src/mcp/server_test.ts`**

- Add `Deno.test` cases for: successful call (assert `isError` is falsy), invalid params (assert
  `isError` is true or error response)
