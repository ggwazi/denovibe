# MCP Server — Copilot Instructions

This directory contains the Model Context Protocol (MCP) server.

## What MCP Is

JSON-RPC 2.0 over stdio. Clients send requests, server responds with tool results.

## Adding a New Tool

1. Add to `TOOLS` array in `server.ts` with `name`, `description`, `inputSchema`
2. Export a `handle<ToolName>(params)` function
3. Add case to `callTool()` switch
4. Add test in `server_test.ts`
5. Update `.github/mcp.json` tools list

## Key Patterns

- All handlers are `async function handle*(): Promise<ToolResult>`
- Use `runDeno(args)` for subprocess calls
- Return `{ content: [{ type: 'text', text: string }], isError?: boolean }`
- Never throw — return `isError: true` with error message

## Running Locally

`deno task mcp` — starts the MCP server on stdio
