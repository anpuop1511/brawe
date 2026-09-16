import fs from 'node:fs';
import assert from 'node:assert/strict';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

const checks = [
  ['Boss Battle registered in HOME_MODE_CARDS', /\['demon_villains_boss',\s*'😈',\s*'Boss Battle: Possessed Villains'/],
  ['Demon Villains Boss in HOME_PERMANENT_MODE_IDS', /HOME_PERMANENT_MODE_IDS\s*=\s*\[[^\]]*'demon_villains_boss'/],
  ['Boss Battle rules in HOME_MODE_RULES with 4 Waves and animated storytelling', /demon_villains_boss:\s*\[[\s\S]*?Story Boss Battle: Demon has possessed the 6 Villains![\s\S]*?Animated Storytelling Cutscenes[\s\S]*?Face 4 Waves/],
  ['Boss Battle rewards in HOME_EVENT_REWARDS', /demon_villains_boss:\s*\{\s*type:\s*'coins',\s*amount:\s*100/],
  ['Mode color and SOLO tag in syncHomeModeCards', /demon_villains_boss:\s*'#d44763'[\s\S]*?id === 'demon_villains_boss'[\s\S]*?tag\s*=\s*'SOLO'/],
  ['Mode runtime flag isDemonVillainsBossMode initialized', /let isDemonVillainsBossMode = false;\s*let demonVillainsBossState = null;/],
  ['isPowerPlayModifierActive helper defined for Demon Villains Boss', /if \(isDemonVillainsBossMode && demonVillainsBossState\?\.hasPowerPlayModifier\) \{[\s\S]*?return true;/],
  ['generatePowerBoxes explicitly excludes isDemonVillainsBossMode', /isTugZoneMode \|\| .*isDemonVillainsBossMode/],
  ['spawnBots returns early for isDemonVillainsBossMode', /if \(isDuels \|\| isTraining \|\| isBlinkEyeDodgeMode \|\| .*isDemonVillainsBossMode.*\) return;/],
  ['spawnBots sets enemyCount = 0 for isDemonVillainsBossMode', /(?:if|else if) \(isDemonVillainsBossMode\) enemyCount = 0;/],
  ['Storm check excludes isDemonVillainsBossMode', /!isDemonVillainsBossMode && !isRamageBossMode/],
  ['launchShowdownMatch clears power cubes & powerups and inits Demon Villains Boss state', /isDemonVillainsBossMode = showdownMode === 'demon_villains_boss';[\s\S]*?player\.powerCubes = 0;[\s\S]*?powerups\.length = 0;[\s\S]*?cubes\.length = 0;[\s\S]*?initDemonVillainsBossState\(\);/],
  ['buildDemonVillainsBossMap builds arena with obsidian obelisks and runic altars', /function buildDemonVillainsBossMap\(\) \{[\s\S]*?destructibleWalls\.length = 0;[\s\S]*?addArenaWallStrip[\s\S]*?wallType:\s*'colosseum_pillar'/],
  ['spawnDemonVillainsBossAct features 4 Acts: Vanguards, Steel, Shadows, and Demon Overlord', /function spawnDemonVillainsBossAct\(actNumber = 1\) \{[\s\S]*?ACT 1: THE CORRUPTED VANGUARDS[\s\S]*?bouncin_balls[\s\S]*?outlit[\s\S]*?ACT 2: STEEL & INFERNAL CINDERS[\s\S]*?steamer[\s\S]*?axeywaxy[\s\S]*?ACT 3: SHADOWS & SPECTRAL CHAOS[\s\S]*?kage[\s\S]*?chaird[\s\S]*?ACT 4: DEMON UNLEASHED - THE GRAND PUPPETEER[\s\S]*?demon_overlord/],
  ['initDemonVillainsBossState sets Act 1, dialogue and Power Play modifier', /function initDemonVillainsBossState\(\) \{[\s\S]*?act:\s*1,[\s\S]*?actTitle:\s*'THE CORRUPTED VANGUARDS'[\s\S]*?hasPowerPlayModifier:\s*true/],
  ['Player bullet collisions damage Boss units and grant Super and Hypercharge', /for \(const ent of s\.bossEntities\)[\s\S]*?ent\.hp = Math\.max\(0, ent\.hp - dmg\);[\s\S]*?hyperChargeCharge = clamp\(hyperChargeCharge \+ chargeGain \* 0\.8, 0, 100\);/],
  ['Demonic Soul pickups heal player and charge Super and Hypercharge', /soulPickups[\s\S]*?player\.hp = Math\.min\(player\.maxHp \|\| 4500, player\.hp \+ 1200\);[\s\S]*?hyperChargeCharge = clamp\(hyperChargeCharge \+ 20, 0, 100\);/],
  ['Marionette puppet threads rendered in renderDemonVillainsBossWorld', /function renderDemonVillainsBossWorld\(ctx\)[\s\S]*?DEMON PUPPETEER[\s\S]*?quadraticCurveTo/],
  ['Comic story dialogue banner rendered in renderDemonVillainsBossWorld', /activeDialogue[\s\S]*?speaker[\s\S]*?subtext/],
  ['renderDemonVillainsBossHUD displays Act, Health bar, Purified count, and Stats', /function renderDemonVillainsBossHUD\(ctx\)[\s\S]*?DEMONIC RETRIBUTION • ACT[\s\S]*?PURIFIED:[\s\S]*?TOTAL DMG:/],
  ['Results screen records Boss Battle victory, acts cleared, and Chapter 2 teaser', /isDemonVillainsBossMode\) \{[\s\S]*?DEMON OVERLORD SHATTERED![\s\S]*?Acts Cleared:/]
];

for (const [label, pattern] of checks) {
  assert.match(game, pattern, label);
}

console.log(`Demon Villains Boss Battle regression: ${checks.length}/${checks.length} checks passed.`);
