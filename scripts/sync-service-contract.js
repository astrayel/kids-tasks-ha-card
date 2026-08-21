#!/usr/bin/env node
/**
 * Regenerate tests/service-contract.json from the integration's services.yaml.
 *
 * Usage:
 *   npm run sync:services                      # looks for ../kids-tasks-ha
 *   npm run sync:services -- /path/to/repo     # or point at it explicitly
 *
 * Only top-level keys are read, which is all a service name is in that file —
 * no YAML parser needed.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RELATIVE_YAML = join('custom_components', 'kids_tasks', 'services.yaml');

const explicit = process.argv[2];
const candidates = explicit
  ? [join(explicit, RELATIVE_YAML), explicit]
  : [join(ROOT, '..', 'kids-tasks-ha', RELATIVE_YAML)];

const yamlPath = candidates.find((p) => existsSync(p) && p.endsWith('.yaml'));

if (!yamlPath) {
  console.error('✗ services.yaml not found. Looked in:');
  candidates.forEach((p) => console.error(`   ${p}`));
  console.error('\n  Clone the integration next to this repo, or pass its path:');
  console.error('    npm run sync:services -- /path/to/kids-tasks-ha\n');
  process.exit(1);
}

const services = [
  ...new Set(
    readFileSync(yamlPath, 'utf8')
      .split('\n')
      .map((line) => line.match(/^([a-z_]+):\s*$/))
      .filter(Boolean)
      .map((m) => m[1])
  ),
].sort();

if (services.length === 0) {
  console.error(`✗ No service names found in ${yamlPath}`);
  process.exit(1);
}

const output = {
  _comment:
    'Services exposed by the kids_tasks integration. Regenerate with `npm run sync:services` when the integration\'s services.yaml changes.',
  _source:
    'https://github.com/astrayel/kids-tasks-ha — custom_components/kids_tasks/services.yaml',
  _generated: new Date().toISOString().slice(0, 10),
  services,
};

writeFileSync(
  join(ROOT, 'tests', 'service-contract.json'),
  `${JSON.stringify(output, null, 2)}\n`
);

console.log(`✓ ${services.length} services written from ${yamlPath}`);
