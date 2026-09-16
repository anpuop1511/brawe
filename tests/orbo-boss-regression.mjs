import fs from 'node:fs';
import assert from 'node:assert/strict';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

const checks = [
  ['Boss Battle registered in HOME_MODE_CARDS', /\['orbo_boss\',\s*'🪐',\s*'Boss Battle: 1 vs Orbo'/],
  ['Orbo Boss in HOME_PERMANENT_MODE_IDS', /HOME_PERMANENT_MODE_IDS\s*=\s*\[[^\]]*'orbo_boss'/],
  ['Boss Battle rules in HOME_MODE_RULES with Zero Power Cubes', /orbo_boss:\s*\[[\s\S]*?1-Player Boss Battle: 1 vs Mega Boss Orbo![\s\S]*?Zero Power Cubes — Pure skill showdown[\s\S]*?Dodge crisscross orbits, bouncing Horizon Super & gravity vortexes/],
  ['Boss Battle rewards in HOME_EVENT_REWARDS', /orbo_boss:\s*\{\s*type:'coins',\s*amount:85/],
  ['Mode color and SOLO tag in syncHomeModeCards', /orbo_boss:\s*'#8c75df'[\s\S]*?id === 'orbo_boss'[\s\S]*?tag\s*=\s*'SOLO'/],
  ['Mode runtime flag isOrboBossMode initialized', /let isOrboBossMode = false;\s*let orboBossState = null;/],
  ['isPowerPlayModifierActive helper defined for Orbo Boss stages', /if \(isOrboBossMode && orboBossState\?\.hasPowerPlayModifier\) \{[\s\S]*?return true;/],
  ['generatePowerBoxes explicitly excludes isOrboBossMode', /isTugZoneMode \|\| .*isOrboBossMode/],
  ['launchShowdownMatch clears power cubes & powerups and inits Orbo Boss state', /isOrboBossMode = showdownMode === 'orbo_boss';[\s\S]*?player\.powerCubes = 0;[\s\S]*?powerups\.length = 0;[\s\S]*?cubes\.length = 0;[\s\S]*?initOrboBossState\(\);/],
  ['buildOrboBossMap builds clean cosmic arena without power boxes', /function buildOrboBossMap\(\) \{[\s\S]*?player\.powerCubes = 0;[\s\S]*?addArenaWallStrip\(cx - 380, cy - 380, 80, 80, \{ wallType: 'arena', hp: 99999, isPowerBox: false \}\);/],
  ['spawnBots returns early for isOrboBossMode to prevent showdown bots', /if \(isDuels \|\| isTraining \|\| isBlinkEyeDodgeMode \|\| .*isOrboBossMode/],
  ['spawnBots sets enemyCount = 0 for isOrboBossMode', /if \(isOrboBossMode\) enemyCount = 0;/],
  ['Storm check excludes isOrboBossMode', /!isOrboBossMode && !isBlinkEyeDodgeMode && !isObjectiveMode/],
  ['spawnOrboBossStage scales Mega Boss HP and Planetary Moons across stages', /function spawnOrboBossStage\(stageNumber = 1\) \{[\s\S]*?const bossHp = stageNumber === 1 \? 48000 : \(stageNumber === 2 \? 76000 : 110000\);[\s\S]*?const moonCount = stageNumber === 1 \? 2 : \(stageNumber === 2 \? 4 : 6\);/],
  ['initOrboBossState initializes Stage 1 with Mega Boss Orbo and Planetary Moons', /function initOrboBossState\(\) \{[\s\S]*?stage:\s*1,[\s\S]*?hasPowerPlayModifier:\s*false/],
  ['Mega Boss Orbo fires Crisscross Stellar Weave with sinusoidal trajectories', /b\.baseX \+= b\.vx \* dt;[\s\S]*?Math\.sin\(b\.life \* 9\.0 \+ b\.phase\) \* b\.amplitude;[\s\S]*?b\.x = b\.baseX \+ b\.perpX \* wave;/],
  ['Mega Boss Orbo spams Supers in rotating cosmic patterns (360 pinwheel, gatling, grid matrix, moon storm, boomerang)', /360° SUPERNOVA PINWHEEL![\s\S]*?HORIZON GATLING SWEEP![\s\S]*?COSMIC GRID MATRIX![\s\S]*?ALL MOONS FIRE SUPERS![\s\S]*?BOUNCING TRI-BOOMERANG!/],
  ['Mega Boss Orbo uses Orbital Skip blink teleport and Gravity Singularity Wells', /ORBITAL SKIP![\s\S]*?SINGULARITY VORTEX![\s\S]*?gravityVortexes/],
  ['Planetary Moons orbit Mega Boss, fire darts, and drop Stardust pickups upon destruction', /isOrboMoon[\s\S]*?MOON SHATTERED![\s\S]*?stardustPickups\.push\(\{[\s\S]*?heal:\s*1600,\s*charge:\s*25/],
  ['Close-call weave/dodge detection tracks combo streaks with floating text', /s\.dodges\+\+;[\s\S]*?s\.streak\+\+;[\s\S]*?s\.bestStreak = Math\.max\(s\.bestStreak, s\.streak\);[\s\S]*?COSMIC WEAVE!/],
  ['updateOrboBoss advances stages, activates Power Play modifier, and awards Victory', /allDefeated && !s\.transitioningStage && !s\.won[\s\S]*?POWER PLAY MODIFIER ACTIVATED![\s\S]*?s\.hasPowerPlayModifier = true;[\s\S]*?spawnOrboBossStage\(s\.stage\)/],
  ['Player gets Super, Hypercharge, and speed buffs when Power Play modifier is active', /if \(s\.hasPowerPlayModifier\) \{[\s\S]*?hyperChargeCharge = clamp\(hyperChargeCharge \+ dt \* 9, 0, 100\);[\s\S]*?updateHyperButton\(\);[\s\S]*?player\.speedMultiplier = Math\.max\(player\.speedMultiplier \|\| 1, 1\.35\);/],
  ['Player bullet collisions damage Boss units and grant Super and Hypercharge charge', /for \(const ent of s\.bossEntities\)[\s\S]*?ent\.hp = Math\.max\(0, ent\.hp - dmg\);[\s\S]*?hyperChargeCharge = clamp\(hyperChargeCharge \+ chargeGain \* 0\.6, 0, 100\);[\s\S]*?updateHyperButton\(\);/],
  ['Stardust pickup grants Super and Hypercharge charge', /stardustPickups[\s\S]*?hyperChargeCharge = clamp\(hyperChargeCharge \+ p\.charge \* 0\.65, 0, 100\);[\s\S]*?updateHyperButton\(\);/],
  ['Hypercharge unlock and activation supported during Orbo Boss and Power Play', /const hcAvailable = prog\.hyperchargeUnlocked \|\| isTraining \|\| .*isOrboBossMode/],
  ['AOEDamage checks and damages living Boss units', /if \(isOrboBossMode && orboBossState\?\.bossEntities && ownerId === player\.id\)[\s\S]*?ent\.hp = Math\.max\(0, ent\.hp - dealt\);/],
  ['renderOrboBossWorld renders 2.5D planetary rings, gravity wells, stardust pickups, and Power Play aura', /function renderOrboBossWorld\(ctx\)[\s\S]*?s\.hasPowerPlayModifier && player && player\.hp > 0[\s\S]*?scale\(1\.0,\s*0\.42\)/],
  ['renderOrboBossHUD displays current stage, HP bar, and stats', /function renderOrboBossHUD\(ctx\)[\s\S]*?MEGA BOSS ORBO • STAGE[\s\S]*?WEAVES:/],
  ['Results screen records Boss Battle victory, damage dealt, dodges, and best streak', /isOrboBossMode\) \{[\s\S]*?COSMIC OVERLORD DEFEATED![\s\S]*?Stages Cleared:/],
];

for (const [label, pattern] of checks) {
  assert.match(game, pattern, label);
}

console.log(`Orbo Boss Battle regression: ${checks.length}/${checks.length} checks passed.`);
