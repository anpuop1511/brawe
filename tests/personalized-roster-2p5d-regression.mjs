import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const code = fs.readFileSync(new URL('../modules/visuals/roster-2p5d.js', import.meta.url), 'utf8');
const gameCode = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');
const context = { globalThis: {} };
vm.createContext(context);
vm.runInContext(code, context);
const visuals = context.globalThis.BraweRosterVisuals;
const fighterIds = Object.keys(visuals.looks);
const rosterBlock = gameCode.match(/const allBrawlers = \[([\s\S]*?)\n\s*\];/)?.[1] || '';
const gameRoster = [...rosterBlock.matchAll(/'([^']+)'/g)].map(match => match[1]);

assert.equal(fighterIds.length, 89, 'all 89 current fighters have 2.5D definitions');
assert.deepEqual(fighterIds.slice().sort(), gameRoster.slice().sort(), 'the playable game roster and 2.5D registry have exact coverage');
assert.deepEqual(Object.keys(visuals.identities).sort(), fighterIds.slice().sort(), 'identity registry exactly covers the visual roster');

const identityKeys = fighterIds.map(id => visuals.identity(id).join('|'));
assert.equal(new Set(identityKeys).size, fighterIds.length, 'no fighter repeats another fighter identity combination');

const portraits = fighterIds.map(id => visuals.portrait(id));
assert.equal(new Set(portraits).size, fighterIds.length, 'every fighter produces distinct vector geometry, not a palette-only copy');
const geometryOnly = portraits.map(svg => svg
  .replace(/(?:fill|stroke)="[^"]*"/g, '')
  .replace(/class="[^"]*"/g, ''));
assert.equal(new Set(geometryOnly).size, fighterIds.length, 'all 89 silhouettes remain unique after removing every color');
for (let index = 0; index < portraits.length; index++) {
  const portrait = portraits[index];
  assert.match(portrait, /^<svg[^>]+>[\s\S]+<\/svg>$/, fighterIds[index] + ' renders an SVG portrait');
  assert((portrait.match(/<(?:ellipse|rect|polygon|polyline)/g) || []).length >= 18, fighterIds[index] + ' has a detailed layered model');
  assert(!/[🀀-🫿]/u.test(portrait), fighterIds[index] + ' uses vector art rather than emoji');
}

for (const [id, expectedWords] of Object.entries({
  outlit:['signal_lamp','light_caster','power_cell'],
  bouncin_balls:['ball_antennae','bounce_orbs','bounce_arc'],
  evil_doctor:['doctor_cap','dna_syringe','dna_helix'],
  fastpass:['speed_fins','ticket_shooters','momentum_meter'],
  freestyle:['dj_phones','instrument_set','disco_mark'],
  portalo:['portal_horns','portal_orbs','linked_portals'],
  jacktrade:['dealer_hat','card_fan','dice_core'],
  mageny:['magnet_horns','horseshoe_bolt','polarity_core'],
  king:['king_crown','royal_cannon','princess_tower'],
  anti_royal:['pirate_hat','gold_punch','mortar_mark']
})) assert.deepEqual(Array.from(visuals.identity(id).slice(0,3)), expectedWords, id + ' geometry is personalized to the kit');

console.log(`Personalized 2.5D roster passed: ${fighterIds.length} fighters, ${new Set(portraits).size} unique vector models.`);
