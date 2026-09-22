import assert from 'node:assert/strict';
import fs from 'node:fs';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

// 1. Database & Catalog Registration
for (const skinId of ['emperor-overlord', 'master-overlord', 'nightmare-outlit', 'headless-bolznstien']) {
    assert.match(game, new RegExp("['\"]" + skinId + "['\"]:\\s*\\{[\\s\\S]*?id:\\s*['\"]" + skinId + "['\"]"), skinId + ' registered in skinsDatabase');
}

// 2. Emperor Overlord VFX
assert.match(game, /isEmperor\s*=\s*ovSkin\s*===\s*['"]emperor-overlord['"]/, 'Overlord aim preview handles Emperor skin');
assert.match(game, /ex\.skinId === 'emperor-overlord' \|\| \(kind === 'overlord' && ex\.skinId === 'emperor-overlord'\)/, 'Emperor Overlord has dedicated explosion shockwave block');
assert.match(game, /Imperial Sunbeam Spikes & Runes/, 'Emperor Overlord explosion renders radiant sunburst spikes');
assert.match(game, /Central Amethyst Core/, 'Emperor Overlord explosion renders amethyst core');

// 3. Master Overlord VFX
assert.match(game, /isMaster\s*=\s*ovSkin\s*===\s*['"]master-overlord['"]/, 'Overlord aim preview handles Master skin');
assert.match(game, /ex\.skinId === 'master-overlord' \|\| \(kind === 'overlord' && ex\.skinId === 'master-overlord'\)/, 'Master Overlord has dedicated explosion shockwave block');
assert.match(game, /Psionic Void Singularity & Nebula Aura/, 'Master Overlord explosion renders void singularity and nebula aura');
assert.match(game, /Rotating Psionic Void Needle Spikes/, 'Master Overlord explosion renders psionic needles');

// 4. Nightmare Outlit VFX
assert.match(game, /brawlerId === 'outlit' && getActiveSkinForBrawler\('outlit'\)\?\.id === 'nightmare-outlit'/, 'Outlit 2.5D model renders bespoke Nightmare demonic skin');
assert.match(game, /b\.skinId === 'nightmare-outlit' \|\| outlitSkin\?\.id === 'nightmare-outlit'/, 'Outlit primary projectile handles Nightmare skin');
assert.match(game, /isNightmare\s*=\s*\(b\.skinId === 'nightmare-outlit'\)/, 'Outlit super projectile handles Nightmare skin');
assert.match(game, /chain\.skinId === 'nightmare-outlit' \|\| \(!chain\.skinId && getActiveSkinForBrawler\('outlit'\)\?\.id === 'nightmare-outlit'\)/, 'Outlit wall chain handles Nightmare skin');
assert.match(game, /ex\.fxKind === 'outlitWallArc' \|\| ex\.fxKind === 'outlitSuperImpact'/, 'Outlit wall arc and super impact have dedicated explosion rendering');
assert.match(game, /ex\.skinId === 'nightmare-outlit'/, 'Nightmare Outlit has dedicated takedown/death/spawn explosion block');

// 5. Headless Bolznstien VFX
assert.match(game, /brawlerId === 'bolznstien' && getActiveSkinForBrawler\('bolznstien'\)\?\.id === 'headless-bolznstien'/, 'Bolznstien 2.5D model renders bespoke Headless skin');
assert.match(game, /isHeadless\s*=\s*b\.skinId === 'headless-bolznstien'/, 'Bolznstien primary projectile handles Headless skin');
assert.match(game, /isHeadless\s*=\s*s\.skinId === 'headless-bolznstien'/, 'Bolznstien pending strike handles Headless skin');
assert.match(game, /isHeadless\s*=\s*ex\.skinId === 'headless-bolznstien'/, 'Bolznstien thunderbolt strike handles Headless skin');
assert.match(game, /Jack-o'-Lantern silhouette in center flare/, 'Bolznstien thunderbolt impact renders Jack-o-Lantern silhouette');
assert.match(game, /entSkinId === 'headless-bolznstien'/, 'Bolznstien super 6 hand chains handle Headless skin');
assert.match(game, /ca\.skinId === 'headless-bolznstien'/, 'Bolznstien super chain arcs handle Headless skin');
assert.match(game, /tr\.skinId === 'headless-bolznstien'/, 'Bolznstien shock trails handle Headless skin');
assert.match(game, /Central Carved Glowing Jack-o'-Lantern Face/, 'Headless Bolznstien explosion renders carved Jack-o-Lantern face');

// 6. Hitbox & Gameplay Integrity Check
assert.doesNotMatch(game, /if\s*\(.*(headless|nightmare|emperor|master).*\)\s*(?:damage|hp|speed|radius|hitboxMod)\s*[\+\-\*\/=]/, 'Skin checks must not alter gameplay stats or hitboxes');

console.log('Bespoke Skin VFX Regression: All checks passed successfully!');
