import fs from 'node:fs';
import assert from 'node:assert/strict';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

const checks = [
  ['Fuser main attack fires 12 bullets', /for \(let shot = 0; shot < 12; shot\+\+\)/],
  ['Fuser main attack sequence locks for 11*delay', /lockMainAttackSequence\(fromEntity, 11 \* delay, now\)/],
  ['Fuser main attack delay is 96ms base and 41ms hyper', /const delay = hyper \? 41 : 96;/],
  ['Fuser player super hitboxMod is 1.75', /ownerBrawler:'fuser',isFuserBullet:true[\s\S]*?hitboxMod:1\.75,hyperVisual:isHypercharged/],
  ['Fuser bot super hitboxMod is 1.75', /ownerBrawler:'fuser',isFuserBullet:true[\s\S]*?hitboxMod:1\.75,hyperVisual:hyper/],
  ['Fuser super aim indicator width is 45 base and 25 hypercharged', /halfWidth=isHypercharged\?25:45;/],
  ['Fuser super projectile renderer core radius is 9.8', /coreR=isSuperShot\?9\.8:4\.1/],
  ['Fuser hyperfusion super projectile line width is 11.2', /ctx\.lineWidth=isSuperShot\?11\.2:5/],
  ['Fuser default super projectile line width is 8.4', /ctx\.lineWidth=isSuperShot\?8\.4:3/],
  ['Fuser brawlerData description reflects twelve-round burst and +50% faster unload', /Fires 12 rapid bullets with 30% larger hitboxes in alternating parallel left and right lanes with \+50% faster unload/],
  ['Fuser brawlerData super description reflects massive +40% size', /Fires 8 massive piercing bullets with \+40% size that break through walls/],
];

for (const [label, pattern] of checks) {
  assert.match(game, pattern, label);
}

console.log(`Fuser buff regression: ${checks.length}/${checks.length} checks passed.`);
