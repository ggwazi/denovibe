---
mode: 'generate'
description: 'Write a pull request description from the current git diff'
---

Analyze the current git diff and write a pull request description.

Use exactly this format (matching `.github/pull_request_template.md`):

```markdown
## Description

<!-- concise summary of what the PR does and why -->

Closes #(issue number if applicable)

## Type of change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Documentation update
- [ ] Chore / refactor

## Testing

- [ ] Tests added or updated to cover the changes
- [ ] All existing tests pass (`deno task test`)
- [ ] Manual testing performed

## Checklist

- [ ] Code follows the project's style guidelines (`deno task fmt`, `deno task lint`)
- [ ] I have performed a self-review of my code
- [ ] Complex or non-obvious code has been commented
- [ ] Documentation has been updated where necessary
- [ ] No new warnings introduced
```

Rules:

- Tick the relevant "Type of change" checkbox(es) based on the diff
- Write the Description in conventional commit style: start with a verb in the imperative mood (e.g.
  "Add", "Fix", "Remove")
- Keep the Description to 3 sentences or fewer
- Do not include implementation details that are obvious from the diff
