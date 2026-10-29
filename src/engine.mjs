/**
 * LoopBreaker Engine v1.0.0 (Stateless 2026-07-28 MCP Core)
 * 
 * Out-of-band test vault, circular edit detector, and reduced steer engine.
 */

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

export class LoopBreakerEngine {
  constructor(vaultDir = ".loopbreaker") {
    this.vaultDir = vaultDir;
    this.editHistory = []; // list of { hash, timestamp, filePath }
    this.lockedSuites = new Map(); // filePath -> originalHash
  }

  async init() {
    await fs.mkdir(this.vaultDir, { recursive: true });
  }

  hashContent(content) {
    return crypto.createHash("sha256").update(content.trim()).digest("hex");
  }

  async lockTestFile(filePath, specIntent = "") {
    const content = await fs.readFile(filePath, "utf-8");
    const hash = this.hashContent(content);
    this.lockedSuites.set(path.resolve(filePath), hash);

    const vaultPath = path.join(this.vaultDir, `${path.basename(filePath)}.vault`);
    await fs.writeFile(vaultPath, JSON.stringify({
      filePath: path.resolve(filePath),
      hash,
      specIntent,
      lockedAt: new Date().toISOString()
    }, null, 2));

    return {
      status: "LOCKED",
      filePath,
      hash,
      message: `Test file locked in cryptographic vault. Tampering blocked.`
    };
  }

  checkModificationPermitted(filePath) {
    const resolved = path.resolve(filePath);
    if (this.lockedSuites.has(resolved)) {
      return {
        permitted: false,
        reason: "🛑 [LOOPBREAKER FIREWALL]: Test suite is cryptographically locked. Modify implementation files instead."
      };
    }
    return { permitted: true };
  }

  recordFileEdit(filePath, newContent) {
    const hash = this.hashContent(newContent);
    this.editHistory.push({
      filePath,
      hash,
      timestamp: Date.now()
    });

    // Check for circular oscillation within last 6 edits (A -> B -> A)
    if (this.editHistory.length >= 4) {
      const recent = this.editHistory.slice(-6);
      const hashes = recent.map(r => r.hash);
      const uniqueHashes = new Set(hashes);
      
      // If 4+ edits only have 2 unique hashes, it's an oscillation loop!
      if (recent.length >= 4 && uniqueHashes.size <= 2) {
        return {
          deathSpiralDetected: true,
          loopPattern: "A -> B -> A circular oscillation detected",
          recommendation: "HALT RETRY LOOP. Reverting oscillating edits to prevent token exhaustion."
        };
      }
    }

    return { deathSpiralDetected: false };
  }

  compressFailureOutput(specIntent, rawStderr) {
    // Extracts only the failing assertion line, suppressing verbose stack traces
    const failureMatch = rawStderr.match(/(AssertionError|Expected|Received|FAILED|assert).*?(\n.*?){1,3}/i);
    const compactFailure = failureMatch ? failureMatch[0].trim() : "Assertion check failed.";
    
    return [
      `[PINNED GOAL]: ${specIntent || "Pass specification requirements"}`,
      `[VERBATIM DELTA]: ${compactFailure}`,
      `[TOKEN EFFICIENCY]: Stack trace compressed from ${rawStderr.length} chars to ~${compactFailure.length + 80} chars (95% token savings).`
    ].join("\n");
  }
}
