# Brawe Handoff Summary

## Goal
Continue from current Skeleflying implementation and apply a rarity redistribution rework.

## What Was Completed
- Added new brawler Skeleflying in game.js with full integration.
- Added Skeleflying roster/meta entry, rarity, descriptions, icon, and gadget text wiring.
- Implemented main attack: 3 parachute drops in a cone with delayed landing explosions.
- Implemented super: 3 sky portals with visible landing spots, then trooper spawn on landing.
- Implemented hypercharge behavior:
- Portals retarget while descending.
- Main attack landings can spawn troopers.
- Hyper visuals converted to purple for telegraphs and landing effects.
- Implemented Skeletrooper summon unit AI (melee/chase nearest enemy).
- Added Skeleflying gadgets and star powers logic.
- Added telegraphs to match Skeleflying attack/super behavior.
- Prevented stacking all drops at point-blank by adding minimum drop distances for main/super.
- Validated: no diagnostics errors and build passes.

## Important Recent Tuning
- Super is now aimable by distance (not fixed-length only).
- Main telegraph range now matches actual aimed drop distance.
- Hypercharge-spawned skeletroopers now have 75% less HP (25% of normal).
- Hypercharge effects for Skeleflying are purple.

## Current Status
- Code is stable and builds.
- User requested rarity distribution rework because too many high-rarity brawlers.
- Rarity remap has NOT been applied yet.

## Next Requested Change
Apply rarity remap in game.js (brawlerRarities) using this target distribution idea:
- Common: 2
- Rare: 3
- Super Rare: 4
- Epic: 5
- Mythic: 6
- Legendary: 4
- Exotic: 1

Proposed specific moves from prior plan:
- Common: outlit, goonbob (if enabled)
- Rare: bowlin_rida, chaird, minigunnin
- Super Rare: echo, cheseypuff, unopcoloco, forest
- Epic: trapper, money_and_tax, heater_miser, bouncin_balls, hunter
- Mythic: dashaholic, tempo_maker, amplifier, steamer, classy, fightnfire, copyphase (adjust as needed to hit target count)
- Legendary: decayer, hyperorigin, beast, skeleflying
- Exotic: overlord

## File To Edit Next
- game.js

## Quick Verification After Remap
- Run diagnostics on game.js.
- Run npm run build.
- Confirm brawler select sorting by rarity still behaves correctly.
