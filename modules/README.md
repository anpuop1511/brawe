# Arena Forge runtime modules

This folder is the gradual replacement for the legacy `game.js` monolith.
The browser still runs `game.js`; migrated modules load first and register
content through `window.ArenaForgeModules`.

## Migration rules

1. Keep the legacy implementation as a fallback until the migrated slice is tested.
2. Move one bounded feature at a time.
3. Run syntax checks after every extraction.
4. Test from both `file://` and GitHub Pages.
5. Never move unrelated code in the same patch.

## Target areas

- `core/`: registry, state, combat, movement, projectiles, rendering, saving.
- `brawlers/<rarity>/`: one directory or file per brawler.
- `modes/`: mode rules, objectives, maps, spawning, and mode-specific bots.
- `systems/`: gadgets, Star Powers, Hypercharges, Attachies, Sushi, quests, shop, progression, bots.
- `ui/`: home, roster, HUD, event board, shops, quests, and mobile controls.

## Current phase

Phase 1 registers the complete 58-brawler roster in rarity folders.

Phase 2 now hydrates every registered brawler with its complete kit definition
and makes the registry authoritative at runtime. The original definition object
is retained as a recovery source until the combat extraction is complete.

The registry also provides named hooks for attack, Super, aiming, rendering,
bots, gadgets, Star Powers, Hypercharges, Attachies, and Sushi. Those gameplay
hooks still fall back to `game.js` until each implementation is migrated and
tested. Use `window.__arenaForgeMigrationReport` to inspect that progress.

Run `node scripts/audit-roster-modules.mjs` after adding or moving a brawler.
