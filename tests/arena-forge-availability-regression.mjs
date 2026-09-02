import fs from 'node:fs';
import assert from 'node:assert/strict';

const source = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

const retiredModes = source.match(/const RETIRED_TOWER_MODE_IDS = new Set\(\[([^\]]*)\]\);/);
assert.ok(retiredModes, 'retired Tower-mode registry must exist');
assert.doesNotMatch(retiredModes[1], /['"]arena_forge['"]/, 'Arena Forge must not be retired');

const permanentModes = source.match(/const HOME_PERMANENT_MODE_IDS = \[([^\]]*)\];/);
assert.ok(permanentModes, 'permanent home-mode registry must exist');
assert.match(permanentModes[1], /['"]arena_forge['"]/, 'Arena Forge must stay in the permanent mode list');

assert.match(source, /isArenaForgeMode\s*=\s*showdownMode\s*===\s*['"]arena_forge['"]/, 'Arena Forge launch wiring must remain active');

console.log('Arena Forge availability regression checks passed.');
