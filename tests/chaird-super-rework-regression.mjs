import fs from 'node:fs';
import assert from 'node:assert/strict';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

assert.match(game, /superDesc: 'Spins chairs around[\s\S]{0,140}smoothly pulling enemies inward/, 'Chair Spin description includes its base-kit pull');
assert.match(game, /sp2: 'Runaway Furniture \(During Chair Spin, movement speed ramps from \+10% to \+80%/, 'SP2 is reworked to Runaway Furniture');
assert.match(game, /const pullDistance = 120 \* resistance \* dt/, 'base-kit pull is twenty percent stronger than the old 100-per-second pull');
assert.match(game, /areAlliedEntities\(e, target\)/, 'Chair Spin never pulls teammates');
assert.match(game, /const starRampMult = sp2 \? 1\.10 \+ spinProgress \* 0\.70 : 1/, 'SP2 ramps smoothly from ten to eighty percent');
assert.equal((game.match(/chairSpinStartedAt = now/g) || []).length, 2, 'player and bot Super casts initialize the speed ramp');
assert.match(game, /getEntityKnockbackMultiplier\(target\)/, 'Chair Spin respects existing displacement resistance');

console.log('Chaird Super rework regression checks passed.');
