import fs from 'node:fs';
import assert from 'node:assert/strict';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

const checks = [
  ['Legendary Hyperfusion skin registered', /'hyperfusion-fuser':\s*\{[\s\S]*?rarity:\s*'legendary'/],
  ['skin is marked as a Hyper transformation', /hyperTransform:\s*true/],
  ['skin has complete premium effects', /attackEffect:[\s\S]*?superEffect:[\s\S]*?spawnEffect:[\s\S]*?takedownEffect:[\s\S]*?deathEffect:/],
  ['custom Fuser roster portrait enabled', /brawlerId === 'fuser'[\s\S]*?'hyperfusion-fuser'/],
  ['custom portrait contains split fusion core', /fuser:\s*`[\s\S]*?hfCore/],
  ['in-match model checks active Hypercharge', /brawlerId === 'fuser'[\s\S]*?const transformed = entity === player \? !!isHypercharged : !!entity\.isHypercharged/],
  ['normal and transformed fighter palettes exist', /transformed \? '#54f5ff' : '#163d68'/],
  ['Fuser bullets bypass generic skin renderer', /b\.isClassyNote \|\| b\.isFuserBullet/],
  ['custom polarized projectile visual is wired', /activeSkinId === 'hyperfusion-fuser'[\s\S]*?const transformed=!!b\.hyperVisual/],
  ['original Fuser projectile fallback remains', /const accent=b\.hyperVisual\?'#e991ff'/],
  ['custom Core Breach takedown renders', /ex\.skinId === 'hyperfusion-fuser' && kind === 'takedown'[\s\S]*?CORE BREACH/],
  ['Training targets can preview takedowns', /target\.hp <= 0 && b\.ownerId === player\.id\)[\s\S]*?triggerSkinPulse\(target, takedownSkin, 'takedown'\)/],
  ['gameplay projectile hitbox remains unchanged', /ownerBrawler:\s*'fuser',\s*isFuserBullet:\s*true[\s\S]*?hitboxMod:\s*\.983/],
];

for (const [label, pattern] of checks) assert.match(game, pattern, label);
console.log(`Hyperfusion Fuser regression: ${checks.length}/${checks.length} checks passed.`);
