import Phaser from 'phaser';
import { getBrawlerProgress, getBrickRankLabel, getBrickRoadMilestones, getNextBrickRankInfo, sessionState } from '../state';
import { getBrawlerById } from '../types';

export class HomeScene extends Phaser.Scene {
  constructor() {
    super('HomeScene');
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    const selectedBrawler = getBrawlerById(sessionState.selectedBrawlerId);
    const progress = getBrawlerProgress(sessionState.selectedBrawlerId);
    const currentRank = getBrickRankLabel(progress);
    const nextRank = getNextBrickRankInfo(progress);
    const milestones = getBrickRoadMilestones(progress, 4);

    this.cameras.main.setBackgroundColor('#08111f');
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x060b15, 0x08111f, 0x132543, 0x0a1326, 1);
    graphics.fillRect(0, 0, width, height);
    graphics.lineStyle(1, 0x22314d, 0.45);

    for (let x = 0; x <= width; x += 150) {
      graphics.lineBetween(x, 0, x, height);
    }
    for (let y = 0; y <= height; y += 150) {
      graphics.lineBetween(0, y, width, y);
    }

    graphics.fillStyle(0x5df2c2, 0.13);
    graphics.fillCircle(width * 0.18, height * 0.22, 120);
    graphics.fillStyle(0xff9b42, 0.16);
    graphics.fillCircle(width * 0.78, height * 0.18, 160);
    graphics.fillStyle(0x6ee7ff, 0.12);
    graphics.fillCircle(width * 0.84, height * 0.78, 180);
    graphics.fillStyle(0x101b34, 0.92);
    graphics.fillRoundedRect(width * 0.52, height * 0.08, width * 0.42, height * 0.82, 34);
    graphics.lineStyle(4, 0x6ee7ff, 0.35);
    graphics.strokeRoundedRect(width * 0.52, height * 0.08, width * 0.42, height * 0.82, 34);
    graphics.destroy();

    this.add.text(64, 48, 'BRAWL ARENA', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '74px',
      fontStyle: 'bold',
      color: '#f5f7ff',
      stroke: '#07111e',
      strokeThickness: 8,
    });

    this.add.text(68, 132, 'BRICK ROAD + SOLO TRIAL', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '30px',
      fontStyle: 'bold',
      color: '#5df2c2',
      stroke: '#07111e',
      strokeThickness: 5,
    });

    this.add.text(68, 182, 'Pick a brawler, push the brick road forward, or jump into a solo gauntlet before the full arena.', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '20px',
      color: '#c9d7ff',
      wordWrap: { width: width * 0.42 },
      lineSpacing: 10,
    });

    const createPanel = (x: number, y: number, panelW: number, panelH: number, fill: number, stroke: number) => {
      const panel = this.add.graphics();
      panel.fillStyle(fill, 0.96);
      panel.fillRoundedRect(x, y, panelW, panelH, 28);
      panel.lineStyle(3, stroke, 0.5);
      panel.strokeRoundedRect(x, y, panelW, panelH, 28);
      return panel;
    };

    createPanel(56, 258, width * 0.44, 300, 0x101b34, 0x2a6f9b);
    createPanel(width * 0.54, 256, width * 0.38, 340, 0x12213e, 0x6ee7ff);

    this.add.text(84, 284, 'HOW TO PLAY', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '24px',
      color: '#f4a261',
      fontStyle: 'bold',
    });

    const instructions = [
      '• Move with WASD or Arrow Keys',
      '• Shoot with click or SPACE',
      '• Many unique brawlers available',
      '• Break walls with your super',
      '• Last player standing wins showdown',
    ];

    instructions.forEach((instruction, index) => {
      this.add.text(84, 338 + index * 40, instruction, {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '18px',
        color: '#c0d4ff',
      });
    });

    this.add.text(width * 0.58, 284, 'BRICK ROAD', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#ffd36e',
    });

    this.add.text(width * 0.58, 326, currentRank.toUpperCase(), {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '36px',
      fontStyle: 'bold',
      color: '#f5f7ff',
    });

    this.add.text(width * 0.58, 366, `Next: ${nextRank.label}  •  Reward: ${nextRank.reward}`, {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '16px',
      color: '#c0d4ff',
      wordWrap: { width: width * 0.3 },
    });

    const progressBarX = width * 0.58;
    const progressBarY = 408;
    const progressBarW = width * 0.32;
    const progressGraphics = this.add.graphics();
    progressGraphics.fillStyle(0x07111e, 1);
    progressGraphics.fillRoundedRect(progressBarX, progressBarY, progressBarW, 18, 9);
    const progressPct = Math.min(1, nextRank.current / nextRank.threshold);
    progressGraphics.fillStyle(nextRank.color, 1);
    progressGraphics.fillRoundedRect(progressBarX, progressBarY, progressBarW * progressPct, 18, 9);

    milestones.forEach((milestone, index) => {
      const markerX = progressBarX + (index + 1) * (progressBarW / (milestones.length + 1));
      const marker = this.add.circle(markerX, progressBarY + 9, 7, milestone.color, 1).setStrokeStyle(3, 0x08111f, 1);
      this.add.text(markerX, progressBarY + 30, milestone.label, {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '12px',
        color: '#c0d4ff',
      }).setOrigin(0.5, 0);
      this.add.text(markerX, progressBarY + 48, milestone.reward, {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '11px',
        color: '#93a7da',
      }).setOrigin(0.5, 0);
      marker.setDepth(1);
    });
    progressGraphics.destroy();

    const featureCardX = width * 0.57;
    const featureCardY = height * 0.58;
    const featureGraphics = this.add.graphics();
    featureGraphics.fillStyle(0x0d172d, 0.98);
    featureGraphics.fillRoundedRect(featureCardX, featureCardY, width * 0.32, 220, 28);
    featureGraphics.lineStyle(3, 0xff9b42, 0.45);
    featureGraphics.strokeRoundedRect(featureCardX, featureCardY, width * 0.32, 220, 28);
    featureGraphics.fillStyle(0xff9b42, 1);
    featureGraphics.fillCircle(featureCardX + 116, featureCardY + 98, 62);
    featureGraphics.lineStyle(6, 0xffdc86, 1);
    featureGraphics.strokeCircle(featureCardX + 116, featureCardY + 98, 62);
    featureGraphics.fillStyle(0xffffff, 0.9);
    featureGraphics.fillCircle(featureCardX + 92, featureCardY + 86, 12);
    featureGraphics.fillStyle(0x0a1020, 1);
    featureGraphics.fillCircle(featureCardX + 136, featureCardY + 112, 8);
    featureGraphics.destroy();

    this.add.text(featureCardX + 24, featureCardY + 162, selectedBrawler.name.toUpperCase(), {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#f5f7ff',
    });
    this.add.text(featureCardX + 24, featureCardY + 194, `${selectedBrawler.rarity.toUpperCase()} BRAWLER`, {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '16px',
      color: '#5df2c2',
    });
    this.add.text(featureCardX + 24, featureCardY + 220, selectedBrawler.description, {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '18px',
      color: '#c0d4ff',
      wordWrap: { width: width * 0.28 },
      lineSpacing: 8,
    });

    const buttonY = height - 96;

    const createButton = (
      x: number,
      label: string,
      widthValue: number,
      fillColor: number,
      hoverColor: number,
      onClick: () => void,
    ) => {
      const buttonBackground = this.add.rectangle(x, buttonY, widthValue, 52, fillColor)
        .setOrigin(0.5)
        .setStrokeStyle(0, 0x000000, 0)
        .setInteractive({ useHandCursor: true });

      const buttonLabel = this.add.text(x, buttonY, label, {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '20px',
        fontStyle: 'bold',
        color: '#08101d',
      }).setOrigin(0.5).setDepth(1);

      buttonBackground.on('pointerdown', onClick);
      buttonBackground.on('pointerover', () => {
        buttonBackground.setFillStyle(hoverColor);
        buttonBackground.setScale(1.05);
        buttonLabel.setScale(1.05);
      });
      buttonBackground.on('pointerout', () => {
        buttonBackground.setFillStyle(fillColor);
        buttonBackground.setScale(1);
        buttonLabel.setScale(1);
      });
    };

    createButton(width * 0.13, 'BRAWLERS', 180, 0xf4a261, 0xffd36e, () => {
      this.scene.start('BrawlerSelectScene');
    });

    createButton(width * 0.31, 'SOLO TRIAL', 190, 0x6ee7ff, 0xb7f2ff, () => {
      sessionState.isBossFight = false;
      sessionState.isSoloMode = true;
      sessionState.soloWave = 0;
      this.scene.start('ShowdownScene');
    });

    createButton(width * 0.49, 'SHOWDOWN', 190, 0x5df2c2, 0x9afcff, () => {
      sessionState.isBossFight = false;
      sessionState.isSoloMode = false;
      sessionState.soloWave = 0;
      this.scene.start('ShowdownScene');
    });

    createButton(width * 0.67, 'BOSS FIGHT', 190, 0xe74c3c, 0xff7675, () => {
      sessionState.isBossFight = true;
      sessionState.isSoloMode = false;
      sessionState.soloWave = 0;
      this.scene.start('ShowdownScene');
    });

    if (sessionState.persistent.starrDrops > 0) {
      createButton(width * 0.86, `TAPPER UPPERS (${sessionState.persistent.starrDrops})`, 280, 0x9b59b6, 0xd6a2e8, () => {
        this.scene.start('StarrDropScene');
      });
    }

    this.add.text(width - 40, 40, `COINS: ${sessionState.persistent.coins}`, {
      fontFamily: 'Trebuchet MS, sans-serif', fontSize: '24px', fontStyle: 'bold', color: '#f1c40f'
    }).setOrigin(1, 0.5);

    this.add.text(width * 0.12, height - 42, 'Landscape only · Brick road progression · Solo trial · Web + Android ready', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '14px',
      color: '#93a7da',
    });

    // Wire up HTML button handlers
    const startMatchBtn = document.getElementById('startMatch');
    const brawlerBtn = document.getElementById('brawlerBtn');
    const homeScreen = document.getElementById('homeScreen');

    if (startMatchBtn) {
      startMatchBtn.addEventListener('click', () => {
        if (homeScreen) homeScreen.style.display = 'none';
        sessionState.isBossFight = false;
        sessionState.isSoloMode = false;
        sessionState.soloWave = 0;
        this.scene.start('ShowdownScene');
      });
    }

    if (brawlerBtn) {
      brawlerBtn.addEventListener('click', () => {
        if (homeScreen) homeScreen.style.display = 'none';
        this.scene.start('BrawlerSelectScene');
      });
    }
  }
}
