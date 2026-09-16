import fs from 'node:fs';
import assert from 'node:assert/strict';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

assert.match(game, /const UNOPCOLOCO_SCARF_RANGE = UNOPCOLOCO_TILE \* 3;/, 'base scarf range is exactly three tiles');
assert.match(game, /UNOPCOLOCO_SCARF_RANGE \+ \(isHyper \? UNOPCOLOCO_TILE : 0\)/, 'Hyper adds one tile to Long Scarf');
assert.match(game, /hitboxMod: doubleKnot \? 5\.0 : 3\.8/, 'Long Scarf uses the new wide collision profile');
assert.match(game, /triggerScarfJump\(b, target\.x, target\.y, false\)/, 'enemy scarf hits start a leap');
assert.match(game, /triggerScarfJump\(b, b\.x, b\.y, true\)/, 'terrain scarf hits start a wall vault');
assert.match(game, /const whackAngles = \[-0\.14, 0, 0\.14\];/, 'Whack Frenzy fires three distinct whacks');
assert.match(game, /UNOPCOLOCO_WHACK_STEP_MS = 58/, 'three-whack unload uses the fast cadence');
assert.match(game, /fromEntity\.unopcolocoWhackAttacksRemaining = maxCycle/, 'one Long Scarf readies the balanced two-Whack chain');
assert.match(game, /unopcolocoWhackAttacksRemaining = Math\.max\(0,[\s\S]{0,120}- 1\)/, 'each Whack ammo attack consumes one chain charge');
assert.match(game, /unopcolocoWhackModeUntil = now \+ frenzyDuration[\s\S]{0,140}unopcolocoWhackAttacksRemaining = maxCycle/, 'Super landing immediately readies the balanced Whack set');
assert.match(game, /base \/= 1\.40/, 'Whack Frenzy receives the forty-percent reload buff');
assert.match(game, /superChargeGainMult: 0\.30/, 'each whack grants only thirty percent normal Super charge');
assert.match(game, /UNOPCOLOCO_WHACK_RANGE = UNOPCOLOCO_TILE \* 1\.3 \* 1\.30/, 'regular Whacks gain thirty percent range');
assert.match(game, /damage: isBot \? 264 : 480/, 'Whack damage is reduced by forty percent');
assert.match(game, /const whackSpeed = 448;/, 'regular Whacks travel thirty percent slower');
assert.match(game, /pierce: true, hitboxMod: 2\.8/, 'regular Whacks use the slightly wider collision profile');
assert.match(game, /const tipRange = whackRange;/, 'Hyper extensions add one hundred percent range');
assert.match(game, /const tipSpeed = 360;/, 'Hyper extensions travel fifty percent slower');
assert.match(game, /Whack Landing has its own jump telegraph/, 'Super uses its custom jump-and-landing telegraph');
assert.match(game, /isUnopHyperScarfTip: true[\s\S]{0,650}hitIds: \{\}/, 'Hyper extensions have independent hit tracking so their damage stacks');
assert.doesNotMatch(game, /super: 'Scarf Clonin|sp2: 'Extra Clone/, 'the retired clone kit is absent from runtime metadata');

console.log('UnoPcoLoco rework regression checks passed.');
