import fs from 'node:fs';
import assert from 'node:assert/strict';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');
assert.doesNotMatch(game, /applySkinVisuals\(/, 'no missing helper calls remain');
assert.match(game, /shot\.skinEffect = skin\.superEffect\?\.type \|\| 'spiceBurst'/, 'Super skin metadata is stamped locally');
assert.match(game, /shot\.skinEffect = skin\.attackEffect\?\.type \|\| 'spiceFlame'/, 'attack skin metadata is stamped locally');
assert.match(game, /shot\.skinId = skin\.id/, 'equipped skin identity reaches the renderer');
console.log('Skin visual wiring regression: 4/4 checks passed.');
