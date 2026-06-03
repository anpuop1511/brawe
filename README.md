# Arena Forge

A cross-platform Brawl Stars-style arena showdown game. Play as one of 4 custom brawlers in a landscape-oriented 1920x1080 arena against 9 AI-controlled bots. Last player standing wins! Built with Phaser 3, TypeScript, and Capacitor for web and Android.

## Features

- **Complete Game Flow**: Home menu → Brawler selection → 10-player showdown → Results screen
- **4 Unique Brawlers**: Ember Jet, Tide Crash, Violet Spark, Iron Mirth – each with different stats and abilities
- **10-Player Showdown**: You vs 9 AI bots with realistic pathfinding and combat behavior
- **Landscape Layout**: Optimized 1920x1080 resolution for desktop and mobile landscape viewing
- **AI Opponents**: Bots hunt players, shoot back, and fight each other
- **Touch Controls**: Full touch support for mobile gameplay
- **Responsive Scaling**: Adapts to different screen sizes

## Skin Rework Chart

- **Super Rare**: Custom attack effects only.
- **Epic**: Custom attack and custom super effects.
- **Mythic**: Keeps current combat visuals, plus a takedown effect themed to the brawler.
- **Legendary**: Everything above, plus spawn effect, takedown effect, and death animation.
- **Launch Featured Legendary**: FightNSpice in the Spicy Set is the first Legendary skin, featured for 3 days with a 10% launch discount.

## Game Modes

### Showdown Mode
- 10 players total (you + 9 AI bots)
- Defeat all AI bots to win
- Be the last one standing
- Score multiplier for eliminations
- Leaderboard shows alive players

## How to Play

### Controls
- **Movement**: WASD or Arrow Keys
- **Shooting**: Click/Tap or press SPACE
- **Mobile**: Use on-screen touch buttons

### Game Flow
1. Start at the Home screen
2. Choose a brawler or use Quick Play for default brawler
3. Enter the Showdown arena with 9 AI opponents
4. Defeat enemies and avoid being defeated
5. Win by eliminating all AI bots
6. View results and play again

## Customization

### Brawler Stats
Edit [src/game/types.ts](src/game/types.ts) to customize brawler properties:
- `health`: Maximum HP
- `speed`: Movement speed
- `damage`: Projectile damage per hit
- `reloadMs`: Time between shots
- `projectileSpeed`: How fast projectiles travel
- `superCharge`: Super ability charge rate

### Arena
- Arena size: `GAME_CONFIG.arenaWidth` and `GAME_CONFIG.arenaHeight`
- Number of AI bots: `GAME_CONFIG.numAIBots`
- Obstacle placement in `ShowdownScene.createWalls()`

### AI Behavior
Modify `AIBotBrain` class in [src/game/scenes/ShowdownScene.ts](src/game/scenes/ShowdownScene.ts):
- Detection radius: `nearestDist = 600`
- Bot speed multiplier: `speed * 0.8`
- Reload time penalty: `* 1.2`

## Project Structure

```
src/
├── main.ts                    # Game initialization and scene setup
├── styles.css                 # Landscape layout CSS
├── game/
│   ├── types.ts              # Brawler definitions and game config
│   ├── state.ts              # Session state management
│   └── scenes/
│       ├── HomeScene.ts       # Landing page with navigation
│       ├── BrawlerSelectScene.ts  # Character selection screen
│       ├── ShowdownScene.ts   # Main 10-player game
│       └── ResultsScene.ts    # Win/loss results screen
```

## Run it on the web

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser (or your machine's IP for mobile testing)

## Build for production

```bash
npm run build
```

The built files are in the `dist/` directory.

## Add Android

```bash
npm run cap:add:android
npm run cap:sync
```

Then open the generated Android project in Android Studio and build/deploy from there.

### Android now (quick start)

```bash
npm install
npm run android:setup
npm run cap:open:android
```

After first setup, use:

```bash
npm run android
```

This now always copies `game.js` into `dist/` after each web build, so the Capacitor `file://` app runtime can load your gameplay code correctly on Android.

## Development

### TypeScript Compilation
```bash
npm run build
```

### Dev Server with Hot Reload
```bash
npm run dev
```

## Scene Navigation

- **HomeScene** → BrawlerSelectScene (Select Brawler button) or ShowdownScene (Quick Play)
- **BrawlerSelectScene** → HomeScene (Back) or ShowdownScene (Start Match)
- **ShowdownScene** → ResultsScene (Win or Loss condition)
- **ResultsScene** → ShowdownScene (Play Again) or HomeScene (Home)

## Technical Details

- **Resolution**: 1920x1080 (landscape, responsive scaled)
- **Game Engine**: Phaser 3
- **Language**: TypeScript
- **Platform Support**: Web, Android (via Capacitor)
- **Physics**: Arcade (2D top-down)
- **Build Tool**: Vite

