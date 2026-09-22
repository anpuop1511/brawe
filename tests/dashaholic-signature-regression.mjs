import assert from 'node:assert/strict';
import fs from 'node:fs';
const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

assert.match(game, /dashaholic:\s*\{\s*type:\s*'signature',[\s\S]{0,160}Afterimage Protocol/, 'Dashaholic registers Afterimage Protocol');
assert.match(game, /DASHAHOLIC_SIGNATURE_COOLDOWN_MS = 15000/, 'Signature has a 15 second cooldown');
assert.match(game, /Math\.min\(1200, Math\.max\(0, entity\.hp - 1\)\)/, 'Signature costs up to 1200 HP without self-elimination');
assert.match(game, /if \(brawlerId === 'dashaholic'\) return 2;/, 'Dashaholic stores two Super uses');
assert.match(game, /dataset\.superUsesLabel = `\$\{uses\}\/\$\{maxUses\} USES`/, 'Super HUD exposes stored uses');
assert.match(game, /isDashSlash:[\s\S]{0,500}maxLife: isHyper \? 0\.44 : 0\.3[\s\S]{0,250}hitboxMod: isHyper \? 10\.0 : 8\.0/, 'Hyper Crosscut is longer and wider than the normal Claw Slash');
assert.match(game, /dashAfterimageReturn: isHyper, dashAfterimageReturning: false/, 'Hyper Crosscut arms exactly one returning afterimage');
assert.match(game, /b\.damage = Math\.round\(\(b\.dashAfterimageBaseDamage \|\| b\.damage \|\| 0\) \* 0\.55\)/, 'Returning afterimage deals 55% damage');
assert.match(game, /b\.dashAfterimageReturning = true;[\s\S]{0,220}b\.hitIds = \{\};/, 'Returning afterimage can hit targets independently of the outbound pass');
assert.doesNotMatch(game, /for\(let side of \[-1, 1\]\)[\s\S]{0,400}ownerBrawler: 'dashaholic'/, 'Old three-projectile Hyper fan is retired');
assert.match(game, /const radius = b\.hitboxMod >= 10 \? 38 : \(b\.hitboxMod >= 8 \? 30/, 'Claw Slash visuals scale with the larger Hyper hitbox');
assert.match(game, /const dist = Math\.min\(Math\.hypot\(dx, dy\), 600\);[\s\S]{0,100}player\.isDashing = true;/, 'Player Super dash range is capped at 600');
assert.match(game, /POWER MOVE · \$\{hudSuperUses\}\/2 USES/, 'Canvas Power Move HUD displays stored uses');
assert.match(game, /SIGNATURE \(R\) · \$\{signatureState\.label\}/, 'Canvas HUD displays Signature readiness and cooldown');
assert.match(game, /const slashRange = 1100 \* 0\.6 \* \(isHypercharged \? 0\.44 : 0\.3\)/, 'Main telegraph uses the real normal and Hyper travel times');
assert.match(game, /ctx\.lineTo\(18, 0\)[\s\S]{0,240}ctx\.fillStyle = '#ffd34f'/, 'Hyper telegraph clearly previews the gold return pass');
assert.match(game, /dashaholicSignatureArmed === 'g1'[\s\S]{0,500}trinketCcImmuneUntil[\s\S]{0,100}now \+ 2000/, 'Phase Echo repeats the teleport and grants 2 seconds of CC immunity');
assert.match(game, /dashaholicSignatureArmed === 'g2'[\s\S]{0,300}dashaholicHealingAuraUntil = now \+ 4000[\s\S]{0,150}dashaholicSignatureReloadUntil = now \+ 2000/, 'Adrenaline Field grants its aura and reload burst');
assert.match(game, /Math\.hypot\(ally\.x - player\.x, ally\.y - player\.y\) <= 180[\s\S]{0,100}doHeal\(ally, 800/, 'Healing aura restores nearby teammates for 800 per tick');
assert.match(game, /dashaholicSignatureReloadUntil[\s\S]{0,100}currentReloadTime \/= 1\.5/, 'Signature grants 50% faster reload');

console.log('Dashaholic rework and Afterimage Protocol Signature regression checks passed!');
