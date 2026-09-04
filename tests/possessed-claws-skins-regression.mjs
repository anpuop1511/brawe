import fs from 'node:fs';
import assert from 'node:assert/strict';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

// 1. Check all 3 Possessed Claws skin registrations
assert.match(game, /'possessed-claws-hunter':\s*\{[\s\S]*?name:\s*'Possessed Claws Hunter'[\s\S]*?rarity:\s*'mythic'[\s\S]*?set:\s*'Possessed Claws'/, 'Possessed Claws Hunter registered as Mythic');
assert.match(game, /'possessed-claws-malakor':\s*\{[\s\S]*?name:\s*'Possessed Claws Malakor'[\s\S]*?rarity:\s*'legendary'[\s\S]*?set:\s*'Possessed Claws'/, 'Possessed Claws Malakor registered as Legendary');
assert.match(game, /'possessed-claws-predator':\s*\{[\s\S]*?name:\s*'Possessed Claws Predator'[\s\S]*?rarity:\s*'mythic'[\s\S]*?set:\s*'Possessed Claws'/, 'Possessed Claws Predator registered as Mythic');

// 2. Custom 2.5D match models for all 3 skins
assert.match(game, /brawlerId === 'hunter' && getActiveSkinForBrawler\('hunter'\)\?\.id === 'possessed-claws-hunter'/, 'Hunter custom 2.5D possessed model exists');
assert.match(game, /brawlerId === 'malakor' && getActiveSkinForBrawler\('malakor'\)\?\.id === 'possessed-claws-malakor'/, 'Malakor custom 2.5D possessed model exists');
assert.match(game, /brawlerId === 'predator' && getActiveSkinForBrawler\('predator'\)\?\.id === 'possessed-claws-predator'/, 'Predator custom 2.5D possessed model exists');

// 3. Custom projectile rendering
assert.match(game, /activeSkinId === 'possessed-claws-hunter' && b\.ownerBrawler === 'hunter'/, 'Hunter custom possessed claw projectiles rendered');
assert.match(game, /activeSkinId === 'possessed-claws-malakor' && b\.ownerBrawler === 'malakor'/, 'Malakor custom possessed shockwave projectiles rendered');
assert.match(game, /activeSkinId === 'possessed-claws-predator' && b\.ownerBrawler === 'predator'/, 'Predator custom possessed twin slash projectiles rendered');

// 4. Verify distinct non-cyan color palette
for (const skinId of ['possessed-claws-hunter', 'possessed-claws-malakor', 'possessed-claws-predator']) {
    const skinBlockMatch = game.match(new RegExp(`'${skinId}':\\s*\\{([^\\}]+)\\}(\\s*,)?`));
    assert.ok(skinBlockMatch, `Skin block ${skinId} exists`);
    assert.ok(!skinBlockMatch[1].includes('#00ffff') && !skinBlockMatch[1].includes('#00f5d4'), `Skin ${skinId} avoids cyan colors`);
}

console.log('Possessed Claws skin set regression test passed successfully!');
