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
  ['isPowerPlayModifierActive helper defined for Power Play mode & Boss battle stages', /function isPowerPlayModifierActive\(entity = player\) \{[\s\S]*?if \(isPowerPlayShowdownMode\) return true;[\s\S]*?if \(isBlinkEyeDodgeMode && blinkEyeDodgeState\?\.hasPowerPlayModifier\)/],
  ['generatePowerBoxes explicitly excludes isBlinkEyeDodgeMode', /if\(isBlinkEyeDodgeMode \|\| isDuels \|\| isTraining/],
  ['launchShowdownMatch guards generatePowerBoxes', /if \(!isBlinkEyeDodgeMode\) generatePowerBoxes\(\);/],
  ['launchShowdownMatch clears power cubes & powerups and inits Boss state', /isBlinkEyeDodgeMode = showdownMode === 'blink_eye_dodge';[\s\S]*?player\.powerCubes = 0;[\s\S]*?powerups\.length = 0;[\s\S]*?cubes\.length = 0;[\s\S]*?initBlinkEyeDodgeState\(\);/],
  ['buildBlinkEyeDodgeMap builds clean arena without power boxes', /function buildBlinkEyeDodgeMap\(\) \{[\s\S]*?player\.powerCubes = 0;[\s\S]*?addArenaWallStrip\(cx - 360, cy - 360, 90, 90, \{ wallType: 'arena', hp: 99999, isPowerBox: false \}\);/],
  ['spawnBots sets enemyCount = 0 for isBlinkEyeDodgeMode', /if \(isBlinkEyeDodgeMode\) enemyCount = 0;/],
  ['Storm check excludes isBlinkEyeDodgeMode', /!isBlinkEyeDodgeMode && !isObjectiveMode/],
  ['spawnBlinkEyeDodgeStage scales eyes with stages', /function spawnBlinkEyeDodgeStage\(stageNumber = 1\) \{[\s\S]*?const sentinelCount = Math\.min\(8, 2 \+ \(stageNumber - 1\) \* 2\);/],
  ['initBlinkEyeDodgeState initializes Stage 1 with Mega Boss BlinkEye and Sentinel Eyes', /function initBlinkEyeDodgeState\(\) \{[\s\S]*?stage:\s*1,[\s\S]*?hasPowerPlayModifier:\s*false/],
  ['Mega Boss BlinkEye uses authentic Ricochet Gaze laser attacks', /ownerBrawler: 'blinkeye'[\s\S]*?isBlinkEyeMain: true[\s\S]*?blinkeyeBaseDmg: 580[\s\S]*?blinkeyeBounceCount: 0/],
  ['Mega Boss BlinkEye uses Retinal Flash and We All See missiles', /RETINAL FLASH![\s\S]*?WE ALL SEE![\s\S]*?isBlinkEyeMissile: true/],
  ['updateBlinkEyeDodge continuously enforces zero power cubes', /function updateBlinkEyeDodge[\s\S]*?if \(powerups\.length > 0\) powerups\.length = 0;[\s\S]*?if \(cubes\.length > 0\) cubes\.length = 0;/],
  ['updateBlinkEyeDodge activates Power Play modifier and advances to next stage on victory', /allDefeated && !s\.transitioningStage && !s\.won[\s\S]*?POWER PLAY MODIFIER ACTIVATED![\s\S]*?s\.hasPowerPlayModifier = true;[\s\S]*?spawnBlinkEyeDodgeStage\(s\.stage\)/],
  ['Player gets Super, Hypercharge, and speed buffs when Power Play modifier is active', /if \(s\.hasPowerPlayModifier\) \{[\s\S]*?player\.super = Math\.min\(1, \(player\.super \|\| 0\) \+ dt \* 0\.10\);[\s\S]*?player\.hypercharge = Math\.min\(1, \(player\.hypercharge \|\| 0\) \+ dt \* 0\.07\);[\s\S]*?player\.speedMultiplier = Math\.max\(player\.speedMultiplier \|\| 1, 1\.30\);/],
  ['Player bullet collisions damage Boss units and grant Super/Hyper charge', /for \(const ent of s\.giantEyes\)[\s\S]*?ent\.hp = Math\.max\(0, ent\.hp - dmg\);[\s\S]*?superCharge = clamp\(superCharge \+ chargeGain, 0, 100\);/],
  ['AOEDamage checks and damages living Boss units', /if \(isBlinkEyeDodgeMode && blinkEyeDodgeState\?\.giantEyes && ownerId === player\.id\)[\s\S]*?eye\.hp = Math\.max\(0, eye\.hp - dealt\);/],
  ['renderBlinkEyeDodgeWorld renders Power Play aura around player when modifier is active', /function renderBlinkEyeDodgeWorld\(ctx\)[\s\S]*?s\.hasPowerPlayModifier && player && player\.hp > 0[\s\S]*?#d946ef/],
  ['renderBlinkEyeDodgeHUD displays current stage and Power Play modifier status', /function renderBlinkEyeDodgeHUD\(ctx\)[\s\S]*?STAGE[\s\S]*?POWER PLAY MODIFIER ACTIVE/],
  ['Results screen records Boss Battle victory, damage dealt, dodges, and best streak', /isBlinkEyeDodgeMode\) \{[\s\S]*?YOU WIN![\s\S]*?rankText = `Stages Cleared:/],
];

for (const [label, pattern] of checks) {
  assert.match(game, pattern, label);
}

console.log(`BlinkEye Dodge Stage Progression & Power Play modifier regression: ${checks.length}/${checks.length} checks passed.`);
