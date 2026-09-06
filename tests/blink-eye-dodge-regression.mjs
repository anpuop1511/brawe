import fs from 'node:fs';
import assert from 'node:assert/strict';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

const checks = [
  ['Boss Battle: 1 vs The Eyes registered in HOME_MODE_CARDS', /\['blink_eye_dodge\',\s*'👁️',\s*'Boss Battle: 1 vs The Eyes'/],
  ['Blink Eye Dodge in HOME_PERMANENT_MODE_IDS', /HOME_PERMANENT_MODE_IDS\s*=\s*\[[^\]]*'blink_eye_dodge'/],
  ['Boss Battle rules in HOME_MODE_RULES with Zero Power Cubes', /blink_eye_dodge:\s*\[[\s\S]*?1-Player Solo Boss Battle: 1 vs The Eyes![\s\S]*?Zero Power Cubes — Pure skill showdown[\s\S]*?Shoot & defeat all Giant Boss Eyes/],
  ['Boss Battle rewards in HOME_EVENT_REWARDS', /blink_eye_dodge:\s*\{\s*type:'coins',\s*amount:75/],
  ['Mode color and SOLO tag in syncHomeModeCards', /blink_eye_dodge:\s*'#a855f7'[\s\S]*?id === 'blink_eye_dodge'\)\s*tag\s*=\s*'SOLO'/],
  ['Mode runtime flag isBlinkEyeDodgeMode initialized', /let isBlinkEyeDodgeMode = false;/],
  ['launchShowdownMatch clears power cubes & powerups and inits Boss state', /isBlinkEyeDodgeMode = showdownMode === 'blink_eye_dodge';[\s\S]*?player\.powerCubes = 0;[\s\S]*?powerups\.length = 0;[\s\S]*?cubes\.length = 0;[\s\S]*?initBlinkEyeDodgeState\(\);/],
  ['buildBlinkEyeDodgeMap builds clean arena without power boxes', /function buildBlinkEyeDodgeMap\(\) \{[\s\S]*?player\.powerCubes = 0;[\s\S]*?addArenaWallStrip\(cx - 360, cy - 360, 90, 90, \{ wallType: 'arena', hp: 99999, isPowerBox: false \}\);/],
  ['spawnBots sets enemyCount = 0 for isBlinkEyeDodgeMode', /if \(isBlinkEyeDodgeMode\) enemyCount = 0;/],
  ['Storm check excludes isBlinkEyeDodgeMode', /!isBlinkEyeDodgeMode && !isObjectiveMode/],
  ['initBlinkEyeDodgeState initializes Prime Oculus, Crimson Sentinel, and Violet Sentinel Boss Eyes', /initBlinkEyeDodgeState\(\)[\s\S]*?boss_prime_oculus[\s\S]*?👑 PRIME OCULUS[\s\S]*?boss_crimson_sentinel[\s\S]*?boss_violet_sentinel/],
  ['updateBlinkEyeDodge continuously enforces zero power cubes', /function updateBlinkEyeDodge[\s\S]*?if \(powerups\.length > 0\) powerups\.length = 0;[\s\S]*?if \(cubes\.length > 0\) cubes\.length = 0;/],
  ['updateBlinkEyeDodge supports Boss Eyes movement, bounces, pupil tracking, and enrage', /function updateBlinkEyeDodge[\s\S]*?eye\.pupilAngle[\s\S]*?eye\.hp <= eye\.maxHp \* 0\.40[\s\S]*?eye\.enraged = true;/],
  ['Boss attacks generate funny homing missiles with imperfect turnRate & wobble', /s\.funnyMissiles\.push\(\{[\s\S]*?turnRate:[\s\S]*?wobbleSpeed:[\s\S]*?wobbleAmp:/],
  ['Prime Oculus fires Ocular Gaze Laser with warning telegraph', /eye\.laserChargeUntil[\s\S]*?eye\.laserFireUntil[\s\S]*?eye\.laserAngle/],
  ['Player bullet collisions damage Boss Eyes and grant Super/Hyper charge', /for \(const eye of s\.giantEyes\)[\s\S]*?eye\.hp = Math\.max\(0, eye\.hp - dmg\);[\s\S]*?superCharge = clamp\(superCharge \+ chargeGain, 0, 100\);/],
  ['AOEDamage checks and damages living Boss Eyes', /if \(isBlinkEyeDodgeMode && blinkEyeDodgeState\?\.giantEyes && ownerId === player\.id\)[\s\S]*?eye\.hp = Math\.max\(0, eye\.hp - dealt\);/],
  ['Victory triggers when all Boss Eyes are defeated', /const allDefeated = s\.giantEyes\.every\(e => e\.hp <= 0 \|\| e\.defeated\);[\s\S]*?ALL BOSS EYES DEFEATED!/],
  ['renderBlinkEyeDodgeWorld renders overhead Boss health bars and name badges', /function renderBlinkEyeDodgeWorld\(ctx\)[\s\S]*?eye\.name[\s\S]*?roundRect\(barX, barY, barW \* hpPct, barH, 3\)/],
  ['renderBlinkEyeDodgeHUD renders Grand Boss Dual-Layer Health Bar and stats', /function renderBlinkEyeDodgeHUD\(ctx\)[\s\S]*?BOSS BATTLE: 1 VS THE EYES[\s\S]*?displayPct[\s\S]*?BOSS HP:/],
  ['Results screen records Boss Battle victory, damage dealt, dodges, and best streak', /isBlinkEyeDodgeMode\) \{[\s\S]*?BOSS DEFEATED! 1 VS THE EYES VICTORY![\s\S]*?rankText = `Boss Damage:/],
];

for (const [label, pattern] of checks) {
  assert.match(game, pattern, label);
}

console.log(`Boss Battle 1 vs The Eyes regression: ${checks.length}/${checks.length} checks passed.`);
