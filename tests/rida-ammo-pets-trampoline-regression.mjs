import assert from 'node:assert/strict';
import fs from 'node:fs';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

assert.match(game, /function getEntityOwner\(entity\)[\s\S]*entity\.ownerId === player\.id[\s\S]*bots\.find/, 'summons resolve their live owner');
assert.match(game, /a\.ownerId === b\.id \|\| b\.ownerId === a\.id[\s\S]*a\.ownerId === b\.ownerId/, 'owners and sibling summons are always allied');
assert.match(game, /Trampaheal's Super is a real damageable deployable[\s\S]*trampoline\.hp -= dealt[\s\S]*TRAMPOLINE BROKEN!/, 'projectiles damage and destroy Trampaheal Super');

assert.match(game, /brawlerId==='bowlin_rida'\|\|brawlerId==='boom_arang'\|\|brawlerId==='jetpack'\)return 1/, 'The Rida remains a one-ammo brawler');
assert.match(game, /brawler === 'bowlin_rida'\) base \/= 1\.70/, 'The Rida receives 70% faster reload');
assert.match(game, /for \(const side of \[-1, 1\]\)[\s\S]*isRidaHorn: true/, 'Horn Rush creates its paired horn projectiles');
assert.match(game, /b\.isRidaHorn[\s\S]*target\.ghoulPushUntil/, 'Horn impacts use smooth displacement');
assert.match(game, /brawler === 'bowlin_rida' && !e\.isFlying/, 'running contact damage works even at base bull speed');
assert.match(game, /ridaBombTick = now \+ 643/, 'Pin Stampede uses its 40% faster firing cadence');
assert.match(game, /wantToShoot = distToTarget <= 445/, 'Rida bots understand Horn Rush range');

assert.match(game, /function getPlayerReloadTiming/, 'reload modifiers have a shared HUD timing helper');
assert.match(game, /const slotCount = Math\.max\(1, Math\.round\(maxAmmo\)\)/, 'ammo HUD sizes itself from the real ammo capacity');
assert.match(game, /ctx\.roundRect\(slotX, ammoY, ammoSlotWidth, 7, 3\.5\)/, 'ammo slots use rounded bars');
assert.match(game, /boosted \? '↻↑' : '↻↓'/, 'reload speed changes receive a visible status icon');

console.log('Rida, ammo HUD, pet ownership, and trampoline regression checks passed.');
