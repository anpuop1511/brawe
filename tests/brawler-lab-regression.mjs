import fs from 'node:fs';
import assert from 'node:assert/strict';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');
const bootstrap = fs.readFileSync(new URL('../bootstrap.js', import.meta.url), 'utf8');

assert.match(game, /brawlerLabBtn\.textContent = '🧪 Brawler Lab'/, 'home screen exposes Brawler Lab');
assert.match(game, /isBrawlerLabMode = true/, 'lab has a separate mode flag');
assert.match(game, /spawnBrawlerLabOpponent\(brawlerLabOpponentId\)/, 'lab creates a selectable second fighter');
assert.match(game, /player\.hp <= 1 \|\| player\.isDead/, 'player is restored before being eliminated');
assert.match(game, /opponent\.hp <= 1 \|\| opponent\.isDead/, 'opponent is restored before being eliminated');
assert.match(game, /if \(!isBrawlerLabMode\) \{\s*superCharge = 100;/, 'normal training refill is disabled in Lab');
assert.match(game, /OPPONENT STAR POWER/, 'opponent Star Power can be toggled');
assert.match(game, /OPPONENT GADGET/, 'opponent Gadget can be toggled');
assert.match(game, /function applyBrawlerLabPlayerLoadout\(\)/, 'Lab loadout toggles are isolated from saved progression');
assert.match(game, /gadgetUsesLeft = brawlerLabPlayerGadget === 'off' \? 0 : 99/, 'Gadget OFF is enforced in the Lab');
assert.match(game, /OPP SUPER: ON/, 'opponent Super can be toggled');
assert.match(game, /OPP HYPER: ON/, 'opponent Hypercharge can be toggled');
assert.match(game, /noteBrawlerLabProjectile\(entry\)/, 'projectiles are measured at creation');
assert.match(game, /rangeTiles: Number\(\(pixels \/ 64\)\.toFixed\(2\)\)/, 'range is exported in tiles');
assert.match(game, /BRAWE BRAWLER LAB REPORT/, 'TXT report export is present');
assert.match(game, /anchor\.download = `BRAWE-Brawler-Lab-/, 'report downloads as a TXT file');
assert.match(game, /const brawlerLabChargeReport = \[\]/, 'Super charge results persist across fighter switches');
assert.match(game, /averagePerHit/, 'Super charge report includes per-hit charge rate');
assert.match(bootstrap, /20260909-brawler-lab1/, 'cache token was advanced');

console.log('Brawler Lab regression checks passed.');
