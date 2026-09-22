import assert from 'node:assert/strict';
import fs from 'node:fs';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

// 1. Skin database entry
assert.match(game, /'boneless-boomarang':\s*\{[\s\S]*?id:\s*'boneless-boomarang'/, 'Boneless Boomarang skin registered in skinsDatabase');
assert.match(game, /brawler:\s*'boom_arang'/, 'Associated with boom_arang brawler');
assert.match(game, /rarity:\s*'epic'/, 'Has epic rarity');
assert.match(game, /price:\s*149/, 'Has 149 gem price tag');
assert.match(game, /type:\s*'boneBoomerang'/, 'Has custom boneBoomerang attackEffect');

// 2. 4-Stage Quest Track
assert.match(game, /const BONELESS_BOOMARANG_QUESTS = \[/, 'BONELESS_BOOMARANG_QUESTS array exists');
assert.equal((game.match(/id:\s*'boneless_\d\d'/g) || []).length, 4, 'Contains exactly 4 sequential quest stages');
assert.match(game, /skin:\s*'boneless-boomarang'/, 'Stage 4 rewards the Boneless Boomarang skin');

// 3. Quest Board Integration
assert.match(game, /bonelessBoomarang:\s*buildQuestBucket\(BONELESS_BOOMARANG_QUESTS\)/, 'Initializes bonelessBoomarang quest bucket');
assert.match(game, /mergeQuestBucket\(playerData\.questBoard\.bonelessBoomarang,\s*BONELESS_BOOMARANG_QUESTS\)/, 'Safely merges bonelessBoomarang quest bucket on migration');
assert.match(game, /const bonelessReady = getQuestProgressCount\(playerData\.questBoard\.bonelessBoomarang\)/, 'Counts claimable Boneless Boomarang quests for badge');
assert.match(game, /grid\.appendChild\(createColumn\('Boneless Boomarang',\s*'4-stage Epic skin trial',\s*'bonelessBoomarang'\)\)/, 'Mounts Boneless Boomarang column in Core Quest View');

// 4. Bespoke 2.5D Model Rendering
assert.match(game, /'boneless-boomarang'.*?\.includes\(visualSkin\)/, 'Included in bespokeSkin list for 2.5D rendering');
assert.match(game, /brawlerId === 'boom_arang' && getActiveSkinForBrawler\('boom_arang'\)\?\.id === 'boneless-boomarang'/, 'Renders custom skeletal model for Boneless Boomarang');

// 5. Bespoke Projectile & Portrait
assert.match(game, /const isBoneless = activeSkinId === 'boneless-boomarang'/, 'Identifies Boneless Boomarang projectile in bullet loop');
assert.match(game, /visualSkin === 'boneless-boomarang'/, 'Portrait markup supports Boneless Boomarang');

console.log('Boneless Boomarang regression: all checks passed!');
