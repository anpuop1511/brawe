import assert from 'node:assert/strict';
import fs from 'node:fs';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const bootstrap = fs.readFileSync(new URL('../bootstrap.js', import.meta.url), 'utf8');

assert.match(html, /option value="mageny">Mageny \(Exotic\)/, 'Mageny appears in fighter selection');
assert.match(game, /'mageny': \{[\s\S]*name: 'Mageny'[\s\S]*role: 'Controller'/, 'Mageny metadata is registered');
assert.match(game, /const chargeRatio = clamp\(elapsed \/ maxChargeMs, 0, 1\.0\)/, 'manual charging reaches the exact zero-charge minimum');
assert.match(game, /const botChargeRatio = clamp\(\(targetDistance - 260\) \/ 520, 0, 1\)/, 'bots choose charge from engagement range');
assert.match(game, /function activateMagenyRepulsion[\s\S]*clearMagenyRepulsionHazards/, 'Repulsion Shield activates directly and clears hazards');
assert.match(game, /curBrawler === 'mageny' && curGadget === 'g2'[\s\S]{0,220}activateMagenyRepulsion\(player\)/, 'player G2 is instant');
assert.match(game, /bot\.brawler === 'mageny' && g === 'g1'[\s\S]{0,300}bot\.brawler === 'mageny' && g === 'g2'/, 'bots support both Mageny gadgets');
assert.match(game, /magnetOwner && otherOwner && areAlliedEntities\(magnetOwner, otherOwner\)/, 'main aura preserves allied projectiles without relying on optional bullet team fields');
assert.doesNotMatch(game, /if \(!b \|\| b\.isMagenyMagnet\) continue;/, 'vortexes may capture Mageny projectiles');
assert.match(game, /tb\.damage = Math\.max\(0, \(Number\(tb\.damage\) \|\| 0\) \* 0\.80\)/, 'released projectiles return at 80% damage');
assert.match(game, /magenyResidualSlowUntil[\s\S]*baseSlow = Math\.min\(baseSlow, 0\.70\)/, 'Residual Charge applies its exact 30% slow');
assert.match(game, /applyNonProjectileStructureDamage\(zoneOwner, z\.x, z\.y, z\.radius, z\.detonationDamage \|\| 1800\)/, 'vortex detonation damages power boxes and enemy vaults at the zone damage value');
assert.match(game, /1250 \+ chargeRatio \* 1200/, 'Magnetic Flux scales from 1250 to 2450 damage');
assert.match(game, /\(75 \+ chargeRatio \* 35\) \* 1\.50 \* \(g1Armed \? 1\.15 : 1\.0\)/, 'main magnetic aura is 50% larger and G1 adds 15%');
assert.match(game, /const slowPct = hasSp1 \? 0\.50 : 0\.30/, 'projectile slow is 30% base and 50% with Heavy Flux');
assert.match(bootstrap, /const RELEASE_TOKEN = '20260901-forge-respawn-results1'/, 'fresh runtime token loads the updated game');

console.log('Mageny registration and mechanic wiring regression checks passed.');
