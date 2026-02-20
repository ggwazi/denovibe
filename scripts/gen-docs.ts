#!/usr/bin/env -S deno run --allow-read --allow-write

/**
 * Reads docs/api.json (output of `deno doc --json`) and generates docs/API.md.
 * Usage: deno run --allow-read --allow-write scripts/gen-docs.ts
 */

interface DocParam {
  name: string;
  tsType?: { repr: string };
  optional?: boolean;
}

interface DocFunction {
  params?: DocParam[];
  returnType?: { repr: string };
}

interface DocNode {
  kind: string;
  name: string;
  jsDoc?: { doc?: string };
  functionDef?: DocFunction;
  classDef?: {
    methods?: Array<{ name: string; jsDoc?: { doc?: string }; functionDef?: DocFunction }>;
  };
  interfaceDef?: {
    properties?: Array<{ name: string; tsType?: { repr: string }; jsDoc?: { doc?: string } }>;
  };
}

const API_JSON = 'docs/api.json';
const API_MD = 'docs/API.md';

function formatParams(params: DocParam[] = []): string {
  if (params.length === 0) return '_none_';
  return params
    .map((p) => {
      const type = p.tsType?.repr ?? 'unknown';
      const opt = p.optional ? '?' : '';
      return `\`${p.name}${opt}: ${type}\``;
    })
    .join(', ');
}

function renderFunction(_name: string, doc: string | undefined, fn: DocFunction): string {
  const params = formatParams(fn.params);
  const ret = fn.returnType?.repr ?? 'void';
  const lines: string[] = [];
  if (doc) lines.push(`> ${doc.trim().replace(/\n/g, '\n> ')}`);
  lines.push('');
  lines.push(`**Parameters:** ${params}`);
  lines.push(`**Returns:** \`${ret}\``);
  return lines.join('\n');
}

async function main(): Promise<void> {
  let raw: string;
  try {
    raw = await Deno.readTextFile(API_JSON);
  } catch {
    console.error(`Could not read ${API_JSON}. Run: deno doc --json src/main.ts ... > ${API_JSON}`);
    Deno.exit(1);
  }

  let nodes: DocNode[] = [];
  try {
    const parsed = JSON.parse(raw);
    // deno doc --json returns an array at top level
    nodes = Array.isArray(parsed) ? parsed : (parsed.nodes ?? []);
  } catch {
    console.error('Failed to parse docs/api.json as JSON.');
    Deno.exit(1);
  }

  const sections: string[] = [
    '# API Reference',
    '',
    '> Auto-generated from source. Do not edit manually.',
    '',
  ];

  for (const node of nodes) {
    const doc = node.jsDoc?.doc;

    if (node.kind === 'function') {
      sections.push(`## \`${node.name}()\``);
      sections.push('');
      sections.push(renderFunction(node.name, doc, node.functionDef ?? {}));
      sections.push('');
    } else if (node.kind === 'class') {
      sections.push(`## Class \`${node.name}\``);
      sections.push('');
      if (doc) sections.push(`> ${doc.trim().replace(/\n/g, '\n> ')}`);
      sections.push('');
      const methods = node.classDef?.methods ?? [];
      if (methods.length > 0) {
        sections.push('### Methods');
        sections.push('');
        for (const method of methods) {
          sections.push(`#### \`${method.name}()\``);
          sections.push('');
          sections.push(renderFunction(method.name, method.jsDoc?.doc, method.functionDef ?? {}));
          sections.push('');
        }
      }
    } else if (node.kind === 'interface') {
      sections.push(`## Interface \`${node.name}\``);
      sections.push('');
      if (doc) sections.push(`> ${doc.trim().replace(/\n/g, '\n> ')}`);
      sections.push('');
      const props = node.interfaceDef?.properties ?? [];
      if (props.length > 0) {
        sections.push('| Property | Type | Description |');
        sections.push('|----------|------|-------------|');
        for (const prop of props) {
          const type = prop.tsType?.repr ?? 'unknown';
          const propDoc = prop.jsDoc?.doc?.trim() ?? '';
          sections.push(`| \`${prop.name}\` | \`${type}\` | ${propDoc} |`);
        }
        sections.push('');
      }
    }
  }

  if (nodes.length === 0) {
    sections.push('_No exported symbols found._');
    sections.push('');
  }

  await Deno.mkdir('docs', { recursive: true });
  await Deno.writeTextFile(API_MD, sections.join('\n'));
  console.log(`✅ Generated ${API_MD} (${nodes.length} nodes)`);
}

await main();
