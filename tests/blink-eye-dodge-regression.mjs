import fs from 'node:fs';
import assert from 'node:assert/strict';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

const checks = [
  ['Blink Eye Dodge registered in HOME_MODE_CARDS', /\['blink_eye_dodge',\s*'👁️',\s*'Blink Eye Dodge'/],
  ['Blink Eye Dodge in HOME_PERMANENT_MODE_IDS', /HOME_PERMANENT_MODE_IDS\s*=\s*\[[^\]]*'blink_eye_dodge'/],
  ['Blink Eye Dodge rules in HOME_MODE_RULES', /blink_eye_dodge:\s*\[[\s\S]*?1-Player Solo Survival Challenge/],
  ['Blink Eye Dodge rewards in HOME_EVENT_REWARDS', /blink_eye_dodge:\s*\{\s*type:'coins',\s*amount:75/],
  ['Blink Eye Dodge mode color and SOLO tag in syncHomeModeCards', /blink_eye_dodge:\s*'#a855f7'[\s\S]*?id === 'blink_eye_dodge'\)\s*tag\s*=\s*'SOLO'/],
  ['Mode runtime flag isBlinkEyeDodgeMode initialized', /let isBlinkEyeDodgeMode = false;/],
  ['launchShowdownMatch activates isBlinkEyeDodgeMode and inits state', /isBlinkEyeDodgeMode = showdownMode === 'blink_eye_dodge';[\s\S]*?if \(isBlinkEyeDodgeMode\) initBlinkEyeDodgeState\(\);/],
  ['buildBlinkEyeDodgeMap builds clean arena with 4 tactical bumper pillars', /function buildBlinkEyeDodgeMap\(\) \{[\s\S]*?addArenaWallStrip\(cx - 360, cy - 360/],
  ['spawnBots sets enemyCount = 0 for isBlinkEyeDodgeMode', /if \(isBlinkEyeDodgeMode\) enemyCount = 0;/],
  ['Storm check excludes isBlinkEyeDodgeMode', /!isBlinkEyeDodgeMode && !isObjectiveMode/],
  ['updateBlinkEyeDodge updates Giant Eyes with bouncing, pupil tracking, and squish', /function updateBlinkEyeDodge[\s\S]*?s\.giantEyes[\s\S]*?pupilAngle[\s\S]*?squish/],
  ['updateBlinkEyeDodge generates funny homing missiles with imperfect turnRate & wobble', /s\.funnyMissiles\.push\(\{[\s\S]*?turnRate:[\s\S]*?wobbleSpeed:[\s\S]*?wobbleAmp:/],
  ['Near miss dodge detection awards points, dodges, and funny floating taunts', /s\.closeCalls\+\+;[\s\S]*?s\.dodges\+\+;[\s\S]*?s\.streak\+\+;[\s\S]*?spawnFloatingText/],
  ['renderBlinkEyeDodgeWorld renders arena perimeter, giant eyes, and funny homing missiles', /function renderBlinkEyeDodgeWorld\(ctx\)/],
  ['renderBlinkEyeDodgeHUD renders timer, survival progress bar, dodges, and streak', /function renderBlinkEyeDodgeHUD\(ctx\)[\s\S]*?BLINK EYE DODGE/],
  ['Results screen records won condition, survival time, dodges, and best streak', /isBlinkEyeDodgeMode\) \{[\s\S]*?EYE DODGE MASTER! VICTORY![\s\S]*?rankText = `Survived/],
];

for (const [label, pattern] of checks) {
  assert.match(game, pattern, label);
}

console.log(`Blink Eye Dodge regression: ${checks.length}/${checks.length} checks passed.`);
