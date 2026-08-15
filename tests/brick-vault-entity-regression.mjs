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
assert.ok(!src.slice(src.indexOf('function initBrickVaultModeState'),src.indexOf('function getArenaForgeStructures')).includes('destructibleWalls.push'), 'vault initialization must not create HP walls');

console.log('Brick Vault entity and solid-wall regression checks passed.');
