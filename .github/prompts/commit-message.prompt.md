---
mode: 'generate'
description: 'Write a conventional git commit message from staged changes'
---

Analyze the staged changes (`git diff --cached`) and write a git commit message.

Format:

```
<type>(<scope>): <subject>

[optional body]
```

Rules:

- **type** must be one of: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`, `build`
- **scope** is the affected module or directory (e.g. `router`, `mcp`, `agent`, `deps`) — omit if
  the change is truly cross-cutting
- **subject**: imperative mood, lowercase, no trailing period, ≤ 72 characters total for the first
  line
- **body**: add only if the change is complex or non-obvious; explain _why_, not _what_; wrap at 72
  chars
- Do not reference issue numbers unless explicitly provided
- Do not add a sign-off or co-author trailer

Output only the raw commit message text — no markdown fences, no explanation.
