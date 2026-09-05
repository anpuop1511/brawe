import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const gameCode = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

test('Heist / Brick Vault has +10% boosted HP and Princess Tower safe tier', () => {
  assert.match(gameCode, /BRICK_VAULT_TIERS\s*=\s*\[49500,\s*88000,\s*55000\]/);
});

test('Heist / Brick Vault mode clears all walls for open arena battle', () => {
  assert.match(gameCode, /destructibleWalls\.length\s*=\s*0/);
  assert.match(gameCode, /cubes\s*=\s*cubes\.filter\(c\s*=>\s*!c\.wallType/);
});

test('Heist spawns 3 safes per team including Princess Tower safe', () => {
  assert.match(gameCode, /isPrincessVault:\s*isPrincess/);
  assert.match(gameCode, /princessLockTargetId/);
  assert.match(gameCode, /princessLockConsecutive/);
});

test('Heist Princess Tower accelerates fire rate on continuous target lock', () => {
  assert.match(gameCode, /function updateBrickVaultPrincessSystems/);
  assert.match(gameCode, /Math\.max\(70,\s*480\s*-\s*rampLevel\s*\*\s*35\)/);
  assert.match(gameCode, /isBrickVaultPrincessArrow:\s*true/);
  assert.match(gameCode, /isKingPrincessArrow:\s*true/);
});

test('Heist AI has smart defense priority and target coordination', () => {
  assert.match(gameCode, /highThreatEnemy/);
  assert.match(gameCode, /distToVault\s*<=\s*580/);
  assert.match(gameCode, /isHighDps/);
  assert.match(gameCode, /bestEnemySafeTarget/);
});

test('Heist Princess Tower renders royal battlements, crown, and lock laser', () => {
  assert.match(gameCode, /PRINCESS TOWER/);
  assert.match(gameCode, /RAMP SPEED/);
});
