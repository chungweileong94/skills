---
name: implement-review-loop
description: Implement a provided plan, issue, ticket, or well-scoped change, then repeatedly have a higher-capability independent subagent review the implementation and fix every valid finding until a fresh review reports no remaining issues. Use when the user asks for implementation with an iterative reviewer/fixer loop, exhaustive subagent review, or completion only after review approval.
---

# Implement Review Loop

Drive the requested change through implementation, independent review, remediation, and clean approval. Keep the primary agent responsible for the code and use a separate subagent as the reviewer.

## Establish the contract

1. Read the plan, issue, ticket, acceptance criteria, repository instructions, and relevant code.
2. Resolve ambiguity from repository context when safe. Ask the user only when a missing decision would materially change the requested result.
3. Define the verification commands and acceptance criteria before editing.
4. Inspect the working tree and preserve unrelated user changes.

## Implement

1. Implement the complete requested scope, including necessary tests and documentation.
2. Run the most relevant available checks. Fix failures caused by the implementation.
3. Review the diff for accidental edits, incomplete acceptance criteria, and security or compatibility regressions.
4. Do not begin the review loop while known implementation failures remain.

## Spawn an independent reviewer

After implementation and local verification, spawn a fresh review subagent with these constraints:

- Select the strongest available reviewer model or dedicated advisor/reviewer role. When model and reasoning controls are available, use a model more capable than the implementation model and a high reasoning effort. Do not silently substitute a weaker reviewer.
- Give the reviewer a clean, task-local brief: the original requirements and acceptance criteria, repository instructions, changed files or diff, and relevant test results.
- Ask the reviewer to inspect the actual repository state and run focused read-only checks when useful.
- Do not reveal the primary agent's conclusions, suspected defects, or desired verdict.
- Give the reviewer read-only ownership. The reviewer must report findings and must not edit files.
- Require findings to be actionable and evidence-based, with severity, file and line references when applicable, rationale, and a concrete correction.
- Require coverage of correctness, acceptance criteria, tests, error handling, security, regressions, maintainability, and repository conventions.
- Require exactly one terminal verdict: `CHANGES_REQUIRED` when any actionable issue remains, or `APPROVED` only when none remain. Suggestions that are genuinely optional must be labeled non-blocking and do not prevent approval.

Use a new reviewer subagent for every review pass when capacity permits. Otherwise reuse the reviewer only with a fresh brief based on the current repository state, without carrying forward the primary agent's defense of prior code.

## Fix every finding

When the verdict is `CHANGES_REQUIRED`:

1. Validate each finding against the requirements and code.
2. Fix every valid finding, regardless of severity. Add or update regression tests where appropriate.
3. If a finding is invalid or conflicts with the user's requirements, do not change behavior merely to appease the reviewer. Record concise evidence explaining why it is not actionable and include that evidence in the next review brief.
4. Run the relevant verification suite again and fix any resulting failures.
5. Inspect the complete updated diff, not only the latest patch.
6. Start another independent review pass. Never treat fixes or self-review as approval.

Repeat review and remediation until a fresh reviewer returns `APPROVED` and verification passes.

## Termination rules

- Finish only when all acceptance criteria are implemented, relevant checks pass, and the latest independent review verdict is `APPROVED` with no actionable findings.
- Never impose an arbitrary pass limit or downgrade unresolved findings to finish sooner.
- If the same disputed finding repeats, provide the reviewer with concrete requirement, code, or test evidence. If disagreement still cannot be resolved, ask the user for the missing product decision instead of claiming approval.
- If a stronger reviewer cannot be spawned, required verification cannot run, or an external dependency blocks progress, exhaust safe in-scope alternatives and report the blocker explicitly. Do not represent a blocked loop as complete.

## Report completion

Summarize the implemented change, verification performed, review passes completed, and significant findings fixed. Mention any non-blocking optional suggestions separately. Do not claim that no issues exist beyond the reviewed scope; state that the final independent pass found no remaining actionable issues.
