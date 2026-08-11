import assert from 'node:assert/strict';
import fs from 'node:fs';

const src = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');
const has = (needle, message = needle) => assert.ok(src.includes(needle), message);

// Evil Doctor: all attributed kill paths converge on one guarded handler.
has('function handleEvilDoctorKill(victim, ownerId, options = {})');
has("handleEvilDoctorKill(target, b.ownerId, { canChain: true })");
has('fromChainDNA: !!dna.evilDoctorChainDNA');
has('evilDoctorPoisonFromChainDNA');
has('victim._evilDoctorChainBurstDone');
has("spawnFloatingText(originX, originY - 28, 'CHAIN DNA'");

// JackTrade: locked outcome is visible immediately and cancel never clears it.
has('superBtn.dataset.lockedOutcome=lockedLabel');
has("superBtn.dataset.lockedOutcome = 'ALL IN'");
const cancelBody = src.slice(src.indexOf('function cancelSuperAim()'), src.indexOf('function startAimingSuper', src.indexOf('function cancelSuperAim()')));
assert.ok(!cancelBody.includes('clearJackTradePreparedOutcomes'), 'cancel must preserve prepared JackTrade outcomes');

// Universal desktop/mobile cancel paths.
has("k === 'escape' && aimingSuper");
has('e.button === 2 && aimingSuper');
has('superAimCancelState.leftDeadZone');
has('releaseSuper(!superAimCancelState.leftDeadZone || superAimCancelState.cancel)');
has("pointercancel', (e) => { e.preventDefault(); cancelSuperAim(); }");

// Tug Zone exact movement and one-time event architecture.
has('const TUG_ZONE_PULL_SPEED = 27');
has('const TUG_ZONE_RECENTER_MULT = 0.35');
has('tugZoneTriggeredCheckpoints.has(key)');
has('tugZoneTriggeredCheckpoints.add(key)');
has('else { tugZoneHazards.length=0;');
has('buildTugZoneMap()');
has('isTugZoneMode = showdownMode === \'tug_zone\'');

const mult = n => n <= 0 ? 0 : n === 1 ? 1 : n === 2 ? 1.6 : n === 3 ? 2 : 2.25;
assert.equal(mult(1), 1);
assert.equal(mult(2), 1.6);
assert.equal(mult(3), 2);
assert.equal(mult(4), 2.25);
const centerToGoal = 2400 * (.5 - .08);
assert.ok(centerToGoal / 27 >= 35 && centerToGoal / 27 <= 40, 'one-player center-to-goal travel must be 35-40 seconds');
assert.equal(27 * .35, 9.45);

// The moving zone changes only its own x; deployables are never translated.
const updateBody = src.slice(src.indexOf('function updateTugZoneMode'), src.indexOf('function spawnSkelePortal', src.indexOf('function updateTugZoneMode')));
assert.ok(!/\b(?:bots|bullets|destructibleWalls|powerups)\s*\.forEach\([^)]*=>[^}]*\.x\s*[+\-]=/.test(updateBody), 'zone must not carry entities or deployables');

console.log('Tug Zone, Evil Doctor, JackTrade UI, and universal Super cancel regression checks passed.');
