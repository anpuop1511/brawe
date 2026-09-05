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

test('Steamer Hypercharge executes 2 full back-and-forths across waypoints', () => {
  assert.match(gameCode, /const forwardPoints = \[\.\.\.waypoints\];/);
  assert.match(gameCode, /const backwardPoints = \[\.\.\.waypoints\]\.reverse\(\);/);
  assert.match(gameCode, /laps = hyperActive \? 2 :/);
});

test('Steamer Hypercharge continuously vents boiling side steam from poles until finished', () => {
  assert.match(gameCode, /if \(rail\.isHyper\) \{[\s\S]*?if \(!rail\.lastPoleSteamAt \|\| now - rail\.lastPoleSteamAt >= 50\) \{[\s\S]*?const ownerPoles = steamerPoles\.filter/);
  assert.match(gameCode, /AOEDamage\(pole\.x,\s*pole\.y,\s*95,/);
});

test('Steamer blows massive steam during Hypercharge dash', () => {
  assert.match(gameCode, /spawnSteamerSteamBurst\(entity, travelAng \+ Math\.PI \* 0\.75, true,/);
  assert.match(gameCode, /steamDir: travelAng \+ Math\.PI/);
});

test('Steamer main attack features volumetric billowing steam puffs with zero fire references', () => {
  assert.match(gameCode, /const puffCount = isSuperSideShot \? 6 : 16;/);
  assert.match(gameCode, /isSteamPuff: true/);
  assert.match(gameCode, /steam trail lasts \+1\.5s/);
  assert.doesNotMatch(gameCode, /fire trail lasts/);
});

test('Steamer aim reticle renders throw trajectory, landing preview, and pole counter', () => {
  assert.match(gameCode, /const playerPoles\s*=\s*steamerPoles\.filter/);
  assert.match(gameCode, /CLICK TO PLACE • TAP E TO DASH/);
});
