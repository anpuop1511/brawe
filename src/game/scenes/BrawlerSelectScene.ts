import Phaser from 'phaser';
import { sessionState, saveState, getBrawlerProgress, getBrickRankLabel, getBrickRoadMilestones, getNextBrickRankInfo, getEvilDoctorUnlockRemainingMs, isEvilDoctorUnlocked, startEvilDoctorUnlockCountdown } from '../state';
import { BRAWLERS, getBrawlerById, BrawlerSpec } from '../types';

export class BrawlerSelectScene extends Phaser.Scene {
  private selectedId: string = BRAWLERS[0].id;
  private detailContainer?: Phaser.GameObjects.Container;
  private coinText?: Phaser.GameObjects.Text;
  private popupContainer?: Phaser.GameObjects.Container;
  private sortMode: 'rarity-desc' | 'rarity-asc' | 'power-level' | 'name' | 'role' = 'rarity-desc';

  constructor() {
    super('BrawlerSelectScene');
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    
    this.selectedId = sessionState.selectedBrawlerId || BRAWLERS[0].id;
    if (getBrawlerById(this.selectedId).disabled || this.isLockedBrawler(this.selectedId)) {
      this.selectedId = BRAWLERS.find((brawler) => !brawler.disabled)?.id ?? BRAWLERS[0].id;
    }

    this.sortMode = ((sessionState.persistent as any).brawlerSortMode as typeof this.sortMode) || 'rarity-desc';

    // Container for the right-hand detail panel
    this.detailContainer = this.add.container(240, 100);

    this.cameras.main.setBackgroundColor('#08111f');

    // Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x08111f, 0x08111f, 0x101b34, 0x0a1326, 1);
    bg.fillRect(0, 0, width, height);
    bg.lineStyle(1, 0x22314d, 0.4);
    for (let x = 0; x <= width; x += 120) bg.lineBetween(x, 0, x, height);
    for (let y = 0; y <= height; y += 120) bg.lineBetween(0, y, width, y);

    this.add.text(40, 30, 'BRAWLERS', {
      fontFamily: 'Trebuchet MS, sans-serif', fontSize: '48px', fontStyle: 'bold', color: '#f5f7ff',
      stroke: '#07111e', strokeThickness: 8,
    });

    const sortBtn = this.add.rectangle(260, 34, 170, 34, 0x1d2948, 0.95).setInteractive({ useHandCursor: true }).setStrokeStyle(2, 0x6ee7ff, 0.45);
    const sortLabel = this.add.text(260, 34, `SORT: ${this.getSortModeLabel()}`, {
      fontFamily: 'Trebuchet MS, sans-serif', fontSize: '14px', fontStyle: 'bold', color: '#c0d4ff',
    }).setOrigin(0.5);
    sortBtn.on('pointerdown', () => {
      this.sortMode = this.nextSortMode(this.sortMode);
      (sessionState.persistent as any).brawlerSortMode = this.sortMode;
      saveState();
      this.scene.restart();
    });

    this.coinText = this.add.text(width - 40, 45, `COINS: ${sessionState.persistent.coins}`, {
      fontFamily: 'Trebuchet MS, sans-serif', fontSize: '24px', fontStyle: 'bold', color: '#f1c40f',
    }).setOrigin(1, 0.5);

    // Daily wins / rewards panel
    const dailyX = width - 40;
    const dailyY = 95;
    const dailyBg = this.add.rectangle(dailyX, dailyY, 320, 80, 0x0b1730, 0.6).setOrigin(1, 0);
    dailyBg.setStrokeStyle(2, 0x2a6f9b, 0.4);
    const dailyText = this.add.text(dailyX - 8, dailyY + 12, `Daily Wins: ${sessionState.persistent.starrDropsToday}`, {
      fontFamily: 'Trebuchet MS, sans-serif', fontSize: '14px', color: '#c0d4ff'
    }).setOrigin(1, 0);
    const rewardsText = this.add.text(dailyX - 8, dailyY + 36, `Tapper Rewards Today: ${sessionState.persistent.starrDrops}`, {
      fontFamily: 'Trebuchet MS, sans-serif', fontSize: '14px', color: '#c0d4ff'
    }).setOrigin(1, 0);
    const superText = this.add.text(dailyX - 8, dailyY + 56, `Super Tappers: ${sessionState.persistent.superTapperCount || 0}`, {
      fontFamily: 'Trebuchet MS, sans-serif', fontSize: '14px', color: '#ff00ff'
    }).setOrigin(1, 0);
    this.detailContainer?.add([dailyBg, dailyText, rewardsText, superText]);

    // Button to open super tappers from brawler tab
    if ((sessionState.persistent.superTapperCount || 0) > 0) {
      const openBtn = this.add.rectangle(dailyX - 160, dailyY + 120, 220, 44, 0xff00ff).setInteractive({ useHandCursor: true });
      const openTxt = this.add.text(dailyX - 160, dailyY + 120, `OPEN SUPER TAPPERS (${sessionState.persistent.superTapperCount})`, {
        fontFamily: 'Trebuchet MS, sans-serif', fontSize: '14px', color: '#08101d', fontStyle: 'bold'
      }).setOrigin(0.5);
      this.detailContainer?.add([openBtn, openTxt]);
      openBtn.on('pointerdown', () => {
        this.scene.start('StarrDropScene');
      });
    }

    this.createBrawlerPicker();

    // Populate the detail panel for the selected brawler
    this.showBrawlerDetails();

    // Home Button
    const homeBtn = this.add.rectangle(100, height - 60, 160, 50, 0xf8b26a).setInteractive({ useHandCursor: true });
    this.add.text(100, height - 60, '← HOME', {
      fontFamily: 'Trebuchet MS, sans-serif', fontSize: '18px', fontStyle: 'bold', color: '#08101d',
    }).setOrigin(0.5);
    homeBtn.on('pointerdown', () => this.scene.start('HomeScene'));

    // Select/Start Button
    const selectedBrawler = getBrawlerById(this.selectedId);
    const isDisabledSelection = !!selectedBrawler.disabled || this.isLockedBrawler(this.selectedId);
    const startBtn = this.add.rectangle(width - 140, height - 60, 220, 50, isDisabledSelection ? 0x888888 : 0x5df2c2)
      .setInteractive({ useHandCursor: !isDisabledSelection });
    this.add.text(width - 140, height - 60, isDisabledSelection ? 'LOCKED' : 'SELECT & PLAY →', {
      fontFamily: 'Trebuchet MS, sans-serif', fontSize: '18px', fontStyle: 'bold', color: '#08101d',
    }).setOrigin(0.5);
    startBtn.on('pointerdown', () => {
      if (isDisabledSelection) return;
      sessionState.selectedBrawlerId = this.selectedId;
      this.scene.start('ShowdownScene');
    });
  }

  private createBrawlerPicker() {
    const startY = 104;
    const spacing = Math.min(60, Math.floor((this.scale.height - 220) / Math.max(1, BRAWLERS.length - 1)));

    this.getSortedBrawlers().forEach((brawler, index) => {
      const y = startY + index * spacing;
      const isSelected = this.selectedId === brawler.id;
      const isDisabled = !!brawler.disabled || this.isLockedBrawler(brawler.id);
      const rarityColor = this.getRarityColor(brawler.rarity);
      const isFavorite = this.isFavoriteBrawler(brawler.id);

      const itemBg = this.add.rectangle(120, y, 160, 60, isDisabled ? 0x4a4a4a : (isSelected ? 0x5df2c2 : 0x1a2a4f), isDisabled ? 0.45 : (isSelected ? 1 : 0.6))
        .setInteractive({ useHandCursor: !isDisabled })
        .setStrokeStyle(isSelected ? 3 : 0, 0xffffff);

      const favoriteBtn = this.add.rectangle(180, y - 22, 24, 24, isFavorite ? 0xffd166 : 0x34495e, 0.95)
        .setStrokeStyle(2, isFavorite ? 0xfff1b8 : 0xffffff, 0.3)
        .setInteractive({ useHandCursor: !isDisabled });
      this.add.text(180, y - 22, isFavorite ? '★' : '☆', {
        fontFamily: 'Trebuchet MS, sans-serif', fontSize: '14px', fontStyle: 'bold', color: '#08111f',
      }).setOrigin(0.5);
      if (!isDisabled) {
        favoriteBtn.on('pointerdown', (_pointer: Phaser.Input.Pointer, _localX: number, _localY: number, event: Phaser.Types.Input.EventData) => {
          event.stopPropagation();
          this.toggleFavoriteBrawler(brawler.id);
        });
      }

      this.add.text(120, y - 10, brawler.name.toUpperCase(), {
        fontFamily: 'Trebuchet MS, sans-serif', fontSize: '15px', fontStyle: 'bold', color: isDisabled ? '#999999' : (isSelected ? '#08111f' : '#f5f7ff'),
      }).setOrigin(0.5);

      const roleLabel = brawler.disabled
        ? 'DISABLED'
        : (this.isLockedBrawler(brawler.id) ? `LOCKED ${this.formatDuration(getEvilDoctorUnlockRemainingMs())}` : brawler.role.toUpperCase());
      this.add.text(120, y + 11, roleLabel, {
        fontFamily: 'Trebuchet MS, sans-serif', fontSize: '10px', fontStyle: 'bold', color: isDisabled ? '#ff9b9b' : '#c0d4ff',
      }).setOrigin(0.5);

      this.add.rectangle(120, y + 24, 92, 18, rarityColor, isDisabled ? 0.35 : 0.8).setStrokeStyle(1, 0xffffff, 0.2);
      this.add.text(120, y + 24, brawler.rarity.toUpperCase(), {
        fontFamily: 'Trebuchet MS, sans-serif', fontSize: '9px', fontStyle: 'bold', color: '#08111f',
      }).setOrigin(0.5);

      if (!isDisabled) {
        itemBg.on('pointerdown', () => {
          this.selectedId = brawler.id;
          this.scene.restart();
        });
      }
    });
  }

  private showBrawlerDetails() {
    const brawler = getBrawlerById(this.selectedId);
    const progress = getBrawlerProgress(this.selectedId);
    const width = this.scale.width;
    const height = this.scale.height;

    if (this.detailContainer) this.detailContainer.destroy();
    this.detailContainer = this.add.container(240, 100);

    const panelWidth = width - 280;
    const panelHeight = height - 200;

    // Show disabled message if brawler is disabled
    if (brawler.disabled) {
      const disabledContainer = this.add.container(panelWidth / 2, height / 2 - 100);
      const disabledBg = this.add.rectangle(0, 0, 400, 300, 0x2a1a1a, 0.9).setStrokeStyle(2, 0xff6b6b, 1);
      const disabledText = this.add.text(0, -60, 'BRAWLER DISABLED', {
        fontFamily: 'Trebuchet MS, sans-serif', fontSize: '32px', fontStyle: 'bold', color: '#ff6b6b',
        align: 'center'
      }).setOrigin(0.5);
      const disabledDesc = this.add.text(0, 40, 'This brawler is currently disabled\nand unable to select or use\nanywhere in the game.', {
        fontFamily: 'Trebuchet MS, sans-serif', fontSize: '16px', color: '#ff9999',
        align: 'center', wordWrap: { width: 350 }
      }).setOrigin(0.5);
      disabledContainer.add([disabledBg, disabledText, disabledDesc]);
      this.detailContainer.add(disabledContainer);
      return;
    }

    if (this.isLockedBrawler(brawler.id)) {
      const remaining = getEvilDoctorUnlockRemainingMs();
      const lockBox = this.add.rectangle(panelWidth / 2, 260, 520, 280, 0x1f1826, 0.95).setStrokeStyle(3, 0xb983ff, 0.8);
      const lockTitle = this.add.text(panelWidth / 2, 200, 'BRAWLER LOCKED', {
        fontFamily: 'Trebuchet MS, sans-serif', fontSize: '34px', fontStyle: 'bold', color: '#e8ccff',
      }).setOrigin(0.5);
      const lockDesc = this.add.text(panelWidth / 2, 250, `Soul Summonor switch unlocks in:\n${this.formatDuration(remaining)}`, {
        fontFamily: 'Trebuchet MS, sans-serif', fontSize: '20px', color: '#d8c8f3', align: 'center',
      }).setOrigin(0.5);
      const lockBtn = this.add.rectangle(panelWidth / 2, 330, 380, 52, 0xb983ff).setInteractive({ useHandCursor: true });
      const lockBtnTxt = this.add.text(panelWidth / 2, 330, 'START 4-DAY UNLOCK FROM NOW', {
        fontFamily: 'Trebuchet MS, sans-serif', fontSize: '16px', fontStyle: 'bold', color: '#08101d',
      }).setOrigin(0.5);
      lockBtn.on('pointerdown', () => {
        startEvilDoctorUnlockCountdown();
        saveState();
        this.scene.restart();
      });
      this.detailContainer.add([lockBox, lockTitle, lockDesc, lockBtn, lockBtnTxt]);
      return;
    }

    // Character in the middle
    const portrait = this.add.graphics();
    portrait.fillStyle(brawler.color, 1);
    portrait.fillCircle(panelWidth / 2, 140, 100);
    portrait.lineStyle(8, brawler.accent, 1);
    portrait.strokeCircle(panelWidth / 2, 140, 100);
    portrait.fillStyle(0xffffff, 0.9);
    portrait.fillCircle(panelWidth / 2 - 30, 120, 15);
    portrait.fillStyle(0x0a1020, 1);
    portrait.fillCircle(panelWidth / 2 + 30, 150, 12);
    this.detailContainer.add(portrait);

    const nameText = this.add.text(panelWidth / 2, 260, brawler.name.toUpperCase(), {
      fontFamily: 'Trebuchet MS, sans-serif', fontSize: '42px', fontStyle: 'bold', color: '#f5f7ff',
    }).setOrigin(0.5);
    this.detailContainer.add(nameText);

    const rarityColor = this.getRarityColor(brawler.rarity);
    const rarityPill = this.add.rectangle(panelWidth / 2, 222, 180, 28, rarityColor, 0.95).setStrokeStyle(2, 0xffffff, 0.25);
    const rarityText = this.add.text(panelWidth / 2, 222, brawler.rarity.toUpperCase(), {
      fontFamily: 'Trebuchet MS, sans-serif', fontSize: '13px', fontStyle: 'bold', color: '#08111f',
    }).setOrigin(0.5);
    this.detailContainer.add([rarityPill, rarityText]);

    const levelText = this.add.text(panelWidth / 2, 310, `POWER LEVEL ${progress.level}`, {
      fontFamily: 'Trebuchet MS, sans-serif', fontSize: '24px', fontStyle: 'bold', color: '#5df2c2',
    }).setOrigin(0.5);
    this.detailContainer.add(levelText);

    // Stats on the right
    const statMult = 0.55 + (progress.level - 1) * 0.045;
    const nextStatMult = 0.55 + (progress.level) * 0.045;
    const statsX = panelWidth - 220;
    const statsY = 40;
    [
      ['HEALTH', Math.round(brawler.health * statMult), Math.round(brawler.health * nextStatMult) - Math.round(brawler.health * statMult)],
      ['DAMAGE', Math.round(brawler.damage * statMult), Math.round(brawler.damage * nextStatMult) - Math.round(brawler.damage * statMult)],
      ['SPEED', brawler.speed, 0]
    ].forEach(([label, value, gain], i) => {
      this.detailContainer?.add(this.add.text(statsX, statsY + i * 60, label as string, {
        fontFamily: 'Trebuchet MS, sans-serif', fontSize: '14px', color: '#c0d4ff'
      }));
      this.detailContainer?.add(this.add.text(statsX, statsY + i * 60 + 20, value.toString(), {
        fontFamily: 'Trebuchet MS, sans-serif', fontSize: '22px', fontStyle: 'bold', color: '#f5f7ff'
      }));
      if (gain && progress.level < 11) {
        this.detailContainer?.add(this.add.text(statsX + 80, statsY + i * 60 + 24, `(+${gain})`, {
          fontFamily: 'Trebuchet MS, sans-serif', fontSize: '14px', fontStyle: 'bold', color: '#5df2c2'
        }));
      }
    });

    // Upgrade Button
    const upgradeCost = this.getUpgradeCost(progress.level);
    const canUpgrade = progress.level < 11 && sessionState.persistent.coins >= upgradeCost;
    
    if (progress.level < 11) {
      const upBtn = this.add.rectangle(panelWidth / 2, 370, 200, 50, canUpgrade ? 0xf1c40f : 0x34495e).setInteractive({ useHandCursor: true });
      const upTxt = this.add.text(panelWidth / 2, 370, `UPGRADE: ${upgradeCost}`, {
        fontFamily: 'Trebuchet MS, sans-serif', fontSize: '18px', fontStyle: 'bold', color: '#08101d',
      }).setOrigin(0.5);
      this.detailContainer.add([upBtn, upTxt]);

      upBtn.on('pointerdown', () => {
        if (canUpgrade) {
          sessionState.persistent.coins -= upgradeCost;
          progress.level++;
          saveState();
          this.scene.restart();
        }
      });
    } else {
      this.detailContainer.add(this.add.text(panelWidth / 2, 370, 'MAX LEVEL REACHED', {
        fontFamily: 'Trebuchet MS, sans-serif', fontSize: '18px', fontStyle: 'bold', color: '#e74c3c',
      }).setOrigin(0.5));
    }

    const brickRank = getBrickRankLabel(progress);
    const nextRank = getNextBrickRankInfo(progress);
    const rankPill = this.add.rectangle(panelWidth / 2, 340, 220, 38, 0x1d2948, 0.95).setStrokeStyle(2, 0x6ee7ff, 0.45);
    const rankText = this.add.text(panelWidth / 2, 340, `${brickRank}  •  NEXT ${nextRank.label} ${progress.bricks || 0}/${nextRank.threshold}`, {
      fontFamily: 'Trebuchet MS, sans-serif', fontSize: '16px', fontStyle: 'bold', color: '#c0d4ff',
    }).setOrigin(0.5);
    this.detailContainer.add([rankPill, rankText]);

    const barX = panelWidth / 2 - 160;
    const barY = 382;
    const brickBar = this.add.graphics();
    brickBar.fillStyle(0x07111e, 0.95);
    brickBar.fillRoundedRect(barX, barY, 320, 16, 8);
    const brickPct = Math.min(1, nextRank.current / nextRank.threshold);
    const brickColor = nextRank.color;
    brickBar.fillStyle(brickColor, 1);
    brickBar.fillRoundedRect(barX, barY, 320 * brickPct, 16, 8);
    this.detailContainer.add(brickBar);

    const brickRoadMilestones = getBrickRoadMilestones(progress, 4);
    brickRoadMilestones.forEach((milestone, index) => {
      const x = barX + ((index + 1) * 320) / (brickRoadMilestones.length + 1);
      const tick = this.add.circle(x, barY + 8, 6, milestone.color, 1).setStrokeStyle(2, 0x08111f, 1);
      const label = this.add.text(x, barY + 26, milestone.label, {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '11px',
        color: '#c0d4ff',
      }).setOrigin(0.5, 0);
      const reward = this.add.text(x, barY + 42, milestone.reward, {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '10px',
        color: '#93a7da',
      }).setOrigin(0.5, 0);
      this.detailContainer?.add([tick, label, reward]);
    });

    const iconRowY = 470;
    const iconXs = [
      panelWidth / 2 - 240,
      panelWidth / 2 - 120,
      panelWidth / 2,
      panelWidth / 2 + 120,
      panelWidth / 2 + 240,
    ];
    const iconDefs = [
      { key: 'attack', label: 'A', color: 0xf5f7ff, title: 'ATTACK', desc: brawler.attackDescription, locked: false },
      { key: 'super', label: 'S', color: 0xf4a261, title: 'SUPER', desc: brawler.superDescription, locked: false },
      { key: 'gadget', label: 'G', color: 0x3498db, title: 'GADGET', desc: progress.gadgetUnlocked ? (progress.selectedGadget === 'g1' ? brawler.gadgetOne : brawler.gadgetTwo) : 'Unlocked at Power 7', locked: !progress.gadgetUnlocked, unlockLevel: 7 },
      { key: 'star', label: '★', color: 0xf1c40f, title: 'STAR POWER', desc: progress.starPowerUnlocked ? (progress.selectedStar === 'one' ? brawler.starPowerOne : brawler.starPowerTwo) : 'Unlocked at Power 9', locked: !progress.starPowerUnlocked, unlockLevel: 9 },
      { key: 'hc', label: 'HC', color: 0x9b59b6, title: 'HYPERCHARGE', desc: progress.hyperchargeUnlocked ? brawler.hyperchargeDescription : 'Unlocked at Power 11', locked: !progress.hyperchargeUnlocked, unlockLevel: 11 },
    ];

    iconDefs.forEach((icon, index) => {
      const x = iconXs[index];
      const outer = this.add.circle(x, iconRowY, 44, icon.color, icon.locked ? 0.16 : 0.3).setStrokeStyle(4, icon.locked ? 0x34495e : icon.color, 1);
      const inner = this.add.circle(x, iconRowY, 28, 0x08111f, 0.92).setStrokeStyle(2, 0xffffff, 0.12);
      const label = this.add.text(x, iconRowY, icon.label, {
        fontFamily: 'Trebuchet MS, sans-serif', fontSize: icon.key === 'hc' ? '18px' : '22px', fontStyle: 'bold', color: icon.locked ? '#666666' : '#ffffff',
      }).setOrigin(0.5);
      const button = this.add.zone(x - 44, iconRowY - 44, 88, 88).setOrigin(0.5).setInteractive({ useHandCursor: true });
      button.on('pointerdown', () => this.openAbilityPopup(icon, progress, brawler));
      this.detailContainer?.add([outer, inner, label, button]);
    });

    const chosenText = this.add.text(panelWidth / 2, 540, `Selected: ${progress.selectedGadget === 'g2' ? brawler.gadgetTwo : brawler.gadgetOne} | ${progress.selectedStar === 'two' ? brawler.starPowerTwo : brawler.starPowerOne}`, {
      fontFamily: 'Trebuchet MS, sans-serif', fontSize: '12px', color: '#c0d4ff',
      wordWrap: { width: panelWidth - 120 }, align: 'center'
    }).setOrigin(0.5, 0);
    this.detailContainer.add(chosenText);

    if (brawler.id === 'decayer' && !isEvilDoctorUnlocked()) {
      const unlockBtn = this.add.rectangle(panelWidth / 2, 602, 420, 44, 0xb983ff).setInteractive({ useHandCursor: true });
      const unlockTxt = this.add.text(panelWidth / 2, 602, 'SOUL SUMMONOR SWITCH: UNLOCK EVIL DOCTOR', {
        fontFamily: 'Trebuchet MS, sans-serif', fontSize: '14px', fontStyle: 'bold', color: '#08101d',
      }).setOrigin(0.5);
      unlockBtn.on('pointerdown', () => {
        startEvilDoctorUnlockCountdown();
        this.selectedId = 'evil_doctor';
        saveState();
        this.scene.restart();
      });
      this.detailContainer.add([unlockBtn, unlockTxt]);
    }
  }

  private getUpgradeCost(level: number): number {
    const costs: Record<number, number> = {
      1: 20, 2: 35, 3: 75, 4: 140, 5: 290, 6: 480, 7: 800, 8: 1250, 9: 1875, 10: 2800, 11: 4200
    };
    return costs[level] || 99999;
  }

  private getSortedBrawlers() {
    const rarityOrder: Record<BrawlerSpec['rarity'], number> = {
      Common: 0,
      Rare: 1,
      'Super Rare': 2,
      Epic: 3,
      Mythic: 4,
      Legendary: 5,
      Exotic: 6,
    };

    const list = [...BRAWLERS];
    switch (this.sortMode) {
      case 'power-level':
        return list.sort((left, right) => {
          const favoriteDiff = Number(this.isFavoriteBrawler(right.id)) - Number(this.isFavoriteBrawler(left.id));
          if (favoriteDiff) return favoriteDiff;
          const leftLevel = getBrawlerProgress(left.id).level;
          const rightLevel = getBrawlerProgress(right.id).level;
          return rightLevel - leftLevel || left.name.localeCompare(right.name);
        });
      case 'name':
        return list.sort((left, right) => left.name.localeCompare(right.name));
      case 'role':
        return list.sort((left, right) => left.role.localeCompare(right.role) || left.name.localeCompare(right.name));
      case 'rarity-asc':
        return list.sort((left, right) => {
          const favoriteDiff = Number(this.isFavoriteBrawler(right.id)) - Number(this.isFavoriteBrawler(left.id));
          if (favoriteDiff) return favoriteDiff;
          return rarityOrder[left.rarity] - rarityOrder[right.rarity] || left.name.localeCompare(right.name);
        });
      default:
        return list.sort((left, right) => {
          const favoriteDiff = Number(this.isFavoriteBrawler(right.id)) - Number(this.isFavoriteBrawler(left.id));
          if (favoriteDiff) return favoriteDiff;
          return rarityOrder[right.rarity] - rarityOrder[left.rarity] || left.name.localeCompare(right.name);
        });
    }
  }

  private nextSortMode(current: typeof this.sortMode) {
    const modes: typeof this.sortMode[] = ['rarity-desc', 'rarity-asc', 'power-level', 'name', 'role'];
    const index = modes.indexOf(current);
    return modes[(index + 1) % modes.length];
  }

  private getSortModeLabel() {
    switch (this.sortMode) {
      case 'rarity-asc': return 'RARITY ↑';
      case 'power-level': return 'POWER ↓';
      case 'name': return 'A-Z';
      case 'role': return 'ROLE';
      default: return 'RARITY ↓';
    }
  }

  private getRarityColor(rarity: BrawlerSpec['rarity']) {
    const colors: Record<BrawlerSpec['rarity'], number> = {
      Common: 0x9fb4c7,
      Rare: 0x5df2c2,
      'Super Rare': 0x6ee7ff,
      Epic: 0xf1c40f,
      Mythic: 0xff7bd1,
      Legendary: 0xff9b42,
      Exotic: 0xb983ff,
    };

    return colors[rarity] || 0xc0d4ff;
  }

  private isFavoriteBrawler(id: string) {
    return Array.isArray(sessionState.persistent.favoriteBrawlers) && sessionState.persistent.favoriteBrawlers.includes(id);
  }

  private toggleFavoriteBrawler(id: string) {
    const favorites = Array.isArray(sessionState.persistent.favoriteBrawlers) ? [...sessionState.persistent.favoriteBrawlers] : [];
    const index = favorites.indexOf(id);
    if (index >= 0) favorites.splice(index, 1);
    else favorites.unshift(id);
    sessionState.persistent.favoriteBrawlers = favorites;
    saveState();
    this.scene.restart();
  }

  private closePopup() {
    if (this.popupContainer) {
      this.popupContainer.destroy();
      this.popupContainer = undefined;
    }
  }

  private openAbilityPopup(icon: { title: string; desc: string; color: number; locked: boolean; unlockLevel?: number; key: string }, progress: any, brawler: BrawlerSpec) {
    this.closePopup();
    const width = this.scale.width;
    const height = this.scale.height;
    const overlay = this.add.container(0, 0);
    const dark = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.72).setInteractive();
    const card = this.add.rectangle(width / 2, height / 2, 560, 360, 0x101b34, 0.98).setStrokeStyle(3, icon.color, 0.65);
    const title = this.add.text(width / 2, height / 2 - 130, icon.title, {
      fontFamily: 'Trebuchet MS, sans-serif', fontSize: '34px', fontStyle: 'bold', color: '#f5f7ff',
    }).setOrigin(0.5);
    const desc = this.add.text(width / 2, height / 2 - 70, icon.desc, {
      fontFamily: 'Trebuchet MS, sans-serif', fontSize: '18px', color: '#c0d4ff', align: 'center', wordWrap: { width: 460 },
    }).setOrigin(0.5);

    const closeBtn = this.add.rectangle(width / 2 + 210, height / 2 - 130, 40, 40, 0xff6b6b).setInteractive({ useHandCursor: true });
    const closeTxt = this.add.text(width / 2 + 210, height / 2 - 130, 'X', {
      fontFamily: 'Trebuchet MS, sans-serif', fontSize: '18px', fontStyle: 'bold', color: '#08101d',
    }).setOrigin(0.5);
    closeBtn.on('pointerdown', () => this.closePopup());

    overlay.add([dark, card, title, desc, closeBtn, closeTxt]);

    if (icon.key === 'gadget' && progress.gadgetUnlocked) {
      const g1 = this.add.rectangle(width / 2 - 120, height / 2 + 70, 180, 48, progress.selectedGadget === 'g1' ? 0x5df2c2 : 0x34495e).setInteractive({ useHandCursor: true });
      const g1t = this.add.text(width / 2 - 120, height / 2 + 70, brawler.gadgetOne, { fontFamily: 'Trebuchet MS, sans-serif', fontSize: '12px', color: '#08101d', wordWrap: { width: 150 }, align: 'center' }).setOrigin(0.5);
      const g2 = this.add.rectangle(width / 2 + 120, height / 2 + 70, 180, 48, progress.selectedGadget === 'g2' ? 0x5df2c2 : 0x34495e).setInteractive({ useHandCursor: true });
      const g2t = this.add.text(width / 2 + 120, height / 2 + 70, brawler.gadgetTwo, { fontFamily: 'Trebuchet MS, sans-serif', fontSize: '12px', color: '#08101d', wordWrap: { width: 150 }, align: 'center' }).setOrigin(0.5);
      g1.on('pointerdown', () => { progress.selectedGadget = 'g1'; saveState(); this.scene.restart(); });
      g2.on('pointerdown', () => { progress.selectedGadget = 'g2'; saveState(); this.scene.restart(); });
      overlay.add([g1, g1t, g2, g2t]);
    } else if (icon.key === 'star' && progress.starPowerUnlocked) {
      const s1 = this.add.rectangle(width / 2 - 120, height / 2 + 70, 180, 48, progress.selectedStar === 'one' ? 0xf1c40f : 0x34495e).setInteractive({ useHandCursor: true });
      const s1t = this.add.text(width / 2 - 120, height / 2 + 70, brawler.starPowerOne, { fontFamily: 'Trebuchet MS, sans-serif', fontSize: '12px', color: '#08101d', wordWrap: { width: 150 }, align: 'center' }).setOrigin(0.5);
      const s2 = this.add.rectangle(width / 2 + 120, height / 2 + 70, 180, 48, progress.selectedStar === 'two' ? 0xf1c40f : 0x34495e).setInteractive({ useHandCursor: true });
      const s2t = this.add.text(width / 2 + 120, height / 2 + 70, brawler.starPowerTwo, { fontFamily: 'Trebuchet MS, sans-serif', fontSize: '12px', color: '#08101d', wordWrap: { width: 150 }, align: 'center' }).setOrigin(0.5);
      s1.on('pointerdown', () => { progress.selectedStar = 'one'; saveState(); this.scene.restart(); });
      s2.on('pointerdown', () => { progress.selectedStar = 'two'; saveState(); this.scene.restart(); });
      overlay.add([s1, s1t, s2, s2t]);
    } else if (icon.key === 'hc' || icon.key === 'attack' || icon.key === 'super') {
      const helper = this.add.text(width / 2, height / 2 + 70, icon.locked ? `Unlock at Power ${icon.unlockLevel}` : 'Available now', {
        fontFamily: 'Trebuchet MS, sans-serif', fontSize: '18px', color: icon.locked ? '#ff8b8b' : '#5df2c2',
      }).setOrigin(0.5);
      overlay.add(helper);
    }

    this.popupContainer = overlay;
  }

  private isLockedBrawler(id: string) {
    return id === 'evil_doctor' && !isEvilDoctorUnlocked();
  }

  private formatDuration(ms: number) {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  }
}
