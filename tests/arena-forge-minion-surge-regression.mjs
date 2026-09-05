import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const gameCode = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

test('Arena Forge Minion Surge modifier has 50% match chance', () => {
  assert.match(gameCode, /arenaForgeMinionSurgeModifier\s*=\s*Math\.random\(\)\s*<\s*0\.50/);
});

test('Arena Forge Guard Towers & Cores receive +200% HP (3x HP) when modifier is active', () => {
  assert.match(gameCode, /const hpMultiplier = arenaForgeMinionSurgeModifier \? 3\.0 : 1\.0/);
  assert.match(gameCode, /const hp = Math\.round\(baseHp \* hpMultiplier\)/);
});

test('Arena Forge Minion Surge has unlimited minion cap', () => {
  assert.match(gameCode, /if\s*\(!arenaForgeMinionSurgeModifier\)\s*{[\s\S]*?active\.length\s*>=\s*18/);
});

test('Arena Forge Minion Surge spawns 5 minions on every kill with +400% HP, +400% Speed, and 200% Attack Speed', () => {
  assert.match(gameCode, /if\s*\(arenaForgeMinionSurgeModifier\s*&&\s*scoringTeam\)/);
  assert.match(gameCode, /for\s*\(let i = 0; i < 5; i\+\+\)/);
  assert.match(gameCode, /isMinionSurgeUnit\s*=\s*true/);
  assert.match(gameCode, /minion\.hp\s*=\s*Math\.round\(minion\.hp\s*\*\s*5\.0\)/);
  assert.match(gameCode, /minion\.speed\s*=\s*minion\.speed\s*\*\s*5\.0/);
  assert.match(gameCode, /minion\.arenaForgeAttackSpeedMult\s*=\s*2\.0/);
});

test('Arena Forge renders ambient surge particles and lag-reduced viewport culling', () => {
  assert.match(gameCode, /Ambient Surge Particles Everywhere for Minion Surge matches/);
  assert.match(gameCode, /if\s*\(!isWorldVisualVisible\(t\.x,\s*drawY/);
  assert.match(gameCode, /⚡ 2X SPD/);
});
