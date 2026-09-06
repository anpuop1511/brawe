import fs from 'node:fs';
import assert from 'node:assert/strict';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

const checks = [
  ['Fuser main attack fires 18 bullets', /for \(let shot = 0; shot < 18; shot\+\+\)/],
  ['Fuser main attack sequence locks for 17*delay', /lockMainAttackSequence\(fromEntity, 17 \* delay, now\)/],
  ['Fuser main attack delay is 96ms base and 41ms hyper', /const delay = hyper \? 41 : 96;/],
  ['Fuser main attack projectile speed is 1140 (+50%)', /vx: Math\.cos\(ang\) \* 1140, vy: Math\.sin\(ang\) \* 1140/],
  ['Fuser main attack damage is 245 player / 165 bot (-30%)', /damage: Math\.round\(\(isBot \? 165 : 245\) \* \(reverse \? 1\.2 : 1\)\)/],
  ['Fuser player super fires 14 bullets', /selectedBrawler === 'fuser'[\s\S]*?for\(let shot=0;shot<14;shot\+\+\)/],
  ['Fuser bot super fires 14 bullets', /bot\.brawler === 'fuser'[\s\S]*?for\(let shot=0;shot<14;shot\+\+\)/],
  ['Fuser super projectile speed is 1380 (+50%)', /vx:Math\.cos\(ang\)\*1380,vy:Math\.sin\(ang\)\*1380/],
  ['Fuser player super damage is 420 (-30%)', /damage:420,pierce:true,pierceWalls:true,breakWallsInstantly:true,ownerId:player\.id/],
  ['Fuser bot super damage is 280 (-30%)', /damage:280,pierce:true,pierceWalls:true,breakWallsInstantly:true,ownerId:bot\.id/],
  ['Fuser player super hitboxMod is 2.45 (+40% buff)', /ownerBrawler:'fuser',isFuserBullet:true[\s\S]*?hitboxMod:2\.45,hyperVisual:isHypercharged/],
  ['Fuser bot super hitboxMod is 2.45 (+40% buff)', /ownerBrawler:'fuser',isFuserBullet:true[\s\S]*?hitboxMod:2\.45,hyperVisual:hyper/],
  ['Fuser super aim indicator width is 63 base and 35 hypercharged', /halfWidth=isHypercharged\?35:63;/],
  ['Fuser super projectile renderer core radius is 13.7', /coreR=isSuperShot\?13\.7:4\.1/],
  ['Fuser hyperfusion super projectile line width is 15.7', /ctx\.lineWidth=isSuperShot\?15\.7:5/],
  ['Fuser default super projectile line width is 11.8', /ctx\.lineWidth=isSuperShot\?11\.8:3/],
  ['Fuser brawlerData description reflects eighteen-round burst and +50% projectile speed', /Fires 18 rapid bullets with 30% larger hitboxes in alternating parallel left and right lanes with \+50% faster unload and \+50% projectile speed/],
  ['Fuser brawlerData super description reflects 14 massive bullets and +50% projectile speed', /Fires 14 massive piercing bullets \(\+96% total size\) that break through walls with \+50% projectile speed/],
];

for (const [label, pattern] of checks) {
  assert.match(game, pattern, label);
}

console.log(`Fuser buff regression: ${checks.length}/${checks.length} checks passed.`);
