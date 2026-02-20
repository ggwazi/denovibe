---
mode: 'edit'
description: 'Add a new Copilot agent skill to denovibe'
---

Add a new Copilot skill with the following details:

- Skill name: ${input:name:skill-name}
- Description: ${input:description:What this skill does}
- Trigger phrases: ${input:triggers:Phrases that invoke this skill}
- Parameters: ${input:parameters:Parameters the skill accepts}

Implement across these files:

**`.github/skills/<name>.yml`**

- Define `id`, `name`, `description`, `triggers`, and `parameters` fields
- Match the format of existing skill YAMLs in `.github/skills/`

**`src/agent/skills.ts`**

- Export a new async handler function named after the skill in camelCase
- Return a `SkillResult` object with `{ success: boolean; output: string }`
- Use only Deno-native APIs; no Node.js globals

**`src/agent/main.ts`**

- Add the new skill id to the `SKILLS` const array
- Import and wire the handler into the `switch` dispatch block

**`src/agent/skills_test.ts`**

- Add `Deno.test` cases covering: successful execution, failure/error path
- Mock any external commands with a fake runner where needed
