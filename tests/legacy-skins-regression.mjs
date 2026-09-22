import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');
const roster = fs.readFileSync(new URL('../modules/visuals/roster-2p5d.js', import.meta.url), 'utf8');

for (const [skin, brawler, attack, superFx] of [
  ['abyss-trapper', 'trapper', 'abyssJawGate', 'pressureFence'],
  ['reactor-decayer', 'decayer', 'reactorPlasma', 'containmentStorm'],
  ['prism-seraph-angel', 'angel', 'prismLance', 'seraphSanctuary']
]) {
  assert.match(game, new RegExp(`'${skin}': \\{[\\s\\S]*?brawler: '${brawler}'[\\s\\S]*?attackEffect: \\{ type: '${attack}'[\\s\\S]*?superEffect: \\{ type: '${superFx}'`));
  assert.match(game, new RegExp(`id: '${skin}'[\\s\\S]*?isAlwaysAvailable: true`));
  assert.match(roster, new RegExp(`'${skin}':\\[`));
}

const sandbox = { globalThis: {} };
vm.runInNewContext(roster, sandbox);
const visuals = sandbox.globalThis.BraweRosterVisuals;
assert.ok(visuals);
for (const [skin, brawler] of [
  ['abyss-trapper', 'trapper'],
  ['reactor-decayer', 'decayer'],
  ['prism-seraph-angel', 'angel']
]) {
  const portrait = visuals.portrait(brawler, skin);
  assert.match(portrait, /fighter-portrait-art/);
  assert.ok(portrait.length > 700, `${skin} should have a detailed vector portrait`);
}

assert.match(game, /function renderUniversalSkinProjectile\(b, skin\)/);
assert.match(game, /const activeSkin = getActiveSkinForBrawler\(projectileBrawler\)/);
console.log('Legacy skin regression checks passed.');
