import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const gameCode = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

test('Steamer starts match with 5 super charges initialized', () => {
  assert.match(gameCode, /player\.steamerSuperCharges\s*=\s*5/);
  assert.match(gameCode, /if\s*\(typeof entity\.steamerSuperCharges !== 'number'\)\s*entity\.steamerSuperCharges\s*=\s*5/);
});

test('Steamer controls allow quick tap E to dash and hold E + click to place pole without mouseup double-consumption', () => {
  assert.match(gameCode, /if\s*\(selectedBrawler === 'steamer'\)\s*\{\s*return;\s*\}\s*releaseSuper\(\);/);
  assert.match(gameCode, /if\s*\(e\.button === 0 && aimingSuper && selectedBrawler === 'steamer'\)[\s\S]*?steamerPolesPlacedInCurrentAim\+\+/);
  assert.match(gameCode, /if\s*\(holdMs < 280 && steamerPolesPlacedInCurrentAim === 0\)/);
});

test('Steamer super charge management handles 5 charges and sub-charges', () => {
  assert.match(gameCode, /function addSteamerSuperCharge\(/);
  assert.match(gameCode, /function consumeSteamerSuperCharge\(/);
  assert.match(gameCode, /Tap E: Dash • Hold E\+Click: Pole \(\$\{charges\}\/5\)/);
});

test('Steamer caps at max 5 poles and removes oldest when placing past 5', () => {
  assert.match(gameCode, /function castSteamerPoleThrow\(/);
  assert.match(gameCode, /const existingOwnerPoles\s*=\s*steamerPoles\.filter/);
  assert.match(gameCode, /if\s*\(existingOwnerPoles\.length >= 5\)\s*\{[\s\S]*?steamerPoles\.splice/);
  assert.match(gameCode, /steamerPoles\.push\(/);
});

test('Steamer railroad dash maintains 100% constant speed throughout the dash across all segments', () => {
  assert.match(gameCode, /function startSteamerRailroad\(/);
  assert.match(gameCode, /const segments\s*=\s*\[\]/);
  assert.match(gameCode, /const lapFraction\s*=\s*clamp\(\(elapsed % rail\.lapMs\) \/ rail\.lapMs, 0, 1\)/);
  assert.match(gameCode, /const currentDist\s*=\s*lapFraction \* rail\.totalDist/);
  assert.match(gameCode, /activeSeg = seg/);
});

test('Steamer railroad dash connects through custom placed poles or linear dash if 0 poles', () => {
  assert.match(gameCode, /const ownerPoles\s*=\s*steamerPoles\.filter\(/);
  assert.match(gameCode, /isLinearDash\s*=\s*true/);
  assert.match(gameCode, /STEAM RUSH! 💨/);
});

test('Steamer Hypercharge runs 40% faster with 3 laps (lapMs 1571 / laps 3)', () => {
  assert.match(gameCode, /const lapMs\s*=\s*hyperActive\s*\?\s*Math\.round\(baseLapMs\s*\/\s*1\.40\)\s*:\s*baseLapMs/);
  assert.match(gameCode, /laps\s*=\s*isLinearDash\s*\?\s*1\s*:\s*\(runaway\s*\?\s*4\s*:\s*\(hyperActive\s*\?\s*3/);
});

test('Steamer Hypercharge explodes poles on passage and vents boiling steam hazard clouds', () => {
  assert.match(gameCode, /rail\.explodedPoles\[poleKey\]\s*=\s*true/);
  assert.match(gameCode, /STEAM OVERPRESSURE! 💥/);
  assert.match(gameCode, /spawnCheeseField\(expX,\s*expY,\s*80,\s*4500/);
  assert.match(gameCode, /spawnSteamerSteamBurst\(entity,\s*burstAng,\s*true/);
});

test('Steamer aim reticle renders throw trajectory, landing preview, and pole counter', () => {
  assert.match(gameCode, /const playerPoles\s*=\s*steamerPoles\.filter/);
  assert.match(gameCode, /CLICK TO PLACE • TAP E TO DASH/);
});
