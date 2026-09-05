import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const gameCode = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

test('Arena Forge Minion Surge modifier has 50% match chance', () => {
  assert.match(gameCode, /arenaForgeMinionSurgeModifier\s*=\s*Math\.random\(\)\s*<\s*0\.50/);
});

test('Arena Forge Minion Surge spawns 5 minions at back of base on every kill', () => {
  assert.match(gameCode, /if\s*\(arenaForgeMinionSurgeModifier\s*&&\s*scoringTeam\)/);
  assert.match(gameCode, /for\s*\(let i = 0; i < 5; i\+\+\)/);
  assert.match(gameCode, /isMinionSurgeUnit\s*=\s*true/);
});

test('Surge minions receive 250% HP and 200% Attack Speed', () => {
  assert.match(gameCode, /minion\.hp\s*=\s*Math\.round\(minion\.hp\s*\*\s*2\.5\)/);
  assert.match(gameCode, /minion\.arenaForgeAttackSpeedMult\s*=\s*2\.0/);
  assert.match(gameCode, /cooldown\s*=\s*\([\s\S]*?\)\s*\/\s*atkSpdMult/);
});

test('Active minion cap increases to 36 when Minion Surge modifier is active', () => {
  assert.match(gameCode, /maxActive\s*=\s*arenaForgeMinionSurgeModifier\s*\?\s*36\s*:\s*18/);
});

test('Minion Surge modifier renders visual aura, 2X SPD indicator, and HUD badge', () => {
  assert.match(gameCode, /⚡ 2X SPD/);
  assert.match(gameCode, /MODIFIER: MINION SURGE/);
});
