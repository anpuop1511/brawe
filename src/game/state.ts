import { BRAWLERS, PersistentState } from './types';

const EVIL_DOCTOR_UNLOCK_MS = 4 * 24 * 60 * 60 * 1000;

export interface BrickRoadTier {
  label: string;
  threshold: number;
  color: number;
  glow: boolean;
  reward: string;
}

export const BRICK_ROAD_TIERS: BrickRoadTier[] = [
  { label: 'Brick', threshold: 0, color: 0x8b5a2b, glow: false, reward: 'Starter lane' },
  { label: 'Clay Brick', threshold: 100, color: 0xb37a4b, glow: false, reward: '+20 coins' },
  { label: 'Bronze Brick', threshold: 250, color: 0xcd7f32, glow: false, reward: 'Tapper Upper chance' },
  { label: 'Steel Brick', threshold: 450, color: 0x8ea0b5, glow: false, reward: '+40 coins' },
  { label: 'Silver Brick', threshold: 650, color: 0xc0c7d6, glow: false, reward: 'Road boost' },
  { label: 'Gold Brick', threshold: 825, color: 0xffd36e, glow: false, reward: '+1 brick chest' },
  { label: 'Prism Brick', threshold: 1000, color: 0x6ee7ff, glow: true, reward: 'Prestige reset' },
];

export interface ControlState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  firing: boolean;
}

export const controlState: ControlState = {
  up: false,
  down: false,
  left: false,
  right: false,
  firing: false,
};

function getDefaultPersistentState(): PersistentState {
  const brawlerProgress: Record<string, any> = {};
  BRAWLERS.forEach(b => {
    brawlerProgress[b.id] = {
      level: 1,
      bricks: 0,
      prestige: 0,
      gadgetUnlocked: false,
      starPowerUnlocked: false,
      hyperchargeUnlocked: false,
      // new persistent selections
      selectedStar: 'one',
      selectedGadget: 'g1'
    };
  });

  return {
    coins: 500,
    starrDrops: 0,
    starrDropsToday: 0,
    lastDate: new Date().toDateString(),
    brawlerProgress,
    favoriteBrawlers: [],
    evilDoctorUnlockEndAt: undefined,
  };
}

function loadState(): PersistentState {
  const saved = localStorage.getItem('brawl_arena_save');
  const defaults = getDefaultPersistentState();
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      parsed.brawlerProgress = parsed.brawlerProgress || {};
      parsed.coins = Number.isFinite(parsed.coins) ? parsed.coins : defaults.coins;
      parsed.starrDrops = Number.isFinite(parsed.starrDrops) ? parsed.starrDrops : defaults.starrDrops;
      parsed.starrDropsToday = Number.isFinite(parsed.starrDropsToday) ? parsed.starrDropsToday : defaults.starrDropsToday;
      if (!parsed.lastDate) parsed.lastDate = defaults.lastDate;
      if (!Number.isFinite(parsed.evilDoctorUnlockEndAt)) parsed.evilDoctorUnlockEndAt = defaults.evilDoctorUnlockEndAt;
      // Reset daily starr drops if date changed
      if (parsed.lastDate !== new Date().toDateString()) {
        parsed.starrDropsToday = 0;
        parsed.lastDate = new Date().toDateString();
      }
      // Merge brawler progress for any new brawlers
      BRAWLERS.forEach(b => {
        if (!parsed.brawlerProgress[b.id]) {
          parsed.brawlerProgress[b.id] = { ...defaults.brawlerProgress[b.id] };
        } else {
          parsed.brawlerProgress[b.id].bricks = parsed.brawlerProgress[b.id].bricks || 0;
          parsed.brawlerProgress[b.id].prestige = parsed.brawlerProgress[b.id].prestige || 0;
          // Ensure selection keys exist for older saves
          parsed.brawlerProgress[b.id].selectedStar = parsed.brawlerProgress[b.id].selectedStar || defaults.brawlerProgress[b.id].selectedStar;
          parsed.brawlerProgress[b.id].selectedGadget = parsed.brawlerProgress[b.id].selectedGadget || defaults.brawlerProgress[b.id].selectedGadget;
        }
      });
      if (!Array.isArray(parsed.favoriteBrawlers)) parsed.favoriteBrawlers = [];
      parsed.favoriteBrawlers = parsed.favoriteBrawlers.filter((id: string) => BRAWLERS.some((b) => b.id === id));
      // Super Tapper Upper (first-win) tracking and one-time grant
      if (parsed.superTapperCount === undefined) parsed.superTapperCount = 0;
      if (parsed.firstWinSuperAwarded === undefined) parsed.firstWinSuperAwarded = false;
      if (parsed.gratuitousSuperGiven === undefined) parsed.gratuitousSuperGiven = false;
      // Give everyone 3 free Super Tappers once as compensation
      if (!parsed.gratuitousSuperGiven) {
        parsed.superTapperCount = (parsed.superTapperCount || 0) + 3;
        parsed.gratuitousSuperGiven = true;
      }
      return parsed;
    } catch (e) {
      return defaults;
    }
  }
  return defaults;
}

export const sessionState = {
  selectedBrawlerId: 'outlit',
  playerScore: 0,
  aliveCount: 10,
  gameResult: '' as 'win' | 'loss' | '',
  isBossFight: false,
  isSoloMode: false,
  soloWave: 0,
  persistent: loadState(),
};

export function saveState() {
  localStorage.setItem('brawl_arena_save', JSON.stringify(sessionState.persistent));
}

export function getEvilDoctorUnlockRemainingMs(now = Date.now()) {
  const unlockAt = sessionState.persistent.evilDoctorUnlockEndAt;
  if (!unlockAt) return EVIL_DOCTOR_UNLOCK_MS;
  return Math.max(0, unlockAt - now);
}

export function isEvilDoctorUnlocked(now = Date.now()) {
  const unlockAt = sessionState.persistent.evilDoctorUnlockEndAt;
  return Boolean(unlockAt && now >= unlockAt);
}

export function startEvilDoctorUnlockCountdown(now = Date.now()) {
  if (!sessionState.persistent.evilDoctorUnlockEndAt) {
    sessionState.persistent.evilDoctorUnlockEndAt = now + EVIL_DOCTOR_UNLOCK_MS;
    saveState();
  }
}

export function getBrawlerProgress(id: string) {
  return sessionState.persistent.brawlerProgress[id] || { level: 1, bricks: 0, prestige: 0, gadgetUnlocked: false, starPowerUnlocked: false, hyperchargeUnlocked: false };
}

export function getBrickRankLabel(progress: { bricks?: number; prestige?: number }) {
  const prestige = progress.prestige || 0;
  const bricks = progress.bricks || 0;
  if (prestige > 0) return `Prestige ${prestige}`;

  let currentLabel = BRICK_ROAD_TIERS[0].label;
  BRICK_ROAD_TIERS.forEach((tier) => {
    if (bricks >= tier.threshold) {
      currentLabel = tier.label;
    }
  });

  return currentLabel;
}

export function getNextBrickRankInfo(progress: { bricks?: number; prestige?: number }) {
  const bricks = progress.bricks || 0;
  const prestige = progress.prestige || 0;

  if (prestige > 0) {
    return {
      label: `Prestige ${prestige + 1}`,
      threshold: 1000,
      current: bricks,
      color: 0xff00ff,
      glow: true,
      reward: 'Prestige ladder',
    };
  }

  const nextTier = BRICK_ROAD_TIERS.find((tier) => tier.threshold > bricks) ?? BRICK_ROAD_TIERS[BRICK_ROAD_TIERS.length - 1];
  return {
    label: nextTier.label,
    threshold: nextTier.threshold,
    current: bricks,
    color: nextTier.color,
    glow: nextTier.glow,
    reward: nextTier.reward,
  };
}

export function getBrickRoadMilestones(progress: { bricks?: number; prestige?: number }, count = 4) {
  const bricks = progress.bricks || 0;
  const prestige = progress.prestige || 0;

  if (prestige > 0) {
    return [{ label: `Prestige ${prestige + 1}`, threshold: 1000, current: bricks, color: 0xff00ff, glow: true, reward: 'Prestige ladder' }];
  }

  return BRICK_ROAD_TIERS.filter((tier) => tier.threshold > bricks).slice(0, count).map((tier) => ({
    ...tier,
    current: bricks,
  }));
}

export function getBrickOpponentLevel(progress: { bricks?: number; prestige?: number; level?: number }) {
  const bricks = progress.bricks || 0;
  const prestige = progress.prestige || 0;
  if (prestige >= 2) return 11;
  if (prestige === 1) return 10 + (bricks >= 650 ? 1 : 0);
  if (bricks >= 1000) return 10;
  if (bricks >= 825) return 9 + Math.floor(Math.random() * 2);
  if (bricks >= 650) return 8 + Math.floor(Math.random() * 2);
  if (bricks >= 450) return 6 + Math.floor(Math.random() * 2);
  if (bricks >= 250) return 4 + Math.floor(Math.random() * 2);
  if (bricks >= 100) return 2 + Math.floor(Math.random() * 2);
  return 1 + Math.floor(Math.random() * 2);
}

export function awardBricksForPlacement(progress: any, placement: number) {
  const safePlacement = Math.max(1, Math.min(15, placement));
  const awards = [
    30, 26, 22, 18, 14, 10, 6, 2, -1, -3, -5, -7, -9, -11, -13,
  ];
  const delta = awards[safePlacement - 1] ?? -5;
  progress.bricks = Math.max(0, (progress.bricks || 0) + delta);
  while (progress.bricks >= 1000) {
    progress.bricks -= 1000;
    progress.prestige = (progress.prestige || 0) + 1;
  }
  return delta;
}
