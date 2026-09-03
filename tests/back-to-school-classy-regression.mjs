import fs from 'node:fs';
import assert from 'node:assert/strict';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

const checks = [
  ['Legendary skin registration', /'back-to-school-classy':\s*\{[\s\S]*?rarity:\s*'legendary'/],
  ['Back to School Classy display name', /name:\s*'Back to School Classy'/],
  ['school skin has a permanent shop offer', /'back-to-school-classy':[\s\S]*?isAlwaysAvailable:\s*true/],
  ['school attack and Super effects', /attackEffect:\s*\{\s*type:\s*'honorRollNote'[\s\S]*?superEffect:\s*\{\s*type:\s*'lockerSpeaker'/],
  ['school spawn, takedown, and defeat effects', /spawnEffect:\s*\{\s*type:\s*'schoolBellSpawn'[\s\S]*?takedownEffect:\s*\{\s*type:\s*'perfectGrade'[\s\S]*?deathEffect:\s*\{\s*type:\s*'dismissalBell'/],
  ['custom roster portrait when equipped', /brawlerId === 'classy' && getActiveSkinForBrawler\('classy'\)\?\.id === 'back-to-school-classy'/],
  ['custom 2.5D match model', /brawlerId === 'classy'[\s\S]*?'back-to-school-classy'[\s\S]*?A\+/],
  ['custom locker speaker rendering', /isSchoolClassy[\s\S]*?CLASSY 101/],
  ['custom report-card projectile rendering', /b\.isClassyNote[\s\S]*?activeSkinId === 'back-to-school-classy'[\s\S]*?grade/],
  ['generic renderer preserves Classy notes', /b\.isRocketeerMini \|\| b\.isClassyNote/],
  ['custom Legendary school pulse', /ex\.skinId === 'back-to-school-classy'[\s\S]*?DISMISSED[\s\S]*?1ST BELL/],
];

for (const [label, pattern] of checks) assert.match(game, pattern, label);
console.log(`Back to School Classy regression: ${checks.length}/${checks.length} checks passed.`);
