# Arena Forge (Brawe)

Arena Forge is a browser-first, top-down arena combat game built around an original roster, fast matches, unusual character mechanics, and long-term progression. Fight AI opponents in Showdown and team modes, unlock and upgrade brawlers, assemble loadouts, climb Ranked, and collect limited-event powers.

> **Current status:** actively developed playable prototype. The game runs locally in a modern desktop browser and saves progress in browser storage.

## Play locally

No installation or build step is required.

1. Open [`index.html`](index.html) in Chrome, Edge, Firefox, or another modern browser.
2. Choose a brawler and mode from the home screen.
3. Select **Start** to play.

Direct Windows path used by the current workspace:

```text
C:\Users\test\Documents\Codex\2026-07-11\build\brawe\index.html
```

Because saves use `localStorage`, progress belongs to the browser and local file origin used to launch the game. Clearing site data can erase that progress.

## Current highlights

- **44 playable brawlers**, each with a main attack, Super, two Gadgets, two Star Powers, and a Hypercharge.
- **Power Levels 1–11** with stats that scale to their defined Power 11 values.
- **Solo, duo, trio, objective, team, survival, and experimental modes.**
- **AI opponents** that fight, pursue objectives, use brawler abilities, and use SlopSushi powers.
- **Progression and economy:** Coins, Gems, Souls, Bricks, Soul Summoner unlocks, Starr Drops, Tappers, upgrades, skins, quests, and Ranked Points.
- **Loadout progression:** unlock and select Gadgets, Star Powers, and Hypercharges per brawler.
- **Rounded health, ammo, shield, status, Super, and Hypercharge displays** designed to remain readable during combat.
- **Desktop and touch controls** with a responsive canvas.
- **Local saves** with no account or server required.

## Game modes

The home screen currently exposes the following modes:

| Mode | Format | Objective |
| --- | --- | --- |
| SlopSushi Solo | Solo event mode | Choose two Sushi powers before every match. |
| Solo Showdown | 10-player free-for-all | Be the last fighter alive. |
| Duo Showdown | Five teams of two | Keep your team alive and eliminate the others. |
| Trio Showdown | Three teams of three | Outlast the other trios. |
| Control Clash | Objective mode | Capture and control the central zone. |
| Brick Run | 3v3 construction race | Gather and use bricks to complete the team objective. |
| Knock n Donate | 3v3 ring-out battle | Knock opponents from the arena and win the rounds. |
| Brick Vault | 3v3 objective attack | Defend your vault while breaking the enemy vault. |
| Damage Filler | Rotating 2v2/3v3 damage race | Reach the damage goal before the enemy team. |
| Mirror | 5v5 mirror match | Everyone uses the same randomly selected brawler. |
| Power of the Gods | Limited solo mode | Survive a high-power ruleset. |
| Solo Tower Defense | Solo defense | Protect the tower from incoming waves. |

Ranked, Duels, Training, tutorials, trials, and additional limited experiences are available through the surrounding home-screen tools and progression flow.

## Controls

### Keyboard and mouse

| Action | Control |
| --- | --- |
| Move | `WASD` or Arrow Keys |
| Aim | Mouse cursor |
| Main attack | Hold or click the left mouse button |
| Gadget | `Q` |
| Super | Hold/aim with `E`, then release |
| Hypercharge | `F` |
| Select Star Power 1/2 | `1` / `2` |
| Start selected match | `Enter` |

Some brawlers intentionally alter the normal controls. Examples include Teether's timed floss attack, Demon's one-second blade glide choice, Copyphase's stored identities, and Money & Tax's two combat modes.

### Touch

Touch devices receive on-screen movement, attack, Gadget, Super, and Hypercharge controls. Landscape orientation is recommended.

## The roster

The roster contains fighters across Damage Dealer, Tank, Assassin, Support, Controller, Marksman, Thrower, and Specialist roles. Arena Forge is especially focused on mechanics that change how a match is read or controlled, including:

- **Copyphase:** stores enemy identities, transforms into one, and summons another.
- **Paradox:** manipulates allied and enemy projectile speed inside time zones.
- **Screener:** recharges a draining battery and converts incoming shots through a projector field.
- **Xray:** reveals enemy ammunition through attacks and a deployable scanner.
- **Malakor:** permanently corrupts the arena with damaging Hell terrain.
- **Teether:** attaches teeth, then temporarily converts the ammo display into an optional floss grapple timer.
- **Splitter:** creates recursively splitting projectile generations.
- **Blobert:** creates and collects puddles as a resource for stronger attacks.
- **Angel:** heals and briefly lifts allies while slowing enemies, with lethal-damage protection.
- **Demon:** throws a blade and chooses between recalling it or gliding to its landing point.
- **Warrior:** throws spears over walls and trades movement speed for an extreme reload burst.

Open the **Brawlers** screen in-game for the complete current roster, exact Power 11 statistics, ability descriptions, loadouts, rarity, and ownership status.

## Progression

Arena Forge begins as a fresh local save and expands through several connected systems:

- **Coins** upgrade brawler Power Levels and support shop purchases.
- **Souls** progress the Soul Summoner and unlock new brawlers.
- **Gems** purchase premium or limited rewards.
- **Bricks** contribute to applicable upgrades and construction systems.
- **Tappers** grant rewards, with specialized variants for Supers, Hypercharges, and events.
- **Quests** track matches, victories, damage, eliminations, Supers, Gadgets, survival, and mode objectives.
- **Ranked Points** move the player through ranked divisions.
- **Skins** range from effect-focused variants to higher-rarity cosmetic packages.

Normal matches use the selected brawler's current Power Level. Ranked and designated competitive or experimental modes can normalize brawlers to Power 11.

## SlopSushi event

SlopSushi is a 34-day, browser-clock limited event with personalized Sushi decks for every brawler.

- A Sushi Tapper can unlock a deck even for a brawler that is still locked.
- Each brawler has eight personalized powers rather than a shared generic deck.
- Before a modified match, choose two cards from randomized choices.
- Owned cards appear in the match HUD and can be hovered to review their effects.
- Bots can use Sushi powers too.
- After decks are collected, further rewards improve individual card Power Levels, up to level 5.
- Multiple modes can receive the Sushi modifier on the hourly rotation while the dedicated SlopSushi mode remains available.
- The Event Hub contains event quests, deck progress, rewards, and the event timer.

Event timing uses the local browser date because the project does not currently have a server clock.

## Project layout

```text
brawe/
├── index.html            # Page structure and home-screen shell
├── bootstrap.js          # Loads the active browser game runtime
├── game.js               # Gameplay, UI, modes, AI, progression, and saves
├── slopsushi-cards.js    # Personalized SlopSushi card definitions
├── styles.css            # Main interface and responsive styling
└── README.md             # Project overview and play instructions
```

The active game is a JavaScript/HTML canvas build. The older Phaser, TypeScript, Vite, Capacitor, `src/game`, and Android instructions previously documented here do **not** describe this version.

## Development notes

- Reload `index.html` after editing the JavaScript or CSS files.
- Browser developer tools are the quickest way to inspect runtime errors.
- Save data is stored under the `brawlGameProgress` local-storage key, with supporting keys for some preferences and event state.
- Most gameplay definitions currently live in `game.js`; keep new isolated data tables in their own files when practical.
- Test a change in Training before checking normal modes, team modes, AI behavior, and SlopSushi interactions.

## Credits and positioning

Arena Forge is an independent fan-made prototype inspired by top-down hero arena games. It is not affiliated with, endorsed by, or produced by Supercell. Brawl Stars and related names belong to their respective owners.
