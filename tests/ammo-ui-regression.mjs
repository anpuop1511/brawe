import assert from 'node:assert/strict';
import fs from 'node:fs';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

assert.match(
  game,
  /function updateAmmoUI\(\)/,
  'updateAmmoUI function is defined in game.js'
);

assert.match(
  game,
  /if\s*\(typeof updateAmmoUI === 'function'\)\s*updateAmmoUI\(\);/,
  'Quickfire ranked modifier safely invokes updateAmmoUI'
);

console.log('Ammo UI regression tests passed successfully.');
