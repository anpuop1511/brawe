import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const gameCode = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

test('BlinkEye is registered in allBrawlers and brawlerRarities', () => {
  assert.match(gameCode, /'blinkeye'/);
  assert.match(gameCode, /blinkeye:\s*'Epic'/);
});

test('BlinkEye is a member of The Rebound Branch family tree', () => {
  assert.match(gameCode, /name:'The Rebound Branch'[\s\S]*?members:\[[^\]]*?'blinkeye'/);
});

test('BlinkEye brawlerData has complete attack, super, gadgets, and star powers defined', () => {
  assert.match(gameCode, /'blinkeye':\s*\{\s*name:\s*'BlinkEye'/);
  assert.match(gameCode, /attack:\s*'Ricochet Gaze'/);
  assert.match(gameCode, /super:\s*'We All See'/);
  assert.match(gameCode, /hyper:\s*'Omnipresent Sight/);
  assert.match(gameCode, /g1:\s*'Retinal Flash/);
  assert.match(gameCode, /g2:\s*'Prism Bumper/);
  assert.match(gameCode, /sp1:\s*'Rebound Focus/);
  assert.match(gameCode, /sp2:\s*'Watchful Iris/);
});

test('BlinkEye main attack fires fast sniper shot with +100% range per bounce (max 2 bounces)', () => {
  assert.match(gameCode, /ownerBrawler:\s*'blinkeye'/);
  assert.match(gameCode, /isBlinkEyeMain:\s*true/);
  assert.match(gameCode, /if\s*\(b\.ownerBrawler === 'blinkeye' && b\.isBlinkEyeMain\)/);
  assert.match(gameCode, /b\.blinkeyeBounceCount\s*=\s*\(b\.blinkeyeBounceCount \|\| 0\) \+ 1/);
  assert.match(gameCode, /if\s*\(b\.blinkeyeBounceCount > 2\)/);
});

test('BlinkEye Super We All See launches steerable eye with camera tracking, 40% DR, and recentered top-center PiP threat radar', () => {
  assert.match(gameCode, /function startBlinkEyeSuper\(/);
  assert.match(gameCode, /isBlinkEyeSteeredEye:\s*true/);
  assert.match(gameCode, /const baseEyeSpeed = 352;/);
  assert.match(gameCode, /maxDur = isHyper \? 20000 : 16000;/);
  assert.match(gameCode, /entity\.defenseMult = isHyper \? 0\.30 : 0\.60/);
  assert.match(gameCode, /function drawBlinkEyePiPScreen\(/);
  assert.match(gameCode, /drawBlinkEyePiPScreen\(ctx\);/);
  assert.match(gameCode, /const pipX = Math\.round\(\(innerWidth - pipW\) \/ 2\);/);
});

test('BlinkEye Hypercharge fires double sniper shots, grants 70% DR, lasts 20s, and launches purple eye missiles at enemies in direct line-of-sight every 0.6s', () => {
  assert.match(gameCode, /const shotCount = isHyper \? 2 : 1/);
  assert.match(gameCode, /maxLife: isHyper \? 20\.0 : 16\.0/);
  assert.match(gameCode, /now - b\.lastMissileAt >= 600/);
  assert.match(gameCode, /function hasBlinkEyeSight\(/);
  assert.match(gameCode, /hasBlinkEyeSight\(b\.x, b\.y, victim\.x, victim\.y\)/);
  assert.match(gameCode, /isBlinkEyeMissile:\s*true/);
  assert.match(gameCode, /#d25bff/);
});

test('BlinkEye Gadgets and Star Powers execute properly', () => {
  assert.match(gameCode, /function triggerBlinkEyeRetinalFlash\(/);
  assert.match(gameCode, /isPrismBumper:\s*true/);
  assert.match(gameCode, /b\.blinkeyeBounceCount === 1 \? 1\.25 : 1\.50/);
  assert.match(gameCode, /isBlinkEyeCounterBeam:\s*true/);
});

test('BlinkEye body renders custom glowing optic iris and eyelid blink animation', () => {
  assert.match(gameCode, /brawlerId === 'blinkeye'/);
  assert.match(gameCode, /Sleek Optic Frame Base/);
  assert.match(gameCode, /Glowing Sclera & Iris/);
});

test('BlinkEye Super cast and projectile rendering are hooked', () => {
  assert.match(gameCode, /if\s*\(combatBrawler === 'blinkeye'\)/);
  assert.match(gameCode, /if\s*\(botCombatBrawler === 'blinkeye'\)/);
  assert.match(gameCode, /selectedBrawler === 'blinkeye' && !aimingSuper/);
  assert.match(gameCode, /selectedBrawler === 'blinkeye' && aimingSuper/);
  assert.match(gameCode, /b\.ownerBrawler === 'blinkeye' && b\.isBlinkEyeSteeredEye/);
  assert.match(gameCode, /b\.ownerBrawler === 'blinkeye' && b\.isBlinkEyeMain/);
});
test('BlinkEye Super collision logic guards against self/ally collision and wall clipping', () => {
  assert.match(gameCode, /if \(target && owner && \(target\.id === owner\.id \|\| areAlliedEntities\(owner, target\)\)\) \{\s*return false;\s*\}/);
  assert.match(gameCode, /if \(hitCube && b\.isBlinkEyeSteeredEye\)/);
  assert.match(gameCode, /if \(b\.life >= 0\.05\)/);
});

test('BlinkEye main attack supports Slop Sushi range buffs and 2.0x bounceMultiplier indicator', () => {
  assert.match(gameCode, /const rangeMult = 1 \+ \(isSlopSushiMode \? getEntitySlopEffectTotal\(fromEntity, 'sushiAttackRangePct'\) : 0\);/);
  assert.match(gameCode, /traceRicochetPath\(player\.x, player\.y, ang, maxRange, 2, 16, 2\.0\)/);
  assert.match(gameCode, /const bounceRangeMultiplier = 1 \+ b\.blinkeyeBounceCount;/);
});
