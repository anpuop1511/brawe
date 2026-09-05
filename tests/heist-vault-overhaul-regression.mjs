import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const gameCode = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

test('Heist / Brick Vault has +10% boosted HP and Princess Tower safe tier', () => {
  assert.match(gameCode, /BRICK_VAULT_TIERS\s*=\s*\[49500,\s*88000,\s*55000\]/);
});

test('Heist Tactical Fortress layout provides cover barricades, corner bunkers, and bushes', () => {
  assert.match(gameCode, /wallType:\s*'heist_fortress'/);
  assert.match(gameCode, /buildBrickVaultMap/);
  assert.match(gameCode, /addBush/);
});

test('Heist initializes 4 High-Speed Flank Jump Pads with launch physics', () => {
  assert.match(gameCode, /heistJumpPads\s*=\s*\[/);
  assert.match(gameCode, /heist_pad_p_l/);
  assert.match(gameCode, /heist_pad_p_r/);
  assert.match(gameCode, /entity\.heistFlight/);
  assert.match(gameCode, /🚀 FLANK LAUNCH!/);
});

test('Princess Tower is protected by Citadel Energy Shield (70% damage reduction) while side vaults live', () => {
  assert.match(gameCode, /function getLivingSideVaultCount/);
  assert.match(gameCode, /dealtDamage\s*\*=\s*0\.30/);
  assert.match(gameCode, /🛡️ CITADEL SHIELD/);
});

test('Safe damage and destruction triggers Heist Gold Crystals & Super Wave Loot Rush', () => {
  assert.match(gameCode, /kind:\s*'heist_crystal'/);
  assert.match(gameCode, /💎 HEIST FRENZY!/);
  assert.match(gameCode, /⚡ \+35% SUPER WAVE!/);
});

test('Princess Tower triggers Castle Enrage (<40% HP) with radial wave and 3-arrow spread volleys', () => {
  assert.match(gameCode, /isEnraged\s*=\s*pv\.hp\s*<\s*\(pv\.maxHp\s*\*\s*0\.40\)/);
  assert.match(gameCode, /🏰 CASTLE ENRAGE!/);
  assert.match(gameCode, /\[baseAngle\s*-\s*0\.16,\s*baseAngle,\s*baseAngle\s*\+\s*0\.16\]/);
});

test('Heist Fever activates in final 45s with 1.5X vault damage bonus', () => {
  assert.match(gameCode, /heistFeverActive/);
  assert.match(gameCode, /🔥 HEIST FEVER/);
  assert.match(gameCode, /dealtDamage\s*\*=\s*1\.50/);
});

test('Heist renders dynamic HUD top bar with shield indicators and live status', () => {
  assert.match(gameCode, /pShielded\s*\?\s*'🛡️ SHIELDED'\s*:\s*'⚡ BREACHED'/);
  assert.match(gameCode, /eShielded\s*\?\s*'🛡️ SHIELDED'\s*:\s*'⚡ BREACHED'/);
});
