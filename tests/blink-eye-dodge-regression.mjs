import fs from 'node:fs';
import assert from 'node:assert/strict';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

const checks = [
  ['Boss Battle registered in HOME_MODE_CARDS', /\['blink_eye_dodge\',\s*'👁️',\s*'Boss Battle: 1 vs BlinkEye'/],
  ['Blink Eye Dodge in HOME_PERMANENT_MODE_IDS', /HOME_PERMANENT_MODE_IDS\s*=\s*\[[^\]]*'blink_eye_dodge'/],
  ['Boss Battle rules in HOME_MODE_RULES with Zero Power Cubes', /blink_eye_dodge:\s*\[[\s\S]*?1-Player Boss Battle: 1 vs Mega Boss BlinkEye![\s\S]*?Zero Power Cubes — Pure skill showdown[\s\S]*?Dodge bouncing Ricochet Gaze lasers/],
  ['Boss Battle rewards in HOME_EVENT_REWARDS', /blink_eye_dodge:\s*\{\s*type:'coins',\s*amount:75/],
  ['Mode color and SOLO tag in syncHomeModeCards', /blink_eye_dodge:\s*'#a855f7'[\s\S]*?id === 'blink_eye_dodge'\)\s*tag\s*=\s*'SOLO'/],
  ['Mode runtime flag isBlinkEyeDodgeMode initialized', /let isBlinkEyeDodgeMode = false;/],
  ['generatePowerBoxes explicitly excludes isBlinkEyeDodgeMode', /if\(isBlinkEyeDodgeMode \|\| isDuels \|\| isTraining/],
  ['launchShowdownMatch guards generatePowerBoxes', /if \(!isBlinkEyeDodgeMode\) generatePowerBoxes\(\);/],
  ['launchShowdownMatch clears power cubes & powerups and inits Boss state', /isBlinkEyeDodgeMode = showdownMode === 'blink_eye_dodge';[\s\S]*?player\.powerCubes = 0;[\s\S]*?powerups\.length = 0;[\s\S]*?cubes\.length = 0;[\s\S]*?initBlinkEyeDodgeState\(\);/],
  ['buildBlinkEyeDodgeMap builds clean arena without power boxes', /function buildBlinkEyeDodgeMap\(\) \{[\s\S]*?player\.powerCubes = 0;[\s\S]*?addArenaWallStrip\(cx - 360, cy - 360, 90, 90, \{ wallType: 'arena', hp: 99999, isPowerBox: false \}\);/],
  ['spawnBots sets enemyCount = 0 for isBlinkEyeDodgeMode', /if \(isBlinkEyeDodgeMode\) enemyCount = 0;/],
  ['Storm check excludes isBlinkEyeDodgeMode', /!isBlinkEyeDodgeMode && !isObjectiveMode/],
  ['initBlinkEyeDodgeState initializes Mega Boss BlinkEye and All-Seeing Sentinel Eyes', /initBlinkEyeDodgeState\(\)[\s\S]*?boss_blinkeye_master[\s\S]*?👑 MEGA BOSS BLINKEYE[\s\S]*?boss_all_seeing_alpha[\s\S]*?boss_all_seeing_beta/],
  ['Mega Boss BlinkEye uses authentic Ricochet Gaze laser attacks', /ownerBrawler: 'blinkeye'[\s\S]*?isBlinkEyeMain: true[\s\S]*?blinkeyeBaseDmg: 580[\s\S]*?blinkeyeBounceCount: 0/],
  ['Mega Boss BlinkEye uses Retinal Flash and We All See missiles', /RETINAL FLASH![\s\S]*?WE ALL SEE![\s\S]*?isBlinkEyeMissile: true/],
  ['updateBlinkEyeDodge continuously enforces zero power cubes', /function updateBlinkEyeDodge[\s\S]*?if \(powerups\.length > 0\) powerups\.length = 0;[\s\S]*?if \(cubes\.length > 0\) cubes\.length = 0;/],
  ['Player bullet collisions damage Boss units and grant Super/Hyper charge', /for \(const ent of s\.giantEyes\)[\s\S]*?ent\.hp = Math\.max\(0, ent\.hp - dmg\);[\s\S]*?superCharge = clamp\(superCharge \+ chargeGain, 0, 100\);/],
  ['AOEDamage checks and damages living Boss units', /if \(isBlinkEyeDodgeMode && blinkEyeDodgeState\?\.giantEyes && ownerId === player\.id\)[\s\S]*?eye\.hp = Math\.max\(0, eye\.hp - dealt\);/],
  ['Victory triggers when all Boss units are defeated', /const allDefeated = s\.giantEyes\.every\(e => e\.hp <= 0 \|\| e\.defeated\);[\s\S]*?MEGA BLINKEYE DEFEATED!/],
  ['renderBlinkEyeDodgeWorld renders authentic BlinkEye marksman chassis & All-Seeing Eye', /function renderBlinkEyeDodgeWorld\(ctx\)[\s\S]*?isMegaBossBlinkeye[\s\S]*?cannonExt[\s\S]*?isSteeredEyeBoss/],
  ['renderBlinkEyeDodgeHUD renders Grand Boss Dual-Layer Health Bar and stats', /function renderBlinkEyeDodgeHUD\(ctx\)[\s\S]*?BOSS BATTLE: 1 VS MEGA BLINKEYE[\s\S]*?displayPct[\s\S]*?BOSS HP:/],
  ['Results screen records Boss Battle victory, damage dealt, dodges, and best streak', /isBlinkEyeDodgeMode\) \{[\s\S]*?BOSS DEFEATED! 1 VS THE EYES VICTORY![\s\S]*?rankText = `Boss Damage:/],
];

for (const [label, pattern] of checks) {
  assert.match(game, pattern, label);
}

console.log(`Authentic Boss BlinkEye regression: ${checks.length}/${checks.length} checks passed.`);
