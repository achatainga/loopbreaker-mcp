#!/usr/bin/env node
import { LoopBreakerEngine } from '../src/engine.mjs';

const engine = new LoopBreakerEngine();
await engine.init();
console.log(JSON.stringify({ status: 'ACTIVE', message: 'LoopBreaker anti-death-spiral sentinel ready.' }, null, 2));
