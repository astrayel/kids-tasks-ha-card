#!/usr/bin/env node
/**
 * Verify that every kids_tasks service the cards call actually exists.
 *
 * Three service names shipped for months without a matching backend service
 * (equip_cosmetic, adjust_points, adjust_coins). A typo here fails silently in
 * the browser console, so it is worth a check that runs in CI.
 *
 * The list of real services lives in tests/service-contract.json, regenerated
 * from the integration's services.yaml with `npm run sync:services`.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');
const CONTRACT = join(ROOT, 'tests', 'service-contract.json');

// callService('kids_tasks', 'name'  /  callService("kids_tasks", "name")
// Also matches the two-argument form used behind this.callService(...).
const CALL_RE = /callService\(\s*['"]kids_tasks['"]\s*,\s*['"]([a-z_]+)['"]/g;

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return walk(full);
    return full.endsWith('.js') ? [full] : [];
  });
}

function collectCalls() {
  const calls = [];
  for (const file of walk(SRC)) {
    const source = readFileSync(file, 'utf8');
    const lines = source.split('\n');
    lines.forEach((line, index) => {
      // Skip commented-out calls; they cannot fail at runtime.
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;
      for (const match of line.matchAll(CALL_RE)) {
        calls.push({
          service: match[1],
          file: relative(ROOT, file),
          line: index + 1,
        });
      }
    });
  }
  return calls;
}

const known = new Set(JSON.parse(readFileSync(CONTRACT, 'utf8')).services);
const calls = collectCalls();
const unknown = calls.filter((c) => !known.has(c.service));

if (calls.length === 0) {
  console.error('✗ No kids_tasks service calls found — is the regex still right?');
  process.exit(1);
}

if (unknown.length > 0) {
  console.error(`✗ ${unknown.length} unknown kids_tasks service(s) called:\n`);
  for (const { service, file, line } of unknown) {
    console.error(`   ${service}  →  ${file}:${line}`);
  }
  console.error('\n  Either the name is wrong, or the integration gained a new');
  console.error('  service and tests/service-contract.json needs regenerating:');
  console.error('    npm run sync:services\n');
  process.exit(1);
}

const distinct = [...new Set(calls.map((c) => c.service))].sort();
console.log(`✓ ${calls.length} service calls, ${distinct.length} distinct, all known:`);
console.log(`  ${distinct.join(', ')}`);
