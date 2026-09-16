---
name: implement-review-loop
description: Use when the user requests an implementation-review-fix loop with an independent reviewer, or requires review approval before completion. Not for standalone reviews or ordinary implementation requests.
---

# Implement Review Loop

Implement the requested scope, obtain independent review, and fix valid findings until approval and required verification pass. The primary agent owns edits; a separate read-only subagent owns review.

## Reviewer configuration

Accept optional reviewer model, reasoning effort, and mode settings. An unqualified `model` refers to the reviewer, not the primary agent.

Before editing, check that the host can provide an independent reviewer with the required settings. Attempt safe supported recovery or report a blocker before implementation if it cannot. Honor each supported user-specified option unchanged on every pass; do not silently substitute unsupported explicit options or invent settings.

For unspecified options, choose the strongest available compatible configured reviewer model or dedicated reviewer role, with high reasoning effort where supported. Use the host's configured reviewer/default when a capability ranking is unavailable rather than guessing. A separate reviewer may use the same model as the implementer; it need not be stronger.

Where the host offers fast mode, use standard mode unless the user explicitly requests fast mode for the reviewer. Urgency alone is not that request. Mode and model selection are separate choices. Choosing a reviewer does not change the primary agent's model.

## Establish the contract

1. Read the task, acceptance criteria, repository instructions, and relevant code. Resolve ambiguity from context where safe; ask only for missing decisions that materially affect the result.
2. Define the implementation scope and required verification commands before editing.
3. Record the starting repository state, including staged, unstaged, and untracked changes. Distinguish task-owned edits from pre-existing work and preserve unrelated user changes.

## Implement

1. Implement the complete requested scope, including necessary tests and documentation.
2. Run relevant checks and fix failures caused by the implementation. Do not claim a check passed unless it actually ran successfully.
3. Inspect the scoped diff for accidental edits and unmet acceptance criteria. Resolve known implementation failures before requesting review; handle unavailable required checks under [Completion and blockers](#completion-and-blockers).

## Independent review contract

After implementation and local verification, spawn a reviewer using the selected configuration. Give it this contract and a neutral task-local brief containing the original requirements, acceptance criteria, repository instructions, complete current scoped diff (including new files), and verification results. Include paths and a baseline that let it inspect the actual repository state. Do not suggest a diagnosis or desired verdict.

Require the reviewer to:

- Inspect the actual code and relevant surrounding code and tests. Remain read-only: report findings, do not edit files, and use only checks that do not modify the reviewed work.
- Review the entire scoped implementation on every pass, including areas untouched by the latest fix and newly introduced regressions. Do not merely confirm earlier fixes. Keep unchanged requirements and the complete diff accessible without repeatedly pasting context the reviewer still has.
- Cover correctness, acceptance criteria, tests, error handling, security, regressions, maintainability, and repository conventions. Findings need severity, file/line evidence where applicable, rationale, and a concrete correction.
- Treat only these as blocking code findings: unmet requirements, defects introduced or exposed by the change, or existing defects that prevent the requested behavior from working. Report unrelated existing issues and genuinely optional suggestions separately as non-blocking; do not demand unrelated refactoring.

Return exactly one terminal verdict:

- `APPROVED`: the full scoped review is complete and no actionable in-scope findings remain; explicitly state `clean`.
- `CHANGES_REQUIRED`: actionable in-scope findings remain and the reviewer was able to complete the review.
- `BLOCKED`: essential access, context, evidence, or capability is missing, so review cannot be completed. Identify the blocker and include any findings already established. An incomplete review is never approval.

## Remediate and repeat

When the verdict is `CHANGES_REQUIRED`:

1. Validate each finding against the requirements and code. Fix every valid in-scope finding regardless of severity, adding regression tests where appropriate.
2. For invalid or conflicting findings, record concise requirement, code, or test evidence for the next review. Do not change behavior merely to appease the reviewer.
3. Rerun relevant verification, including checks affected by the fixes, and resolve resulting implementation failures.
4. Inspect the complete updated scoped diff and provide the current state, verification results, and finding dispositions to the reviewer for another full review. Approval of an earlier state, self-review, or simply applying fixes is not approval of the current state.

Reuse the same reviewer while its session remains usable. If unavailable, resume it or create a replacement with the same supported configuration. Hand over the requirements, baseline, current scoped diff, verification results, unresolved findings, and disputed-finding evidence; disclose the replacement. The replacement must complete a full current-state review. Do not replace a functioning reviewer to seek a different verdict.

## Completion and blockers

Complete only when all acceptance criteria are implemented, required checks pass, and the latest independent review approves the current state. Continue review and remediation without an arbitrary pass limit; never downgrade unresolved findings to finish sooner.

For a blocked review, unavailable independent reviewer, required check that cannot run, or external dependency failure, attempt safe in-scope recovery first. Respect explicit user budgets and cancellation. If progress remains blocked, report the incomplete work and what is needed to proceed; do not substitute self-review for independent approval.

Resolve repeated disputed findings with concrete evidence. Ask the user for genuinely missing product decisions; report unresolved technical disagreement as a blocker rather than claiming approval or inventing a product question.

## Report the result

Summarize the implemented scope, checks actually run and their results, review passes and final verdict, significant findings fixed, and any reviewer replacement. Separate optional suggestions and unrelated issues from blockers. On success, state only that the final independent pass found no remaining actionable in-scope issues, not that the software has no bugs.
