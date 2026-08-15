import assert from 'node:assert/strict';
import fs from 'node:fs';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

assert.match(game, /LIMITED_QUEST_EVENT_ID = 'charged-up-2026-08'/);
assert.match(game, /LIMITED_QUEST_DURATION_MS = 14 \* 24 \* 60 \* 60 \* 1000/);

const superRewards = [...game.matchAll(/id:'super_charge_\d+'.*?rewards:\{coins:(\d+)\}/g)].map((match) => Number(match[1]));
const hyperRewards = [...game.matchAll(/id:'hyper_charge_\d+'.*?rewards:\{souls:(\d+)\}/g)].map((match) => Number(match[1]));
assert.equal(superRewards.length, 7, 'Super Charged has seven milestones');
assert.equal(hyperRewards.length, 7, 'Hyper Charged has seven milestones');
assert.equal(superRewards.reduce((sum, reward) => sum + reward, 0), 18650, 'Super Charged pays exactly two full upgrade curves');
assert.equal(hyperRewards.reduce((sum, reward) => sum + reward, 0), 500, 'Hyper Charged pays exactly 500 Souls');
for (const target of [5, 10, 20, 35, 50, 75, 100]) {
  assert.match(game, new RegExp(`id:'super_charge_${String(target).padStart(2, '0')}'.*?target:${target}`));
  assert.match(game, new RegExp(`id:'hyper_charge_${String(target).padStart(2, '0')}'.*?target:${target}`));
}
assert.match(game, /addEventQuestProgress\('activate_hypers'\)/, 'player Hyper activations progress the pack');
assert.match(game, /className = 'charged-quest-packs'/, 'Charged packs have a dedicated grouped layout');
assert.match(game, /A limited event expires once/, 'expired event progress is not silently reset');

console.log('Charged quest pack regression checks passed.');
