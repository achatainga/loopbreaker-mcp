---
name: loopbreaker
version: 1.0.0
description: "Out-of-band AST test grader, reward-hacking firewall & anti-death-spiral engine. Prevents AI coding agents from burning $15-$30 in circular debugging loops and mutating test assertions."
author: "Alejandro Chataing <a.chataing.a@gmail.com>"
license: "Commercial (Agensi.io Tier 1)"
price: "$29.00 USD"
marketplace: "https://www.agensi.io"
category: "Testing & Debugging / Developer Tools"
compatibility: "Claude Code, Cursor, Windsurf, Antigravity, Copilot, Amazon Q"
---

# LoopBreaker MCP v1.0.0 — Anti-Death-Spiral & Test-Tampering Firewall

> *"Never let a probabilistic model grade its own homework or alter its own test assertions."*

---

## ⚡ 1. MANDATE & OVERVIEW

LoopBreaker eliminates **Terminal Killer #1: The AI Coding Death Spiral & Reward Hacking**.

When an autonomous coding agent encounters a failing test, it often falls into an infinite fix-and-fail cycle (A $\rightarrow$ B $\rightarrow$ A), burning 30,000 to 100,000+ tokens ($15–$30+ in API credits). When desperate to declare success, agents cheat by:
- Modifying assertions (changing `assert total == 9000` to `assert total == 10000`).
- Adding `.skip` or `@pytest.mark.skip`.
- Overriding `__eq__` or `os._exit(0)`.
- Deleting test files or wiping `.env` with destructive `git reset --hard` / `git clean -fdx`.

LoopBreaker isolates the test suite in an **out-of-band read-only cryptographic vault**, detects semantic edit loops, and enforces a **Reduced Steer Protocol** that pins the user's original objective verbatim with only the failing assertion delta.

---

## 🛑 2. DETERMINISTIC HARNESS HOOKS (`hooks/hooks.json`)

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == 'edit_file' || tool == 'write_file'",
        "condition": "path.match(/\\.(test|spec)\\.[jt]sx?$/) || path.includes('conftest.py')",
        "action": "block",
        "exitCode": 2,
        "message": "🛑 [LOOPBREAKER FIREWALL]: Test suite is cryptographically locked during implementation phase. You are forbidden from modifying test assertions."
      },
      {
        "matcher": "tool == 'run_command'",
        "condition": "command.match(/git\\s+(reset\\s+--hard|clean\\s+-fdx)/)",
        "action": "block",
        "exitCode": 2,
        "message": "🛑 [LOOPBREAKER FIREWALL]: Destructive git reset/clean blocked. Use loopbreaker_safe_stash instead."
      }
    ],
    "PostToolUse": [
      {
        "matcher": "tool == 'edit_file' || tool == 'write_file'",
        "handler": "loopbreaker_detect_death_spiral"
      }
    ],
    "Stop": [
      {
        "handler": "loopbreaker_verify_held_out"
      }
    ]
  }
}
```

---

## 🛠️ 3. CORE MCP TOOLS

### `loopbreaker_lock_red_state`
- **Parameters:** `testFiles` (array of string paths), `specIntent` (string).
- **Behavior:** Runs the test suite to confirm it fails for the expected reason (Red phase). Snapshots assertion ASTs into an out-of-band SQLite vault and locks the test files to read-only.

### `loopbreaker_run_reduced_steer`
- **Parameters:** `targetSuite` (string).
- **Behavior:** Executes tests in a sandboxed runner, strips 10,000 lines of verbose stack traces, and delivers a compact 200-token packet: `[PINNED GOAL] + [VERBATIM ASSERTION DELTA]`. Prevents context window bloating.

### `loopbreaker_detect_death_spiral`
- **Parameters:** None.
- **Behavior:** Computes AST hashes of recent edits. If the agent oscillates between code states within the last 5 turns or fails 3 times on the identical stack trace, halts the retry loop, creates a safe Git stash, and alerts the developer.

### `loopbreaker_verify_held_out`
- **Parameters:** None.
- **Behavior:** Invokes shadow test assertions invisible to the agent's file reader to verify true generalization before task completion.

---

## 🚀 4. QUICKSTART COMMANDS

| Command | Action |
| :--- | :--- |
| `/loopbreaker lock <test-file>` | Lock test suite in read-only vault |
| `/loopbreaker steer` | Run test with 200-token Reduced Steer compression |
| `/loopbreaker audit` | Inspect session edit graph for circular loops |
