import assert from 'node:assert/strict';
import fs from 'node:fs';

const gameCode = fs.readFileSync('game.js', 'utf8');

assert.ok(gameCode.includes('sir_cheeseburger'), 'sir_cheeseburger brawler entry is present');
assert.ok(gameCode.includes('castSirCheeseburgerSuper'), 'castSirCheeseburgerSuper is defined');
assert.ok(gameCode.includes('executeBurgerDash'), 'executeBurgerDash is defined');
assert.ok(gameCode.includes('executeCheddarSlam'), 'executeCheddarSlam is defined');
assert.ok(gameCode.includes('ensureSirCheeseburgerState'), 'ensureSirCheeseburgerState is defined');
assert.ok(gameCode.includes('isSirCheeseburgerSlice'), 'isSirCheeseburgerSlice bullet handler is defined');
assert.ok(gameCode.includes('isSirCheeseShockwave'), 'isSirCheeseShockwave bullet handler is defined');
assert.ok(gameCode.includes('sirChestGuardUntil'), 'sirChestGuardUntil state is tracked');
assert.ok(gameCode.includes('sirCheeseDmgBonus'), 'sirCheeseDmgBonus combo bonus is tracked');
assert.ok(gameCode.includes('sirCheddarReloadBuffUntil'), 'sirCheddarReloadBuffUntil SP1 reload buff is tracked');

console.log('Sir Cheeseburger regression test passed successfully.');
