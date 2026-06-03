export type BrawlerRarity = 'Common' | 'Rare' | 'Super Rare' | 'Epic' | 'Mythic' | 'Legendary' | 'Exotic';

export interface BrawlerProgress {
  level: number;
  bricks?: number;
  prestige?: number;
  gadgetUnlocked: boolean;
  starPowerUnlocked: boolean;
  hyperchargeUnlocked: boolean;
  selectedStar?: 'one' | 'two';
  selectedGadget?: 'g1' | 'g2';
}

export interface PersistentState {
  coins: number;
  starrDrops: number;
  starrDropsToday: number;
  lastDate: string;
  brawlerProgress: Record<string, BrawlerProgress>;
  favoriteBrawlers?: string[];
  superTapperCount?: number;
  firstWinSuperAwarded?: boolean;
  gratuitousSuperGiven?: boolean;
  evilDoctorUnlockEndAt?: number;
}

export interface BrawlerSpec {
  id: string;
  rarity: BrawlerRarity;
  name: string;
  role: string;
  description: string;
  attackName: string;
  attackDescription: string;
  superName: string;
  superDescription: string;
  hyperchargeName: string;
  hyperchargeDescription: string;
  gadgetOne: string;
  gadgetTwo: string;
  starPowerOne: string;
  starPowerTwo: string;
  health: number;
  speed: number;
  damage: number;
  reloadMs: number;
  projectileSpeed: number;
  pellets: number;
  spread: number;
  superShots: number;
  superBreaksWalls: boolean;
  superRangeMultiplier: number;
  color: number;
  accent: number;
  superCharge: number;
  // Optional extended fields for exotic mechanics / VFX tuning
  attackDelayMs?: number;
  attackRadius?: number;
  strikesToStun?: number;
  stunMs?: number;
  superDurationMs?: number;
  superAreaRadius?: number;
  hyperchargeDelayMultiplier?: number; // multiplier to apply to attackDelayMs when hypercharged (e.g. 0.6)
  superHomingAccuracy?: number; // 0..1 accuracy for hypercharged homing super
  disabled?: boolean;
}

export interface AIBot {
  id: string;
  spriteKey: string;
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  targetX: number;
  targetY: number;
  baseTint: number;
  lastShotAt: number;
  alive: boolean;
  score: number;
}

export const GAME_CONFIG = {
  arenaWidth: 1920,
  arenaHeight: 1080,
  numAIBots: 14,
  totalPlayers: 15,
};

export const BRAWLERS: BrawlerSpec[] = [
  {
    id: 'outlit',
    rarity: 'Common',
    name: 'Outlit',
    role: 'Close-range shotgunner',
    description: 'A commons-tier brawler built for tight spaces, quick pressure, and wall play.',
    attackName: 'Scatter Pump',
    attackDescription: 'A compact shotgun blast with a tight spread and strong point-blank damage.',
    superName: 'Boom Break',
    superDescription: 'Fires 2 heavy shells that destroy walls and crack open escape routes.',
    hyperchargeName: 'Double Barrel Blast',
    hyperchargeDescription: 'Super fires 4 shells instead of 2 and breaks all walls in a wider radius.',
    gadgetOne: 'Next Shot Pierce: your next main attack passes through walls.',
    gadgetTwo: 'Healing Pod: Deploys a pod that heals nearby allies.',
    starPowerOne: 'Shell Chill: main attack slows enemies for 1 second.',
    starPowerTwo: 'Long Boom: super travels 35% farther.',
    health: 8000,
    speed: 260,
    damage: 352,
    reloadMs: 480,
    projectileSpeed: 602,
    pellets: 5,
    spread: 9,
    superShots: 2,
    superBreaksWalls: true,
    superRangeMultiplier: 1.35,
    color: 0xff9b42,
    accent: 0xffdc86,
    superCharge: 4,
  },
  {
    id: 'echo',
    rarity: 'Epic',
    name: 'Echo',
    role: 'Controller',
    description: 'Fires expanding sound rings that control the battlefield.',
    attackName: 'Sound Wave',
    attackDescription: 'Shoots a ring that grows in size as it travels.',
    superName: 'Resonance',
    superDescription: 'Unleashes massive sound waves that pierce through enemies.',
    hyperchargeName: 'Sonic Boom',
    hyperchargeDescription: 'Super range increased by 50% and it slows all hit enemies for 2s.',
    gadgetOne: 'Amplify: Enlarges the next ring shot but reduces damage.',
    gadgetTwo: 'Shielding: Gains a temporary defensive buff.',
    starPowerOne: 'Reverb Heal: Hitting enemies heals Echo for 10% max HP.',
    starPowerTwo: 'Double Wave: Super shoots an additional cone backwards.',
    health: 8200,
    speed: 250,
    damage: 1150,
    reloadMs: 1680,
    projectileSpeed: 850,
    pellets: 1,
    spread: 0,
    superShots: 1,
    superBreaksWalls: false,
    superRangeMultiplier: 1.0,
    color: 0xccaaff,
    accent: 0xd282ff,
    superCharge: 5,
  },
  {
    id: 'cheseypuff',
    rarity: 'Epic',
    name: 'Cheseypuff',
    role: 'Marksman',
    description: 'A long-range sniper that uses cheese fields to trap enemies.',
    attackName: 'Cheese Ball',
    attackDescription: 'Fires a multi-stage projectile that evolves over distance.',
    superName: 'Cheese Aura',
    superDescription: 'Gains a massive shield and damages nearby enemies over time.',
    hyperchargeName: 'Extra Sharp',
    hyperchargeDescription: 'Cheese fields deal 30% more damage and last 2s longer.',
    gadgetOne: 'Big Puff: Empowers the next shot to be massive.',
    gadgetTwo: 'Cheese Trap: Spawns a field that slows enemies.',
    starPowerOne: 'Sticky Cheese: Super drops slow fields around you.',
    starPowerTwo: 'Aged Cheese: Adds a third stage to the main attack range.',
    health: 5800,
    speed: 260,
    damage: 1400,
    reloadMs: 1100,
    projectileSpeed: 880,
    pellets: 1,
    spread: 0,
    superShots: 1,
    superBreaksWalls: false,
    superRangeMultiplier: 1.0,
    color: 0xffdc78,
    accent: 0xffc846,
    superCharge: 6,
  },
  {
    id: 'decayer',
    rarity: 'Legendary',
    name: 'Decayer',
    role: 'Controller',
    description: 'Manipulates shields and homing projectiles to outlast opponents.',
    attackName: 'Decay Shot',
    attackDescription: 'Fires a heavy shot that grants Decayer a personal shield on hit.',
    superName: 'Dark Orbit',
    superDescription: 'Instantly grants a massive shield to endure heavy fire.',
    hyperchargeName: 'Eternal Void',
    hyperchargeDescription: 'Shield capacity increased by 50% and provides immunity to knockback.',
    gadgetOne: 'Homing: Next shot homes in on nearby targets.',
    gadgetTwo: 'Sacrifice: Consume all ammo for an instant shield.',
    starPowerOne: 'Persistent Decay: Super shields last slightly longer.',
    starPowerTwo: 'Long Shield: Gain 10% more shield from main attacks.',
    health: 8500,
    speed: 230,
    damage: 1100,
    reloadMs: 1740,
    projectileSpeed: 820,
    pellets: 1,
    spread: 0,
    superShots: 1,
    superBreaksWalls: false,
    superRangeMultiplier: 1.0,
    color: 0x8a2be2,
    accent: 0xb56cff,
    superCharge: 5,
  },
  {
    id: 'unopcoloco',
    rarity: 'Epic',
    name: 'UnoPcoLoco',
    role: 'Support',
    description: 'Shoots a scarf that jumps to targets, then uses healing whacks.',
    attackName: 'Scarf & Whack',
    attackDescription: 'Fires a locking scarf, followed by 2 short-range glove whacks that heal you.',
    superName: 'Scraf Clonin',
    superDescription: 'Jumps with a scarf and drops 3 clones at the landing spot.',
    hyperchargeName: 'Party Scarf',
    hyperchargeDescription: 'Scarf jump creates a healing aura that heals allies for 500 HP/sec.',
    gadgetOne: 'Scarf Switch: Changes your next attack to a scarf.',
    gadgetTwo: 'Stretchy Scarf: Gain 30% more range and healing for 4 sec.',
    starPowerOne: 'Heavy Scarf: Normal scarf jump deals 50% landing damage.',
    starPowerTwo: 'Extra Clone: Super summons an extra clone at your starting location.',
    health: 8500,
    speed: 250,
    damage: 850,
    reloadMs: 1100,
    projectileSpeed: 900,
    pellets: 1,
    spread: 0,
    superShots: 1,
    superBreaksWalls: false,
    superRangeMultiplier: 1.0,
    color: 0xff4d4d,
    accent: 0xffb3b3,
    superCharge: 5,
  },
  {
    id: 'dashaholic',
    rarity: 'Mythic',
    name: 'Dashaholic',
    role: 'Assassin',
    description: 'Slashes through enemies with piercing claws and dashes rapidly across the battlefield.',
    attackName: 'Claw Slash',
    attackDescription: 'A piercing slash that damages all enemies in its path exactly once.',
    superName: 'Unleash the Dashaholic',
    superDescription: 'Dashes forward at high speed, slashing anyone you pass through.',
    hyperchargeName: 'Sonic Slash',
    hyperchargeDescription: 'Dashes deal 2x damage and you gain a 20% speed boost after dashing.',
    gadgetOne: 'Phase Dash: Short directional teleport forward.',
    gadgetTwo: 'Adrenaline: Instantly heal 1500 HP & reload 1 ammo.',
    starPowerOne: 'Vampiric Claws: Heal 25% from main attack damage.',
    starPowerTwo: 'Deep Cuts: Super leaves enemies bleeding.',
    health: 7200,
    speed: 280,
    damage: 950,
    reloadMs: 1200,
    projectileSpeed: 1100,
    pellets: 1,
    spread: 0,
    superShots: 1,
    superBreaksWalls: false,
    superRangeMultiplier: 1.0,
    color: 0x00ffcc,
    accent: 0x00b38f,
    superCharge: 5,
  },
  {
    id: 'trapper',
    rarity: 'Mythic',
    name: 'Trapper',
    role: 'Controller',
    description: 'Drops gates and musical fences to trap enemies and lock down zones.',
    attackName: 'Slam Gate',
    attackDescription: 'Shoots a cone gate. On hit it slams shut for burst damage and knockback; on miss it stays as a short wall.',
    superName: 'Sound Fence',
    superDescription: 'Creates a rectangular fence that traps enemies inside and deals continuous music damage.',
    hyperchargeName: 'Stage Lockdown',
    hyperchargeDescription: 'Fence is larger, teammates inside gain speed, and trapped enemies take extra damage from all sources.',
    gadgetOne: 'Bass Blast: Emit a nearby knockback pulse around Trapper.',
    gadgetTwo: 'Quick Patch: Instantly restore health.',
    starPowerOne: 'Encore Set: Super fence duration is longer.',
    starPowerTwo: 'Rhythm Rush: Landing a Slam grants a speed boost.',
    health: 7600,
    speed: 250,
    damage: 1000,
    reloadMs: 1450,
    projectileSpeed: 860,
    pellets: 1,
    spread: 0,
    superShots: 1,
    superBreaksWalls: false,
    superRangeMultiplier: 1.0,
    color: 0x5a7bff,
    accent: 0xffd166,
    superCharge: 6,
  },
  {
    id: 'classy',
    rarity: 'Legendary',
    name: 'Classy',
    role: 'Marksman',
    description: 'Fires a fast burst of notes. Hits fill a Symphony bar. Full Symphony turns attacks gold and homing.',
    attackName: 'Note Burst',
    attackDescription: 'Fires a fast burst of 8 notes. Hitting enemies fills a "Symphony" bar; when full, your next attack turns gold and homes in on targets.',
    superName: 'Bass Drop',
    superDescription: 'Drops an 8500 HP speaker. While standing near it, Classy fires 9 larger notes instead of 8.',
    hyperchargeName: 'Finale',
    hyperchargeDescription: 'Main attacks pierce through enemies. The speaker grows larger and shoots notes at nearby enemies every 0.7s.',
    gadgetOne: 'Tuning Up: Instantly fills half the Symphony bar.',
    gadgetTwo: 'Fanfare: Fires the 8 notes in a wide fan instead of a straight burst.',
    starPowerOne: 'Crescendo: Damage increases for every consecutive hit.',
    starPowerTwo: 'The Show Must Go On: Refills the Symphony bar if the speaker is destroyed.',
    health: 4400,
    speed: 240,
    damage: 280,
    reloadMs: 1600,
    projectileSpeed: 1050,
    pellets: 8,
    spread: 0,
    superShots: 1,
    superBreaksWalls: false,
    superRangeMultiplier: 0.8,
    color: 0xd4af37,
    accent: 0x800080,
    superCharge: 8,
  },
  {
    id: 'money_and_tax',
    rarity: 'Mythic',
    name: 'Money & Tax',
    role: 'Controller',
    description: 'A dual-stance financier who blasts enemies with coins in Money Mode, and drains their resources with banknotes in Tax Mode.',
    attackName: 'Liquid Assets / Audit',
    attackDescription: 'Money Mode: Fires 3 waves of 3 coins. Tax Mode: Fires 2 banknotes that steal enemy ammo on hit.',
    superName: 'Market Crash / Sticky Bill',
    superDescription: 'Money: 5 boomerang coins, then switch to Tax. Tax: Attach a DoT sticky note that drains ammo, then switch to Money.',
    hyperchargeName: 'Fiscal Expansion',
    hyperchargeDescription: 'Money Super pierces walls. Tax Super chains to a 2nd target. Main attacks pierce.',
    gadgetOne: 'Mode Swap: Instantly switch between Money and Tax modes.',
    gadgetTwo: 'Bailout: Consume 1 ammo to instantly heal 1500 HP and gain a short speed boost.',
    starPowerOne: 'Compound Interest: Consecutive coin hits from the same attack deal 15% more damage.',
    starPowerTwo: 'Embezzlement: Stealing ammo in Tax Mode also heals you for a small amount of HP.',
    health: 7200,
    speed: 250,
    damage: 450,
    reloadMs: 1400,
    projectileSpeed: 950,
    pellets: 3,
    spread: 0,
    superShots: 5,
    superBreaksWalls: false,
    superRangeMultiplier: 1.2,
    color: 0x27ae60, // Emerald Green
    accent: 0xf1c40f, // Gold
    superCharge: 6,
  },
  {
    id: 'chaird',
    rarity: 'Super Rare',
    name: 'Chaird',
    role: 'Tank',
    description: 'A sturdy brawler who throws chairs and spins them around for area control.',
    attackName: 'Chair Toss',
    attackDescription: 'Throws a chair that explodes on impact and again 0.8s later.',
    superName: 'Chair Spin',
    superDescription: 'Spins chairs around, gaining speed and dealing continuous damage.',
    hyperchargeName: 'Steel Frame',
    hyperchargeDescription: 'Spins faster and reflects projectiles back at attackers.',
    gadgetOne: 'Chair Toss: Instantly throws 3 chairs in a small arc.',
    gadgetTwo: 'Reinforced Seating: Gains a temporary shield and becomes immune to pulls/knockbacks for a short duration.',
    starPowerOne: 'Explosive Seating: Each time you hit a chair, your next shot will explode with a 30% more radius.',
    starPowerTwo: 'Gravitational Pull: Your super now pulls enemies in.',
    health: 8500,
    speed: 240,
    damage: 1000,
    reloadMs: 1600,
    projectileSpeed: 700,
    pellets: 1,
    spread: 0,
    superShots: 1,
    superBreaksWalls: false,
    superRangeMultiplier: 1.0,
    color: 0x8B4513, // SaddleBrown
    accent: 0xD2B48C, // Tan
    superCharge: 5,
  },
  {
    id: 'forest',
    rarity: 'Mythic',
    name: 'Forest',
    role: 'Controller',
    description: 'Commands nature to fire delayed plant projectiles and summons a fierce parrot.',
    attackName: 'Nature\'s Wrath',
    attackDescription: 'Shoots 3 large plants left to right with a short delay.',
    superName: 'Avian Ally',
    superDescription: 'Spawns a 7000 HP parrot that pecks the closest enemy.',
    hyperchargeName: 'King of the Jungle',
    hyperchargeDescription: 'Parrot is 50% larger, has 2x health, and its attacks pierce.',
    gadgetOne: 'Rooted: Heal 2000 HP & 30% Shield, cannot move 3s.',
    gadgetTwo: 'Grasping Vines: Next attack pulls enemies slightly.',
    starPowerOne: 'Thorny Trail: Plants leave a damaging trail.',
    starPowerTwo: 'Angry Bird: Parrot speed & attack rate +20%.',
    health: 6800,
    speed: 240,
    damage: 1000,
    reloadMs: 1600,
    projectileSpeed: 510,
    pellets: 3,
    spread: 0,
    superShots: 1,
    superBreaksWalls: false,
    superRangeMultiplier: 1.0,
    color: 0x228b22,
    accent: 0x32cd32,
    superCharge: 6,
  },
  {
    id: 'bouncin_balls',
    rarity: 'Mythic',
    name: 'Bouncin\' Balls',
    role: 'Marksman',
    description: 'Shoots bouncing balls that ricochet off walls. Dynamic range mechanics.',
    attackName: 'Ricochet Volley',
    attackDescription: 'Fires 6 bouncing balls straight. -5% range and -5% dmg per bounce.',
    superName: 'Bouncy House',
    superDescription: 'Shoots 7 overpowered piercing balls that bounce fully without losing stats.',
    hyperchargeName: 'Super Bouncy',
    hyperchargeDescription: 'Balls bounce 3 more times and gain 5% damage per bounce.',
    gadgetOne: 'Elasticity: Your next attack has a 50% range boost.',
    gadgetTwo: 'Bouncy Turret: Lose all ammo, deploy a turret that shoots bouncing balls.',
    starPowerOne: 'Desperation Bounce: Below 30% HP, shoot an extra ball that deals 20% more damage.',
    starPowerTwo: 'Momentum: Balls travel 10% faster after every bounce.',
    health: 6500,
    speed: 250,
    damage: 300,
    reloadMs: 1500,
    projectileSpeed: 900,
    pellets: 6,
    spread: 0,
    superShots: 7,
    superBreaksWalls: false,
    superRangeMultiplier: 2.0,
    color: 0x00aaff,
    accent: 0x00ffff,
    superCharge: 8,
  },
  {
    id: 'fightnfire',
    rarity: 'Legendary',
    name: "Fight'nFire",
    role: 'Thrower',
    description: 'Hurls fireballs that detonate on landing, then the blast splits into bouncing embers.',
    attackName: 'Fireball Toss',
    attackDescription: 'Throws a fireball with a limited range. It explodes on impact and splits into 4 smaller fireballs that bounce once before exploding.',
    superName: 'Jump into the FIRAA',
    superDescription: 'Leap to a targeted spot, become invincible while airborne, then slam down after 0.7s to set the floor on fire.',
    hyperchargeName: 'Not Releasing',
    hyperchargeDescription: 'Fight\'nFire launches without a hypercharge.',
    gadgetOne: 'Thermite Canister: Your next fireball is bigger, flies farther, and splits into 8 embers.',
    gadgetTwo: 'Firestep: Instantly hop to your cursor and leave a smaller fire patch on landing.',
    starPowerOne: 'Hot Landing: The center of your fire zones deals extra damage for longer.',
    starPowerTwo: 'Ashen Drift: The outer edge of your fire zones slows enemies briefly.',
    health: 7200,
    speed: 260,
    damage: 900,
    reloadMs: 1320,
    projectileSpeed: 860,
    pellets: 1,
    spread: 0,
    superShots: 1,
    superBreaksWalls: false,
    superRangeMultiplier: 1.0,
    color: 0xff6b2d,
    accent: 0xffd166,
    superCharge: 6,
  },
  {
    id: 'overlord',
    rarity: 'Exotic',
    name: 'Overlord',
    role: 'Zone Controller',
    description: 'An exotic stage-up brawler who starts at stage 0, finds his wand, and grows into a spell-duelist with explosive main attacks.',
    attackName: 'Wand Pulse',
    attackDescription: 'Stage 0 and 1 fire a focused wand bolt. Stage 1 moves 20% faster and reloads 10% faster. Stage 2 bolts explode on impact. Stage 3 bolts grow by 10% on enemy hit and explode again.',
    superName: 'Wand Ascension',
    superDescription: 'Upgrade one stage and create three protective wand shots in a triangle around you while the wand locks in.',
    hyperchargeName: 'Overloaded',
    hyperchargeDescription: 'Main attacks fire with a shorter delay. During hypercharge, your attacks enflame enemies on hit.',
    gadgetOne: 'Quick Draw: Your next stage-up or attack fires with a much shorter delay.',
    gadgetTwo: 'Arc Burst: Your next main attack splits into 3 close wand shots.',
    starPowerOne: 'Arc Resonance: Stage 2 and 3 explosions hit 12% harder.',
    starPowerTwo: 'Imperial Guard: The triangle from your super lasts longer and protects more tightly.',
    health: 7000,
    speed: 240,
    damage: 1200,
    reloadMs: 1400,
    projectileSpeed: 0,
    pellets: 1,
    spread: 0,
    superShots: 0,
    superBreaksWalls: false,
    superRangeMultiplier: 2.5,
    color: 0x8f00ff,
    accent: 0xffd700,
    superCharge: 8,
    // Exotic mechanics tuning
    attackDelayMs: 800,
    attackRadius: 90,
    strikesToStun: 3,
    stunMs: 500,
    superDurationMs: 3000,
    superAreaRadius: 520,
    hyperchargeDelayMultiplier: 0.6,
    superHomingAccuracy: 0.7,
  },
  {
    id: 'evil_doctor',
    rarity: 'Legendary',
    name: 'Evil Doctor',
    role: 'Controller',
    description: 'A risky specialist whose syringe either infects enemies or heals him if it misses.',
    attackName: 'To Infect or Not to Infect',
    attackDescription: 'Shoot a syringe. Hit: applies 600 poison damage x3. Miss: heals you for 300 x4.',
    superName: 'Spread My Virus!',
    superDescription: 'Releases 6 DNA strands that jump to enemies, deal 500 impact damage, then poison for 4 seconds.',
    hyperchargeName: 'Mutant Overflow',
    hyperchargeDescription: 'Main attack triggers both hit and miss effects. Hyper DNA kills release 6 more hyper DNA from you.',
    gadgetOne: 'Antidote Burst: Cleanse active poison/burn and instantly heal 1200 HP.',
    gadgetTwo: 'Loaded Syringe: Your next main attack applies 1 extra poison tick.',
    starPowerOne: 'Chain Reaction: Every kill releases 1 DNA. If that DNA kills, it spawns a full super DNA burst from that spot.',
    starPowerTwo: 'Panic Protocol: Missing your main attack grants a short speed boost.',
    health: 6700,
    speed: 245,
    damage: 500,
    reloadMs: 1450,
    projectileSpeed: 880,
    pellets: 1,
    spread: 0,
    superShots: 6,
    superBreaksWalls: false,
    superRangeMultiplier: 1.0,
    color: 0x7bd34f,
    accent: 0x4a9e2f,
    superCharge: 6,
  },
  {
    id: 'goonbob',
    rarity: 'Rare',
    name: 'Goonbob',
    role: 'Controller',
    description: 'This brawler is currently disabled.',
    attackName: 'Gooey Splatter',
    attackDescription: 'This brawler is currently disabled.',
    superName: 'Goonbob in a Jar!',
    superDescription: 'This brawler is currently disabled.',
    hyperchargeName: 'Sticky Mess',
    hyperchargeDescription: 'This brawler is currently disabled.',
    gadgetOne: 'This brawler is currently disabled.',
    gadgetTwo: 'This brawler is currently disabled.',
    starPowerOne: 'This brawler is currently disabled.',
    starPowerTwo: 'This brawler is currently disabled.',
    health: 7200,
    speed: 250,
    damage: 600,
    reloadMs: 1300,
    projectileSpeed: 800,
    pellets: 1,
    spread: 0,
    superShots: 1,
    superBreaksWalls: false,
    superRangeMultiplier: 1.2,
    color: 0xadff2f,
    accent: 0x32cd32,
    superCharge: 6,
    disabled: true,
  }
];

export function isBrawlerDisabled(id: string) {
  return BRAWLERS.some((brawler) => brawler.id === id && !!brawler.disabled);
}

export function getPlayableBrawlers() {
  return BRAWLERS.filter((brawler) => !brawler.disabled);
}

export function getBrawlerById(id: string): BrawlerSpec {
  return BRAWLERS.find((brawler) => brawler.id === id) ?? BRAWLERS[0];
}
