import fs from 'node:fs';
import assert from 'node:assert/strict';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

assert.match(game, /function getMovementRelativeProjectileVelocity\(entity,angle,baseSpeed\)/,
  'shared movement-relative projectile helper exists');
assert.match(game, /entity\?\.projectileMotionVx/,
  'projectile helper uses the player movement sample');
assert.match(game, /player\.projectileMotionVx = \(player\.x - movementStartX\) \/ dt/,
  'player movement records actual world velocity');
assert.match(game, /shotVelocity=getMovementRelativeProjectileVelocity\(fromEntity,shotAng,baseSpeed\)/,
  "Bouncin' Balls main volley inherits fighter movement");
assert.match(game, /shotVelocity=getMovementRelativeProjectileVelocity\(player,volleyAngle,speed\)/,
  "Bouncin' Balls Super volley inherits fighter movement");

// A moving shooter and every ball share the same movement component, so the
// interval between delayed shots remains projectileSpeed * delay regardless of
// whether the fighter runs with or against the firing direction.
const projectileSpeed = 540;
const shotDelay = 0.088;
for (const shooterVelocity of [-320, -180, 0, 180, 320]) {
  const firstAtSecondShot = (projectileSpeed + shooterVelocity) * shotDelay;
  const secondSpawn = shooterVelocity * shotDelay;
  assert.ok(Math.abs((firstAtSecondShot - secondSpawn) - projectileSpeed * shotDelay) < 1e-9,
    `spacing remains stable at shooter velocity ${shooterVelocity}`);
}

console.log('movement-relative volley regression checks passed');
