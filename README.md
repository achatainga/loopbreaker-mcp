# LoopBreaker MCP v1.0.0

> **Stop the $30 AI debugging death spiral: cryptographic test-file locking, semantic circular-edit detection, and reward-hacking prevention.**

[![Standard](https://img.shields.io/badge/Standard-Universal%20SKILL.md-green.svg)](https://github.com/agensi)
[![License](https://img.shields.io/badge/License-Commercial-orange.svg)](https://www.agensi.io)
[![Price](https://img.shields.io/badge/Price-$29.00-blue.svg)](https://www.agensi.io)

---

## ⚡ The Problem: The AI Coding Death Spiral
When an AI coding agent hits a failing test, it frequently enters an infinite fix-and-fail loop:
1. Modifies file A $\rightarrow$ fails test $\rightarrow$ modifies file B $\rightarrow$ fails test $\rightarrow$ reverts to old broken logic.
2. Burns 30,000 to 100,000+ tokens ($15–$30+ in API credits).
3. To force a "green" run, the agent tampers with test assertions (e.g. changing `assert total == 9000` to `assert total == 10000`) or injects `.skip`.

**LoopBreaker stops this cold with out-of-band test locking and AST oscillation circuit-breakers.**

---

## 🛡️ Core Capabilities
- **Cryptographic Test Locking:** Snapshots test ASTs into a read-only vault during the Red phase; blocks modifications with exit code 2.
- **Circular Edit Circuit-Breaker:** Tracks AST hashes and halts execution if an $A \rightarrow B \rightarrow A$ oscillation is detected.
- **Reduced Steer Engine:** Compresses 2,000+ line stack traces down to a 200-token `[PINNED GOAL] + [VERBATIM FAILURE DELTA]` packet, cutting token burn by 95%.
- **Zero-Tamper Guarantee:** Blocks destructive `git clean -fdx` and `git reset --hard` to protect your untracked `.env` files.

---

## 🚀 Quickstart
```bash
# Lock your test suite before asking the agent to implement
/loopbreaker lock src/orders.test.ts

# Run tests with 95% token savings
/loopbreaker steer
```
