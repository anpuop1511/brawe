import assert from 'node:assert/strict';
import fs from 'node:fs';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

assert.match(game, /trampaheal:6/, 'Trampaheal has an explicit Super-charge step count');
assert.match(game, /function grantTrampahealTeamHealCharge[\s\S]*owner\.id === target\.id[\s\S]*restored <= 0[\s\S]*restored \/ TRAMPAHEAL_HEAL_CHARGE_BENCHMARK/, 'team-heal charge requires real teammate HP restoration and scales partial heals');
assert.match(game, /applyTrampahealTeamHeal\(fromEntity, ally, 1200\)/, 'Pocket Springboard healing charges Trampaheal Super');
assert.match(game, /applyTrampahealTeamHeal\(e, ally, 1500\)/, 'Bouncy Leap ally healing charges Trampaheal Super');
assert.match(game, /applyTrampahealTeamHeal\(tOwner, e, 1200\)/, 'Mega Trampoline bounce healing charges its owner Super');
assert.match(game, /applyTrampahealTeamHeal\(aOwner, ally, aura\.healTick \|\| 300\)/, 'lingering aura teammate healing charges its owner Super');

assert.match(game, /applyNonProjectileStructureDamage\(e, e\.x, e\.y, landRadius, 1200\)/, 'Trampaheal landing can damage power boxes');
assert.match(game, /Dedicated cleaves skip ordinary projectile collision[\s\S]*applyHeaterBoxDamage\(owner, wall, b\.damage \|\| 1500\)/, 'AxeyWaxy cleave can damage power boxes');
assert.match(game, /applyNonProjectileStructureDamage\(owner, b\.x, b\.y, 20, b\.damage \|\| 1200/, 'AxeyWaxy hatchet can damage power boxes');
assert.match(game, /applyNonProjectileStructureDamage\(coneOwner, b\.x, b\.y, 18, b\.damage \|\| 400/, 'Draflygon cone flames can damage power boxes');

console.log('Trampaheal charge + non-projectile power-box regression checks passed.');
