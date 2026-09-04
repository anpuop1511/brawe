import assert from 'node:assert/strict';
import fs from 'node:fs';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

assert.match(game, /const PARADOX_NORMAL_ZONE_RADIUS = 250/,
  'regular Relativity Zone receives +30% radius buff (250px)');
assert.match(game, /const PARADOX_SUPER_AIM_RANGE = 728/,
  'Paradox Super receives +30% aim range length (728px)');
assert.match(game, /const PARADOX_HYPER_ZONE_RADIUS = 312/,
  'Paradox Hyper Super zone receives +30% radius (312px)');
assert.match(game, /skipAt = \(isHc \? 0\.28 : 0\.33\) \* 1\.40/,
  'Paradox main attack receives +40% range timing');
assert.match(game, /paradoxSkipDist: Math\.round\(\(isHc \? 150 : 110\) \* 1\.40\)/,
  'Paradox main attack skip distance is scaled by +40%');
assert.match(game, /function getParadoxSuperTarget\(/,
  'Paradox Super has a bounded aimed target helper');
assert.match(game, /castParadoxSuper\(player, wm\.x, wm\.y, !!isHypercharged\)/,
  'player Super uses the aimed world position');
assert.match(game, /if \(hyper\) addParadoxZone\(owner, owner\.x, owner\.y, PARADOX_HYPER_ZONE_RADIUS, duration, true, owner\)/,
  'Hyper Super adds its mobile attached dome');
assert.match(game, /b\.vx \*= 1\.10[\s\S]*b\.paradoxTimeEffect = 'sped'/,
  'friendly projectiles gain 10% speed and a visual state');
assert.match(game, /b\.vx \*= 0\.70[\s\S]*b\.paradoxTimeEffect = 'slowed'/,
  'enemy projectiles lose 30% speed and a visual state');
assert.match(game, /const turnRate = 3\.5 \* 0\.70/,
  'enemy projectile tracking is reduced by 30%');
assert.match(game, /owner\.paradoxFractureUntil = now \+ 10400/,
  'Temporal Fracture activates for 10.4 seconds after Super (+30% duration)');
assert.match(game, /spawnParadoxShot\(ang - 0\.20, 0\.45, true\)[\s\S]*spawnParadoxShot\(ang \+ 0\.20, 0\.45, true\)/,
  'Temporal Fracture creates its two side shots');
assert.match(game, /pierce: paradoxCharged \|\| \(fractureActive && !sideShot\)/,
  'Temporal Fracture restores its piercing middle sweep');

console.log('Paradox aimed Super, Hyper dome, projectile time effects, and Talent 2 checks passed.');
