#!/usr/bin/env node

import { readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

export const MANIFESTS = ['.codex-plugin/plugin.json', '.claude-plugin/plugin.json'];
const VERSION = /^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$/;

export function bumpVersions(root, part = 'patch', dryRun = false) {
  const index = ['major', 'minor', 'patch'].indexOf(part);
  if (index === -1) throw new Error('Choose patch, minor, or major');

  const manifests = MANIFESTS.map((relative) => {
    const path = resolve(root, relative);
    const data = JSON.parse(readFileSync(path, 'utf8'));
    const version = data?.version;
    if (typeof version !== 'string' || VERSION.exec(version)?.[0] !== version) {
      throw new Error(`${relative}: expected a version in MAJOR.MINOR.PATCH format`);
    }
    return { path, data };
  });

  const versions = new Set(manifests.map(({ data }) => data.version));
  if (versions.size !== 1) {
    throw new Error('Plugin versions differ; align them before bumping');
  }

  const [current] = versions;
  const numbers = current.split('.').map(BigInt);
  numbers[index] += 1n;
  numbers.fill(0n, index + 1);
  const updated = numbers.join('.');

  if (!dryRun) {
    for (const { path, data } of manifests) {
      data.version = updated;
      writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
    }
  }

  return { current, updated };
}

function main() {
  try {
    const { values, positionals } = parseArgs({
      options: {
        'dry-run': { type: 'boolean', default: false },
        help: { type: 'boolean', short: 'h' },
      },
      allowPositionals: true,
    });
    if (values.help) {
      console.log('Usage: node scripts/bump-version.mjs [patch|minor|major] [--dry-run]');
      return;
    }
    if (positionals.length > 1) throw new Error('Expected at most one bump type');

    const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
    const { current, updated } = bumpVersions(root, positionals[0], values['dry-run']);
    const action = values['dry-run'] ? 'Would bump' : 'Bumped';
    for (const manifest of MANIFESTS) {
      console.log(`${action} ${manifest}: ${current} -> ${updated}`);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
