# CW Skills

Reusable implementation and independent-review workflows for AI coding agents.

## Install

Choose one installation method for each host to avoid duplicate skill entries.

### Standalone skill

Install for the current project with the [Skills CLI](https://skills.sh/):

```bash
npx skills add chungweileong94/skills
```

### Codex plugin

```bash
codex plugin marketplace add chungweileong94/skills --ref main
codex plugin add cw-skills@chungwei
```

### Claude Code plugin

```text
/plugin marketplace add chungweileong94/skills
/plugin install cw-skills@chungwei
```

The plugin is named `cw-skills`; both marketplace manifests name the marketplace `chungwei`.

## Use

### Codex

```text
Use $implement-review-loop to implement @docs/plans/user-auth.md.
```

### Claude Code plugin

Plugin skills use the plugin namespace:

```text
/cw-skills:implement-review-loop Implement docs/plans/user-auth.md.
```

For a standalone Claude Code skill installation, use `/implement-review-loop` instead.

### Reviewer options

Optionally specify `reviewer model`, `reasoning`, and `mode` using values supported by your host. An unqualified `model` selects the reviewer, not the implementer. Unsupported explicit settings are reported rather than silently replaced.

Without an explicit model, the skill prefers the strongest available compatible configured reviewer or reviewer role; when ranking is unavailable, it uses the host's configured reviewer/default. The reviewer is a separate agent but may use the same model as the implementer. High reasoning effort is preferred where supported, and fast mode requires an explicit reviewer request.

## Workflow and compatibility

The shared skill keeps explicit implementation, verification, independent review, and remediation steps rather than relying on any particular model's default behavior. Every review pass covers the full scoped implementation. Every valid in-scope finding must be addressed, regardless of severity; unrelated issues and optional suggestions do not expand the task.

The host must support an actual independent review agent with access to the current work. Model selection, reasoning controls, fast mode, and session recovery depend on the host's available tools and configuration. This repository does not supply a reviewer runtime. The reviewer remains read-only, and an unavailable session may be resumed or replaced with a documented handoff, not replaced merely to obtain a different verdict.

Completion requires passing required checks and `APPROVED` for the current state. `CHANGES_REQUIRED` triggers remediation. `BLOCKED` reports an incomplete review; it never counts as approval. There is no arbitrary pass limit, but explicit user budgets and cancellation are respected.
