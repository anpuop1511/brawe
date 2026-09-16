import assert from 'node:assert/strict';
import fs from 'node:fs';

const game=fs.readFileSync(new URL('../game.js',import.meta.url),'utf8');

assert.match(game,/OUTLIT_SUPER_WALL_CHAIN_MULTIPLIERS = Object\.freeze\(\[0\.90, 0\.80, 0\.70, 0\.60, 0\.50\]\)/,'wall chain uses the requested five diminishing damage steps');
assert.match(game,/function fireOutlitBoomBreak[\s\S]{0,900}for \(const offset of \[-0\.115, 0, 0\.115\]\)/,'Boom Break fires three separated pellets');
assert.match(game,/function fireOutlitBoomBreak[\s\S]{0,1800}hitboxMod: 2\.05/,'Boom Break pellets use the larger hitbox');
assert.match(game,/outlitSuperRework[\s\S]{0,520}target\.ghoulPushVX[\s\S]{0,220}ghoulPushUntil/,'Boom Break applies smooth knockback through the shared displacement integrator');
assert.match(game,/function damageOutlitWallChain[\s\S]{0,2600}outlitWallChains\.push/,'wall damage creates a visible electric chain');
assert.match(game,/const damageableObject = !!\(dw\.isArenaWall/,'metal arena walls are globally damageable');
assert.match(game,/function applyNonProjectileStructureDamage[\s\S]{0,900}wall\?\.isArenaWall/,'non-projectile brawlers can also damage metal walls');
assert.doesNotMatch(game,/ownerBrawler:\s*'outlit'[\s\S]{0,500}breakWallsInstantly:true/,'Outlit no longer bypasses the chain rework with instant wall deletion');

console.log('Outlit Super + breakable metal wall regression checks passed.');
