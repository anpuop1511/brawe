import assert from 'node:assert/strict';
import fs from 'node:fs';

const src=fs.readFileSync(new URL('../game.js',import.meta.url),'utf8');
const has=(s,m=s)=>assert.ok(src.includes(s),m);

has("brawler: 'brick_vault'");
has('isBrickVaultEntity: true');
has('isStructure: true');
has('noRespawn: true');
has("return bots.filter((entity) => entity && entity.isBrickVaultEntity");
has('if (target?.isBrickVaultEntity)');
has('if (bot.isBrickVaultEntity && dealt > 0) registerBrickVaultWallDamage');
has("const addWall = (x, y, w, h) => cubes.push({ x, y, w, h, isArenaWall: true, wallType: 'brick_vault_solid' });");
has('Vaults are combat entities now');
has('damageableObject = !!(dw.isPowerBox');
has('TOWER_POWER_VAULT_HP_MULTIPLIER = 4.5');
has("isTowerPowerVaultWeekendMatch = TOWER_POWER_SYSTEM_ENABLED && showdownMode === 'brick_vault' && isTowerPowerVaultWeekendActive()");
has('slopSushiActiveCards = getActiveSlopSushiDeck(selectedBrawler).map(card => card.id)');
has('bot.slopSushiCards = isTowerPowerVaultWeekendMatch');
has('Math.round(hp * vaultHpMultiplier)');
has('ALL 8 Tower Powers • vault HP +350%');
assert.ok(!src.slice(src.indexOf('function initBrickVaultModeState'),src.indexOf('function getArenaForgeStructures')).includes('destructibleWalls.push'), 'vault initialization must not create HP walls');

console.log('Brick Vault entity and solid-wall regression checks passed.');
