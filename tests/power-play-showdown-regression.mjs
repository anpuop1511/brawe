import fs from 'node:fs';
import assert from 'node:assert/strict';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

const checks = [
  ['Power Play Showdown registered in HOME_MODE_CARDS', /\['power_play_showdown',\s*'⚡',\s*'Power Play Showdown'/],
  ['Power Play Showdown registered in HOME_PERMANENT_MODE_IDS', /HOME_PERMANENT_MODE_IDS\s*=\s*\[[^\]]*'power_play_showdown'/],
  ['Power Play Showdown rules defined in HOME_MODE_RULES', /power_play_showdown:\s*\[[\s\S]*?12-player Solo Battle Royale with Power Cubes/],
  ['Power Play Showdown spawns 11 enemy bots (12 players total per match)', /if \(isPowerPlayShowdownMode\) enemyCount = 11;/],
  ['Power Play Showdown rewards defined in HOME_EVENT_REWARDS', /power_play_showdown:\s*\{\s*type:'coins',\s*amount:60/],
  ['Curated brawlers set defined with Decayer', /const POWER_PLAY_BRAWLERS = new Set\(\['blinkeye',\s*'fuser',\s*'rocketeer',\s*'bouncin_balls',\s*'echo',\s*'orbo',\s*'decayer'\]\);/],
  ['Mode runtime flag isPowerPlayShowdownMode initialized', /let isPowerPlayShowdownMode = false;/],
  ['launchShowdownMatch activates isPowerPlayShowdownMode and enforces curated brawler', /isPowerPlayShowdownMode = showdownMode === 'power_play_showdown';[\s\S]*?!POWER_PLAY_BRAWLERS\.has\(selectedBrawler\)/],
  ['Bot pool restricted to curated brawlers in power play showdown', /if \(isPowerPlayShowdownMode\) \{[\s\S]*?const ppPool = \[\.\.\.POWER_PLAY_BRAWLERS\]/],
  
  // BlinkEye 3 Powers
  ['BlinkEye Power 1: infinite bounces in Power Play Showdown', /!isPowerPlayShowdownMode && b\.blinkeyeBounceCount > 2/],
  ['BlinkEye Power 2: 2x missile fire rate (300ms) and functional line of sight check', /function segmentIntersectsAABB[\s\S]*?const interval = isPowerPlayShowdownMode \? 300 : 600;/],
  ['BlinkEye Power 3: main attack homing in Power Play Showdown', /isPowerPlayShowdownMode && b\.ownerBrawler === 'blinkeye' && b\.isBlinkEyeMain/],

  // Fuser 3 Powers
  ['Fuser Power 1: size +200% (hitboxMod 3.0) and slow creeping speed (180)', /const fuserSpd = isPowerPlayShowdownMode \? 180 : 1140;[\s\S]*?const fuserHitbox = isPowerPlayShowdownMode \? 3\.0 :/],
  ['Fuser Power 2: Super infinite range (maxLife 10.0)', /maxLife:isPowerPlayShowdownMode\?10\.0:1\.08/],
  ['Fuser Power 3: universal phasing pierce on main attack', /const fuserPierce = isPowerPlayShowdownMode \? true : false;[\s\S]*?pierce: fuserPierce, pierceWalls: fuserPierce/],

  // Rocketeer 3 Powers
  ['Rocketeer Power 1: Fire zone size +200% (3x radius)', /function spawnRocketeerFireZone[\s\S]*?if \(isPowerPlayShowdownMode\) radius \*= 3;/],
  ['Rocketeer Power 2: Super +4 extra fire zones', /const strikeCount = 3 \+ \(isPowerPlayShowdownMode \? 4 : 0\)/],
  ['Rocketeer Power 3: permanent active hypercharge in Power Play Showdown', /\(selectedBrawler === 'rocketeer' \|\| player\.brawler === 'rocketeer'\) && player\.hp > 0[\s\S]*?isHypercharged = true;[\s\S]*?hyperchargeUntil = now \+ 999999;/],

  // Bouncin Balls 3 Powers
  ['Bouncin Balls Power 1: 2x ball speed in Power Play Showdown', /\* \(isPowerPlayShowdownMode \? 2\.0 : 1\.0\)/],
  ['Bouncin Balls Power 2: Super +8 extra balls (16 total) for player & bot', /const balls = \(hc \? 10 : 7\) \+ \(isPowerPlayShowdownMode \? 8 : 0\);/],
  ['Bouncin Balls Power 3: Turret fire interval 0.3s (300ms) with 2x ball speed', /const turretInterval = isPowerPlayShowdownMode \? 300 : 1800;[\s\S]*?const ballSpeedMult = isPowerPlayShowdownMode \? 2\.0 : 1\.0;/],

  // Echo 3 Powers
  ['Echo Power 1: traveling sonic pulse rings every 0.6s', /if \(isPowerPlayShowdownMode && b\.ownerBrawler === 'echo' && b\.isEchoRingProj && !b\.super\) \{[\s\S]*?now - b\.lastEchoRingPulse >= 600/],
  ['Echo Power 2: 5-second 360-degree sonic burst', /now - echoEnt\.lastEcho360Burst >= 5000[\s\S]*?360° SONIC BURST!/],
  ['Echo Power 3: Super rings 200% bigger (4.5x size mod)', /ringSizeMod: isPowerPlayShowdownMode \? 4\.5 : 1\.5/],

  // Orbo 3 Powers
  ['Orbo Power 1: main attack +10 extra wide orbs (14-16 total) with 2x amplitude', /const count = \(hyperMain \? 6 : 4\) \+ \(isPowerPlayShowdownMode \? 10 : 0\);[\s\S]*?const amplitude = \(dense \? 72 : 54\) \* \(isPowerPlayShowdownMode \? 2\.0 : 1\.0\);/],
  ['Orbo Power 2: Super bouncy and infinite range (maxLife 12.0s, canBounce true)', /maxLife: isPowerPlay \? 12\.0 : \(edgeDistance \/ speed\)[\s\S]*?canBounce: !*isPowerPlay/],
  ['Orbo Power 3: Super auto-charges over 8 seconds in update loop', /const chargeDelta = \(100 \/ 8\) \* dt;[\s\S]*?superCharge = clamp\(superCharge \+ chargeDelta, 0, 100\);/],

  // Decayer 3 Powers
  ['Decayer Power 1: movement generates +100 HP shield 100% faster (100ms interval)', /now - player\.lastDecayerMoveShield >= 100[\s\S]*?grantShield\(player,\s*100,\s*decayerShieldCap\);/],
  ['Decayer Power 2: shield cap increased by 150% (12500 HP max)', /const decayerShieldCap = 12500;/],
  ['Decayer Power 3: main attack size +200% (hitboxMod 3.0)', /const decayerHitbox = isPowerPlayShowdownMode \? 3\.0 : 1\.0;[\s\S]*?hitboxMod: decayerHitbox/],
];

for (const [label, pattern] of checks) {
  assert.match(game, pattern, label);
}

console.log(`Power Play Showdown regression: ${checks.length}/${checks.length} checks passed.`);
