import fs from 'node:fs';
import assert from 'node:assert/strict';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

const checks = [
  ['Boss Battle registered in HOME_MODE_CARDS', /\['ramage_boss',\s*'🥊',\s*'Boss Battle: 1 vs Ramage'/],
  ['Ramage Boss in HOME_PERMANENT_MODE_IDS', /HOME_PERMANENT_MODE_IDS\s*=\s*\[[^\]]*'ramage_boss'/],
  ['Boss Battle rules in HOME_MODE_RULES with 5 Stages and 10.0x Overdrive', /ramage_boss:\s*\[[\s\S]*?5-Stage Boss Battle: 1 vs Mega Boss Ramage![\s\S]*?Zero Power Cubes — Pure skill showdown[\s\S]*?Survive escalating damage ramps up to 10\.0x Overdrive across 5 Stages!/],
  ['Boss Battle rewards in HOME_EVENT_REWARDS', /ramage_boss:\s*\{\s*type:\s*'coins',\s*amount:\s*90/],
  ['Mode color and SOLO tag in syncHomeModeCards', /ramage_boss:\s*'#c0392b'[\s\S]*?id === 'ramage_boss'[\s\S]*?tag\s*=\s*'SOLO'/],
  ['Mode runtime flag isRamageBossMode initialized', /let isRamageBossMode = false;\s*let ramageBossState = null;/],
  ['isPowerPlayModifierActive helper defined for Ramage Boss stages', /if \(isRamageBossMode && ramageBossState\?\.hasPowerPlayModifier\) \{[\s\S]*?return true;/],
  ['generatePowerBoxes explicitly excludes isRamageBossMode', /isTugZoneMode \|\| .*isRamageBossMode/],
  ['launchShowdownMatch clears power cubes & powerups and inits Ramage Boss state', /isRamageBossMode = showdownMode === 'ramage_boss';[\s\S]*?player\.powerCubes = 0;[\s\S]*?powerups\.length = 0;[\s\S]*?cubes\.length = 0;[\s\S]*?initRamageBossState\(\);/],
  ['buildRamageBossMap builds clean colosseum arena without power boxes', /function buildRamageBossMap\(\) \{[\s\S]*?destructibleWalls\.length = 0;[\s\S]*?addArenaWallStrip[\s\S]*?wallType:\s*'colosseum_pillar'/],
  ['spawnBots returns early for isRamageBossMode to prevent showdown bots', /if \(isDuels \|\| isTraining \|\| isBlinkEyeDodgeMode \|\| .*isRamageBossMode\) return;/],
  ['spawnBots sets enemyCount = 0 for isRamageBossMode', /if \(isRamageBossMode\) enemyCount = 0;/],
  ['Storm check excludes isRamageBossMode', /!isRamageBossMode && !isOrboBossMode && !isBlinkEyeDodgeMode && !isObjectiveMode/],
  ['spawnRamageBossStage scales Mega Boss HP and Multiplier across 5 distinct stages', /function spawnRamageBossStage\(stageNumber = 1\) \{[\s\S]*?1:\s*\{\s*hp:\s*35000[\s\S]*?2:\s*\{\s*hp:\s*55000[\s\S]*?3:\s*\{\s*hp:\s*75000[\s\S]*?4:\s*\{\s*hp:\s*95000[\s\S]*?5:\s*\{\s*hp:\s*125000[\s\S]*?minMult:\s*10\.0/],
  ['initRamageBossState initializes Stage 1 with Mega Boss Ramage', /function initRamageBossState\(\) \{[\s\S]*?stage:\s*1,[\s\S]*?stageTitle:\s*'BATTERING AWAKENING'/],
  ['Mega Boss Ramage attacks with Battering Fist and Boomerang Rampage Super Dash', /isRamageFist: true[\s\S]*?ramageIsDashing = true[\s\S]*?BOOMERANG/],
  ['Stage 2 uses Adrenaline Rush and Rebound Magnet Super', /ADRENALINE RUSH![\s\S]*?REBOUND MAGNET/],
  ['Stage 3 uses Knuckle Blast concussions at 6.0x+ multiplier', /hasSP2KnuckleBlast[\s\S]*?KNUCKLE BLAST!/],
  ['Stage 4 & 5 trigger Shadow Double Rampage and Hypercharge green/purple shots', /SHADOW DOUBLE RAMPAGE[\s\S]*?isRamageShadowLifestealShot: true[\s\S]*?isRamageHyperCrossShot/],
  ['Stage 5 applies Ramp Retention armor reduction and 10.0x Overdrive', /ULTIMATE 10\.0x OVERDRIVE[\s\S]*?armorFactor/],
  ['Player Ramage multiplier charges reliably when hitting boss with fists or dash', /selectedBrawler === 'ramage' \|\| b\.isRamageFist[\s\S]*?player\.ramageMultiplier = nextMult;[\s\S]*?player\.ramageIsDashing/],
  ['updateRamageBoss advances stages 1 through 5, activates Power Play, and awards Victory', /s\.stage < 5[\s\S]*?s\.transitioningStage = true[\s\S]*?MEGA BOSS RAMAGE DEFEATED! 10\.0x OVERDRIVE CONQUERED!/],
  ['Player gets Super, Hypercharge, and speed buffs when Power Play modifier is active', /if \(s\.hasPowerPlayModifier\) \{[\s\S]*?superCharge = clamp\(superCharge \+ dt \* 18, 0, 100\);[\s\S]*?hyperChargeCharge = clamp\(hyperChargeCharge \+ dt \* 10, 0, 100\);/],
  ['Player bullet collisions damage Boss units and grant Super and Hypercharge charge', /for \(const ent of s\.bossEntities\)[\s\S]*?ent\.hp = Math\.max\(0, ent\.hp - dmg\);[\s\S]*?hyperChargeCharge = clamp\(hyperChargeCharge \+ chargeGain \* 0\.7, 0, 100\);/],
  ['Stardust pickup grants HP heal, Super and Hypercharge charge', /stardustPickups[\s\S]*?hyperChargeCharge = clamp\(hyperChargeCharge \+ p\.charge \* 0\.8, 0, 100\);/],
  ['AOEDamage checks and damages living Ramage Boss units', /if \(isRamageBossMode && ramageBossState\?\.bossEntities && ownerId === player\.id\)[\s\S]*?ent\.hp = Math\.max\(0, ent\.hp - dealt\);/],
  ['renderRamageBossWorld renders 2.5D Ramage model in global space, stardust pickups, and shadow aura', /function renderRamageBossWorld\(ctx\)[\s\S]*?BraweRosterVisuals\.draw\(ctx, ent, ent\.y, 'ramage', null, now, ent\.isMegaBossRamage\)/],
  ['renderRamageBossHUD displays current stage, 1.0x-10.0x multiplier gauge, HP bar, and stats', /function renderRamageBossHUD\(ctx\)[\s\S]*?MEGA BOSS RAMAGE • STAGE[\s\S]*?MULTIPLIER:[\s\S]*?WEAVES:/],
  ['Results screen records Boss Battle victory, stages cleared, damage dealt, and best streak', /isRamageBossMode\) \{[\s\S]*?JUGGERNAUT OVERDRIVE CRUSHED![\s\S]*?Stages Cleared:/],
];

for (const [label, pattern] of checks) {
  assert.match(game, pattern, label);
}

console.log(`Mega Boss Ramage Battle regression: ${checks.length}/${checks.length} checks passed.`);
