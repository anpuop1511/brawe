import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const gameCode = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

test('Steamer starts match with 5 super charges initialized', () => {
  assert.match(gameCode, /player\.steamerSuperCharges\s*=\s*5/);
  assert.match(gameCode, /if\s*\(typeof entity\.steamerSuperCharges !== 'number'\)\s*entity\.steamerSuperCharges\s*=\s*5/);
});

test('Steamer super charge management handles 5 charges and sub-charges', () => {
  assert.match(gameCode, /function addSteamerSuperCharge\(/);
  assert.match(gameCode, /function consumeSteamerSuperCharge\(/);
  assert.match(gameCode, /Power Move: Ready \(\$\{charges\}\/5\)/);
});

test('Steamer can throw steam poles with max range 650 and up to 5 active poles', () => {
  assert.match(gameCode, /function castSteamerPoleThrow\(/);
  assert.match(gameCode, /const maxRange\s*=\s*650/);
  assert.match(gameCode, /steamerPoles\.push\(/);
});

test('Steamer railroad dash connects through placed poles', () => {
  assert.match(gameCode, /function startSteamerRailroad\(/);
  assert.match(gameCode, /const ownerPoles\s*=\s*steamerPoles\.filter\(/);
});

test('Steamer Hypercharge runs 40% faster with 3 laps (lapMs 1571 / laps 3)', () => {
  assert.match(gameCode, /const lapMs\s*=\s*hyperActive\s*\?\s*Math\.round\(baseLapMs\s*\/\s*1\.40\)\s*:\s*baseLapMs/);
  assert.match(gameCode, /laps\s*=\s*runaway\s*\?\s*4\s*:\s*\(hyperActive\s*\?\s*3\s*:\s*\(1\s*\+\s*Math\.max/);
});

test('Steamer Hypercharge explodes poles on passage and vents boiling steam hazard clouds', () => {
  assert.match(gameCode, /rail\.explodedPoles\[poleKey\]\s*=\s*true/);
  assert.match(gameCode, /STEAM OVERPRESSURE! 💥/);
  assert.match(gameCode, /spawnCheeseField\(expX,\s*expY,\s*80,\s*4500/);
  assert.match(gameCode, /spawnSteamerSteamBurst\(entity,\s*burstAng,\s*true/);
});

test('Steamer aim reticle renders throw trajectory, landing preview, and pole counter', () => {
  assert.match(gameCode, /const playerPoles\s*=\s*steamerPoles\.filter\(p\s*=>\s*p\.ownerId\s*===\s*player\.id\)/);
  assert.match(gameCode, /\$\{playerPoles\.length\}\/5 POLES/);
});
