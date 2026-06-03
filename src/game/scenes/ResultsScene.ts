import Phaser from 'phaser';
import { sessionState, saveState, awardBricksForPlacement, getBrickRankLabel } from '../state';

export class ResultsScene extends Phaser.Scene {
  constructor() {
    super('ResultsScene');
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    const progress = sessionState.persistent.brawlerProgress[sessionState.selectedBrawlerId];
    const placement = Math.max(1, sessionState.aliveCount || 15);

    // Award Coins
    const coinReward = Math.floor(sessionState.playerScore / 10) + (sessionState.gameResult === 'win' ? 100 : 20);
    sessionState.persistent.coins += coinReward;

    // Award Tapper Upper (max 12 a day)
    let earnedDrop = false;
    if (sessionState.persistent.starrDropsToday < 12) {
      sessionState.persistent.starrDrops++;
      sessionState.persistent.starrDropsToday++;
      earnedDrop = true;
    }

    // First win: award one Super Tapper Upper (only once)
    if (sessionState.gameResult === 'win' && !sessionState.persistent.firstWinSuperAwarded) {
      sessionState.persistent.superTapperCount = (sessionState.persistent.superTapperCount || 0) + 1;
      sessionState.persistent.firstWinSuperAwarded = true;
    }

    const brickDelta = awardBricksForPlacement(progress, placement);

    saveState();

    this.cameras.main.setBackgroundColor('#08111f');
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x08111f, 0x08111f, 0x10213a, 0x091122, 1);
    graphics.fillRect(0, 0, width, height);

    const isWin = sessionState.gameResult === 'win';
    const titleText = isWin ? 'VICTORY!' : 'DEFEATED!';
    const titleColor = isWin ? '#5df2c2' : '#ff6b6b';

    this.add.text(width / 2, 100, titleText, {
      fontFamily: 'Trebuchet MS, sans-serif', fontSize: '74px', fontStyle: 'bold', color: titleColor,
      stroke: '#07111e', strokeThickness: 8,
    }).setOrigin(0.5);

    const card = this.add.graphics();
    card.fillStyle(0x101b34, 0.95);
    card.fillRoundedRect(width / 2 - 300, height / 2 - 160, 600, 320, 30);
    card.lineStyle(3, 0x5df2c2, 0.45);
    card.strokeRoundedRect(width / 2 - 300, height / 2 - 160, 600, 320, 30);

    this.add.text(width / 2, height / 2 - 100, `Score: ${sessionState.playerScore}`, {
      fontFamily: 'Trebuchet MS, sans-serif', fontSize: '32px', color: '#f5f7ff',
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 - 50, `Coins Gained: +${coinReward}`, {
      fontFamily: 'Trebuchet MS, sans-serif', fontSize: '28px', color: '#f1c40f',
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 - 5, `Bricks: ${brickDelta >= 0 ? '+' : ''}${brickDelta}`, {
      fontFamily: 'Trebuchet MS, sans-serif', fontSize: '24px', color: brickDelta >= 0 ? '#5df2c2' : '#ff6b6b',
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 26, `Rank: ${getBrickRankLabel(progress)}`, {
      fontFamily: 'Trebuchet MS, sans-serif', fontSize: '20px', color: '#c0d4ff',
    }).setOrigin(0.5);

    if (earnedDrop) {
      this.add.text(width / 2, height / 2 + 60, 'TAPPER UPPER EARNED!', {
        fontFamily: 'Trebuchet MS, sans-serif', fontSize: '24px', fontStyle: 'bold', color: '#9b59b6',
      }).setOrigin(0.5);
      this.add.text(width / 2, height / 2 + 90, `(${sessionState.persistent.starrDropsToday}/12 today)`, {
        fontFamily: 'Trebuchet MS, sans-serif', fontSize: '16px', color: '#c0d4ff',
      }).setOrigin(0.5);
    }

    if (sessionState.persistent.superTapperCount && sessionState.persistent.superTapperCount > 0) {
      this.add.text(width / 2, height / 2 + 120, 'SUPER TAPPER UPPER AWARDED!', {
        fontFamily: 'Trebuchet MS, sans-serif', fontSize: '18px', fontStyle: 'bold', color: '#ff00ff',
      }).setOrigin(0.5);
    }

    const buttonY = height - 100;

    const createBtn = (x: number, label: string, color: number, onClick: () => void) => {
      const bg = this.add.rectangle(x, buttonY, 200, 52, color).setInteractive({ useHandCursor: true });
      this.add.text(x, buttonY, label, {
        fontFamily: 'Trebuchet MS, sans-serif', fontSize: '18px', fontStyle: 'bold', color: '#08101d',
      }).setOrigin(0.5);
      bg.on('pointerdown', onClick);
    };

    createBtn(width / 2 - 220, 'PLAY AGAIN', 0xf4a261, () => {
      this.scene.start('ShowdownScene');
    });

    createBtn(width / 2, 'HOME', 0x5df2c2, () => {
      this.resetMatchState();
      this.scene.start('HomeScene');
    });

    if (sessionState.persistent.starrDrops > 0) {
      createBtn(width / 2 + 160, 'OPEN TAPPER UPPER', 0x9b59b6, () => {
        this.resetMatchState();
        this.scene.start('StarrDropScene');
      });
    }

    if (sessionState.persistent.superTapperCount && sessionState.persistent.superTapperCount > 0) {
      createBtn(width / 2 + 340, 'OPEN SUPER TAPPER', 0xff00ff, () => {
        this.resetMatchState();
        this.scene.start('StarrDropScene');
      });
    }
  }

  private resetMatchState() {
    sessionState.gameResult = '';
    sessionState.playerScore = 0;
    sessionState.aliveCount = 10;
    sessionState.isBossFight = false;
    sessionState.isSoloMode = false;
    sessionState.soloWave = 0;
  }
}
