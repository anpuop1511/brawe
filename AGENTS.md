# Brawe Development & Safety Rules

## Backup Policy
1. **Mandatory Backups**:
   - Create a backup of `game.js` (and any other affected core files) before/after adding every new brawler, and every 3 smaller features/fixes.
   - Keep working milestone backups in `.backups/` (e.g. `.backups/game.js.<timestamp-or-tag>`) so rollbacks are instant and safe.
2. **Stable Backup Protection**:
   - **Do NOT replace the primary stable backup** until the user explicitly confirms that the build is stable.
3. **Code Safety & Integrity**:
   - Never revert or delete large sections of `game.js` or existing brawler implementations.
   - Always perform syntax verification (`node --check game.js`) and run regression tests (`tests/*-regression.mjs`) before completing any task.
