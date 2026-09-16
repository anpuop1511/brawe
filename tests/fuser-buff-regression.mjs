import fs from 'node:fs';
import assert from 'node:assert/strict';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

const checks = [
  ['Fuser main attack fires 8 bullets', /for \(let shot = 0; shot < 8; shot\+\+\)/],
  ['Fuser main attack sequence locks for 7*delay', /lockMainAttackSequence\(fromEntity, 7 \* delay, now\)/],
  ['Fuser main attack delay is 58ms base and 30ms hyper', /const delay = hyper \? 30 : 58;/],
  ['Fuser main attack projectile speed is 1596 (+40% faster speed)', /const fuserSpd = isPowerPlayModifierActive\(fromEntity\) \? 252 : 1596;[\s\S]*?vx: Math\.cos\(ang\) \* fuserSpd, vy: Math\.sin\(ang\) \* fuserSpd/],
  ['Fuser main range is 560 and mutation adds 12%', /const fuserRange = 560 \* \(isFuserMutation \? 1\.12 : 1\);[\s\S]*?const fuserLife = isPowerPlayModifierActive\(fromEntity\) \? 4\.5 : \(fuserRange \/ fuserSpd\);/],
  ['Fuser main attack spread is slightly wider (22 / 7)', /const lateral = side \* \(hyper \? 7 : 22\);/],
  ['Fuser main attack aim telegraph matches mutation range and lane offsets', /const laneOffset=hyper\?7:22,range=560\*\(mutationReady\?1\.12:1\),perp=ang\+Math\.PI\/2;/],
  ['Fuser main projectiles are 50% larger', /const fuserHitbox = \(isPowerPlayModifierActive\(fromEntity\) \? 3\.0 : \.983\) \* 1\.50;/],
  ['Fuser main projectile visuals are 50% larger', /hitboxMod: fuserHitbox, fuserVisualScale: 1\.50/],
  ['Fuser main attack damage is 235 player / 158 bot', /damage: Math\.round\(\(isBot \? 158 : 235\) \* \(reverse \? 1\.2 : 1\)\)/],
  ['Fuser player super fires 15 bullets (+1 bullet)', /selectedBrawler === 'fuser'[\s\S]*?for\(let shot=0;shot<15;shot\+\+\)/],
  ['Fuser bot super fires 15 bullets (+1 bullet)', /bot\.brawler === 'fuser'[\s\S]*?for\(let shot=0;shot<15;shot\+\+\)/],
  ['Fuser super shoots down the lines with 19.2 base and 26.88 HC spread (+40%)', /lateral=side\*\(isHypercharged\?26\.88:19\.2\)/],
  ['Fuser super projectile speed is 1380 (+50%)', /vx:Math\.cos\(ang\)\*1380,vy:Math\.sin\(ang\)\*1380/],
  ['Fuser player super damage is 420 (-30%)', /damage:420,pierce:true,pierceWalls:true,breakWallsInstantly:true,ownerId:player\.id/],
  ['Fuser bot super damage is 280 (-30%)', /damage:280,pierce:true,pierceWalls:true,breakWallsInstantly:true,ownerId:bot\.id/],
  ['Fuser player super hitboxMod is reduced by 50% (1.225)', /ownerBrawler:'fuser',isFuserBullet:true[\s\S]*?hitboxMod:1\.225,hyperVisual:isHypercharged/],
  ['Fuser bot super hitboxMod is reduced by 50% (1.225)', /ownerBrawler:'fuser',isFuserBullet:true[\s\S]*?hitboxMod:1\.225,hyperVisual:hyper/],
  ['Fuser super aim indicator width matches super lines (19.2 base and 26.88 hyper)', /halfWidth=isHypercharged\?26\.88:19\.2;/],
  ['Fuser super projectile renderer core radius is reduced by 50% (6.85)', /coreR=\(isSuperShot\?6\.85:4\.1\)/],
  ['Fuser hyperfusion super projectile line width is reduced by 50% (7.85)', /ctx\.lineWidth=isSuperShot\?7\.85:5/],
  ['Fuser default super projectile line width is reduced by 50% (5.9)', /ctx\.lineWidth=isSuperShot\?5\.9:3/],
  ['Fuser mutation is unlocked by default', /if \(!playerData\.specialAbilities\.mutation\.fuser\) playerData\.specialAbilities\.mutation\.fuser = \{ pieces: 3, unlocked: true \};/],
  ['Four normal attacks arm exactly two mutation volleys', /const FUSER_MUTATION_TRIGGER_ATTACKS = 4;[\s\S]*?const FUSER_MUTATION_POWERED_VOLLEYS = 2;[\s\S]*?entity\.fuserMutationEmpoweredRemaining = FUSER_MUTATION_POWERED_VOLLEYS;/],
  ['Each of the next two attacks consumes one armed mutation volley', /if \(entity\.fuserMutationEmpoweredRemaining > 0\) \{[\s\S]*?entity\.fuserMutationEmpoweredRemaining--;[\s\S]*?return true;/],
  ['Mutation curves throughout flight at 60% reduced strength', /if \(b\.ownerBrawler === 'fuser' && b\.isFuserBullet && b\.isFuserMutation\) \{[\s\S]*?let closestDist = 460;[\s\S]*?const steerRate = 8\.0;[\s\S]*?-steerRate \* dt, steerRate \* dt/],
  ['Fuser Super telegraph reports all 15 projectiles', /15 PIERCING SHOTS • RETURN[\s\S]*?15 PIERCING SHOTS • BREAKS WALLS/],
];

for (const [label, pattern] of checks) {
  assert.match(game, pattern, label);
}

console.log(`Fuser nerf & overhaul regression: ${checks.length}/${checks.length} checks passed.`);
