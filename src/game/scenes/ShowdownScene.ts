import Phaser from 'phaser';
import { controlState, sessionState, getBrawlerProgress, getBrickOpponentLevel, isEvilDoctorUnlocked } from '../state';
import { BRAWLERS, getBrawlerById, BrawlerSpec, GAME_CONFIG, AIBot, getPlayableBrawlers, isBrawlerDisabled } from '../types';

type PlayerSprite = Phaser.Physics.Arcade.Sprite & {
  health: number;
  maxHealth: number;
  label: Phaser.GameObjects.Text;
  baseTint: number;
  isPlayer?: boolean;
  slowUntil?: number;
  rootedUntil?: number;
  team?: string;
  isParrot?: boolean;
  isEgg?: boolean;
  isHyperParrot?: boolean;
  laidEgg?: boolean;
  parrotSp2?: boolean;
  hatchTime?: number;
  ai?: AIBotBrain;
  fireUntil?: number;
  fireTickAt?: number;
  fireStacks?: number;
  goonSplatterTime?: number;
  isGoonLiquid?: boolean;
  superCharge?: number;
  isHypercharged?: boolean;
  isChairSpinning?: boolean;
  chairSpinTimer?: number;
  chairSpinDamageTimer?: number;
  chairSpinSpeedMult?: number;
  overlordStage?: number;
  overlordUpgradeUntil?: number;
  damageMult?: number;
  level?: number;
  gadgetUnlocked?: boolean;
  starPowerUnlocked?: boolean;
  hyperchargeUnlocked?: boolean;
  overlordStrikeCount?: number;
  overlordStunReady?: boolean;
  invincibleUntil?: number;
  speedBoostUntil?: number;
  trapperVulnerableUntil?: number;
  trapperVulnerableMult?: number;
  poisonUntil?: number;
  poisonTickAt?: number;
  poisonDamagePerTick?: number;
  poisonOwnerIsPlayer?: boolean;
};

type ProjectileSprite = Phaser.Physics.Arcade.Image & {
  ownerIsPlayer: boolean;
  damage: number;
  pierceWalls: boolean;
  breakWalls: boolean;
  rangeMultiplier: number;
  pullTarget?: boolean;
  leaveTrail?: boolean;
  lastTrailAt?: number;
  ownerX?: number;
  ownerY?: number;
  applyBurn?: boolean;
  isHyperOutlit?: boolean;
  dieAt?: number;
  splitOnHit?: boolean;
  bounceDmgLoss?: number;
  bounceLifeLoss?: number;
  ownerSp2?: boolean;
  isGoonJar?: boolean;
  isGoonLiquidProj?: boolean;
  isFightnFireShot?: boolean;
  isFightnFireShard?: boolean;
  fightnFireShardCount?: number;
  fightnFireBounced?: boolean;
  bouncesLeft?: number;
  ownerWasHyper?: boolean;
  isEvilDoctorMain?: boolean;
  evilDoctorHitEffectApplied?: boolean;
  evilDoctorPoisonTicks?: number;
  evilDoctorPoisonDamage?: number;
  isEvilDna?: boolean;
  evilDnaHyper?: boolean;
  evilDnaFromStar?: boolean;
};

export class ShowdownScene extends Phaser.Scene {
  private player!: PlayerSprite;
  private playerLabel!: Phaser.GameObjects.Text;
  private hud!: Phaser.GameObjects.Text;
  private leaderboard!: Phaser.GameObjects.Text;
  private score = 0;
  private lastShotAt = 0;
  private playerSuperCharge = 0;
  private nextShotPiercesWalls = false;
  private fireKey?: Phaser.Input.Keyboard.Key;
  private keys?: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    fire: Phaser.Input.Keyboard.Key;
    gadget1: Phaser.Input.Keyboard.Key;
    gadget2: Phaser.Input.Keyboard.Key;
    superKey: Phaser.Input.Keyboard.Key;
  };
  private projectiles: ProjectileSprite[] = [];
  private bots!: Phaser.Physics.Arcade.Group;
  private botList: (PlayerSprite & { ai: AIBotBrain })[] = [];
  private walls!: Phaser.Physics.Arcade.StaticGroup;
  private projectileGroup!: Phaser.Physics.Arcade.Group;
  private brawler!: BrawlerSpec;
  private aliveBots = 9;
  
  private chairBonusRadius = 0;
  private isHypercharged = false;
  private isForestG2Armed = false;
  private fightnFireNextShotBoost = false;
  private evilDoctorNextShotBoosted = false;
  private fightnFireZones: Array<{
    x: number;
    y: number;
    radius: number;
    expireAt: number;
    nextTickAt: number;
    ownerIsPlayer: boolean;
    centerDamage: number;
    outerDamage: number;
  }> = [];
  private aimGraphics!: Phaser.GameObjects.Graphics;
  private goonLiquidGroup!: Phaser.Physics.Arcade.Group;
  private trapperGateWalls: Array<{ wall: Phaser.Physics.Arcade.Image; expireAt: number }> = [];
  private trapperFences: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    expireAt: number;
    nextTickAt: number;
    ownerIsPlayer: boolean;
    damagePerTick: number;
    vulnerabilityMult: number;
    speedBoostMult: number;
    walls: Phaser.Physics.Arcade.Image[];
  }> = [];
  private playerProgress: any = {};
  private mode: 'showdown' | 'boss' | 'solo' = 'showdown';
  private soloWave = 0;
  private soloMaxWaves = 4;
  private soloSpawnPending = false;

  constructor() {
    super('ShowdownScene');
  }

  create() {
    const requestedBrawler = getBrawlerById(sessionState.selectedBrawlerId);
    if (
      requestedBrawler.disabled ||
      isBrawlerDisabled(sessionState.selectedBrawlerId) ||
      (sessionState.selectedBrawlerId === 'evil_doctor' && !isEvilDoctorUnlocked())
    ) {
      this.brawler = getBrawlerById('outlit');
      sessionState.selectedBrawlerId = 'outlit';
    } else {
      this.brawler = requestedBrawler;
    }
    this.aimGraphics = this.add.graphics().setDepth(19);
    this.playerProgress = getBrawlerProgress(sessionState.selectedBrawlerId);

    this.cameras.main.setBackgroundColor('#08111f');
    this.physics.world.setBounds(0, 0, GAME_CONFIG.arenaWidth, GAME_CONFIG.arenaHeight);
    this.cameras.main.setBounds(0, 0, GAME_CONFIG.arenaWidth, GAME_CONFIG.arenaHeight);

    this.createTextures();
    this.drawBackground();
    this.goonLiquidGroup = this.physics.add.group();
    this.projectileGroup = this.physics.add.group();
    this.bots = this.physics.add.group();

    // Player
    const playerSpawnX = GAME_CONFIG.arenaWidth / 2;
    const playerSpawnY = GAME_CONFIG.arenaHeight / 2;
    const statMult = 0.55 + (this.playerProgress.level - 1) * 0.045;
    this.player = this.physics.add.sprite(
      playerSpawnX,
      playerSpawnY,
      this.playerTextureKey(this.brawler),
    ) as any;
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(4);
    this.player.setCircle(24, 8, 8);
    this.player.health = Math.round(this.brawler.health * statMult);
    this.player.maxHealth = Math.round(this.brawler.health * statMult);
    this.player.baseTint = 0xffffff;
    this.player.isPlayer = true;
    this.player.team = 'player';
    this.player.overlordStage = 0;
    this.player.overlordUpgradeUntil = 0;
    this.player.damageMult = statMult;
    this.player.gadgetUnlocked = this.playerProgress.gadgetUnlocked;
    this.player.starPowerUnlocked = this.playerProgress.starPowerUnlocked;
    this.player.hyperchargeUnlocked = this.playerProgress.hyperchargeUnlocked;
    // Persisted selections from BrawlerSelectScene
    (this.player as any).selectedStar = this.playerProgress.selectedStar || 'one';
    (this.player as any).selectedGadget = this.playerProgress.selectedGadget || 'g1';

    this.playerLabel = this.add
      .text(this.player.x, this.player.y - 44, `${this.brawler.name} (You)`, {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '16px',
        color: '#5df2c2',
        stroke: '#07111e',
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(5);

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);

    // HUD
    this.hud = this.add
      .text(20, 20, '', {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '14px',
        color: '#f5f7ff',
        backgroundColor: 'rgba(5, 10, 18, 0.4)',
        padding: { left: 12, right: 12, top: 10, bottom: 10 },
      })
      .setScrollFactor(0)
      .setDepth(10);

    // Leaderboard
    this.leaderboard = this.add
      .text(GAME_CONFIG.arenaWidth - 20, 20, '', {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '13px',
        color: '#f5f7ff',
        backgroundColor: 'rgba(5, 10, 18, 0.4)',
        padding: { left: 12, right: 12, top: 10, bottom: 10 },
        align: 'right',
      })
      .setScrollFactor(0)
      .setDepth(10)
      .setOrigin(1, 0);

    // Input setup
    this.keys = this.input.keyboard?.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      fire: Phaser.Input.Keyboard.KeyCodes.SPACE,
      gadget1: Phaser.Input.Keyboard.KeyCodes.Q,
      gadget2: Phaser.Input.Keyboard.KeyCodes.E,
      superKey: Phaser.Input.Keyboard.KeyCodes.SHIFT,
    }) as any;

    this.fireKey = this.keys?.fire;
    this.input.on('pointerdown', () => {
      this.tryFire(true);
    });

    this.createWalls();

    // Setup Global Projectile Collisions (Prevents memory leak from redundant listeners)
    this.physics.add.overlap(this.projectileGroup, this.walls, (p: any, wall: any) => {
      if (!p.active) return;
      if (p.isEvilDoctorMain && !p.evilDoctorHitEffectApplied) {
        this.handleEvilDoctorMainMiss(p);
      }
      if (p.isGoonLiquidProj) {
        const splat = this.add.circle(p.x, p.y, 40, 0xadff2f, 0.5) as any;
        this.physics.add.existing(splat);
        splat.isGoonLiquid = true;
        splat.ownerIsPlayer = p.ownerIsPlayer;
        splat.dieAt = p.dieAt;
        this.goonLiquidGroup.add(splat);
        p.destroy();
        return;
      }
      if (p.isFightnFireShot) {
        this.handleFightnFireImpact(p);
        return;
      }
      if (p.isFightnFireShard) {
        this.handleProjectileBounce(p);
        return;
      }
      if (p.isGoonJar) {
        this.handleJarWallHit(p);
        return;
      }
      if (p.isOverlordBolt) {
        this.handleOverlordBoltImpact(p, p.x, p.y, false);
        return;
      }
      if (p.bounceDmgLoss !== undefined) {
        this.handleProjectileBounce(p);
        return;
      }
      if (p.breakWalls) wall.destroy();
      if (!p.pierceWalls) p.destroy();
    });

    this.physics.add.overlap(this.projectileGroup, this.player, (p: any) => {
      this.onProjectileHitPlayer(p);
    });

    this.physics.world.on('worldbounds', (body: any) => {
        const p = body.gameObject;
        if (!p) return;
        if (p.isFightnFireShot) {
          this.handleFightnFireImpact(p);
          return;
        }
        if (p.isFightnFireShard || p.bounceDmgLoss !== undefined) {
             this.handleProjectileBounce(p);
        }
    });

    this.mode = sessionState.isSoloMode ? 'solo' : (sessionState.isBossFight ? 'boss' : 'showdown');

    // Spawn opponents for the selected mode
    if (this.mode === 'solo') {
      this.soloWave = 0;
      sessionState.soloWave = 0;
      this.spawnSoloTrial();
    } else if (this.mode === 'boss') {
      this.spawnBoss();
    } else {
      this.spawnBots();
    }

    this.physics.add.overlap(this.projectileGroup, this.bots, (p: any, bot: any) => {
      this.onProjectileHitBot(p, bot);
    });

    this.botList.forEach((bot) => {
      this.physics.add.collider(bot, this.walls);
    });
    this.refreshHud();
  }

  update(time: number, delta: number) {
    // Guard: ensure player exists
    if (!this.player || !this.player.active) return;

    // Player movement
    const movement = this.resolveMovement();
    let speed = this.brawler.speed * (movement.fast ? 1.15 : 1);
    if (this.brawler.id === 'overlord' && (this.player.overlordStage || 0) >= 1) {
      speed *= 1.2;
    }
    if (this.player.speedBoostUntil && time < this.player.speedBoostUntil) {
      speed *= 1.22;
    }
    const trapperFenceSpeedBoost = this.getTrapperSpeedBoostMultiplier(this.player, true, time);
    if (trapperFenceSpeedBoost > 1) {
      speed *= trapperFenceSpeedBoost;
    }
    
    if (this.player.rootedUntil && time < this.player.rootedUntil) {
      speed = 0;
    }

    if (this.player.slowUntil && time < this.player.slowUntil) {
      speed *= 0.5;
    }

    const updateSpin = (entity: PlayerSprite) => {
        if (!entity.isChairSpinning) return;
        
        entity.chairSpinTimer = (entity.chairSpinTimer || 0) - delta;
        entity.chairSpinDamageTimer = (entity.chairSpinDamageTimer || 0) - delta;

        if (entity.chairSpinDamageTimer <= 0) {
            this.triggerExplosion(entity.x, entity.y, 700, 100, entity.isPlayer || false, false);
            entity.chairSpinDamageTimer = 500;

            // SP2: Pull enemies
            const targets = entity.isPlayer ? this.botList : [this.player, ...this.botList.filter(b => b !== entity)];
            targets.forEach((t: any) => {
                if (t.active && t.health > 0) {
                    const dist = Phaser.Math.Distance.Between(entity.x, entity.y, t.x, t.y);
                    if (dist < 200) {
                        const pullAngle = Phaser.Math.Angle.Between(t.x, t.y, entity.x, entity.y);
                        t.x += Math.cos(pullAngle) * (20 * delta / 16.6);
                        t.y += Math.sin(pullAngle) * (20 * delta / 16.6);
                    }
                }
            });
        }

        if (entity.chairSpinTimer <= 0) {
            entity.isChairSpinning = false;
            if (entity.isHypercharged) {
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    this.fireProjectile(entity.x, entity.y, angle, entity.isPlayer || false, {
                        damage: 800, pierceWalls: false, breakWalls: false, rangeMultiplier: 0.5
                    });
                }
            }
        }
    };

    updateSpin(this.player);
    if (this.player.isChairSpinning) speed *= (this.player.chairSpinSpeedMult || 1);

    this.player.setVelocity(movement.x * speed, movement.y * speed);
    if (movement.x !== 0 || movement.y !== 0) {
      this.player.setRotation(Math.atan2(movement.y, movement.x) + Math.PI / 2);
    }

    // Goonbob Liquid Damage Logic
    this.goonLiquidGroup.getChildren().forEach((obj) => {
      const liquid = obj as any;
      if (time > (liquid.goonSplatterTime || 0)) {
        this.botList.forEach(bot => {
          if (bot.active && bot.health > 0 && Phaser.Math.Distance.Between(liquid.x, liquid.y, bot.x, bot.y) < 55) {
            const shooterTeam = liquid.ownerIsPlayer ? 'player' : 'bot';
            if (bot.team === shooterTeam) return;
            this.handleBotHit(bot, 150, liquid.ownerIsPlayer || false); // Tick damage
          }
        });
        if (this.player.active && !liquid.ownerIsPlayer && Phaser.Math.Distance.Between(liquid.x, liquid.y, this.player.x, this.player.y) < 55) {
            this.handlePlayerHit(150);
        }
        liquid.goonSplatterTime = time + 500;
      }
      if (liquid.dieAt && time > liquid.dieAt) liquid.destroy();
    });

    this.playerLabel.setPosition(this.player.x, this.player.y - 44);

    // Hypercharge Flame Trail
    if (this.isHypercharged && this.player.active && this.player.health > 0) {
      if (Math.random() < 0.5) {
        const circle = this.add.circle(this.player.x + (Math.random() * 30 - 15), this.player.y + (Math.random() * 30 - 15) - 10, 12 + Math.random() * 8, 0xee00ff, 0.4).setDepth(2);
        this.tweens.add({ targets: circle, alpha: 0, duration: 400, onComplete: () => circle.destroy() });
      }
      if (Math.random() < 0.3) {
        const circle2 = this.add.circle(this.player.x + (Math.random() * 20 - 10), this.player.y + (Math.random() * 20 - 10) - 15, 6 + Math.random() * 6, 0xff96ff, 0.7).setDepth(2.1);
        this.tweens.add({ targets: circle2, alpha: 0, duration: 250, onComplete: () => circle2.destroy() });
      }
    }

    this.updateFightnFireZones(time);
    this.updateTrapperZones(time);
    this.updateTrapperGateWalls(time);
    this.updatePoisonTicks(time);
    this.drawFightnFireAim();

    // Player firing
    const pointer = this.input.activePointer;
    if (pointer.isDown || controlState.firing || this.fireKey?.isDown) {
      this.tryFire(false, time);
    }

    if (this.keys && Phaser.Input.Keyboard.JustDown(this.keys.gadget1) && this.player.gadgetUnlocked) {
      if (this.brawler.id === 'chaird') {
        const pointer = this.input.activePointer;
        const targetX = pointer.worldX || this.player.x + 1;
        const targetY = pointer.worldY || this.player.y;
        const baseAngle = Phaser.Math.Angle.Between(this.player.x, this.player.y, targetX, targetY);
        [-0.3, 0, 0.3].forEach(offset => {
          this.fireChair(this.player.x, this.player.y, baseAngle + offset, 500);
        });
      } else if (this.brawler.id === 'forest') {
        // Forest G1: Rooted
        this.player.health = Math.min(this.player.maxHealth, this.player.health + 2000);
        this.player.rootedUntil = time + 3000;
        this.player.setTint(0x00ff00);
        this.time.delayedCall(3000, () => {
          if (this.player.active) this.player.clearTint();
        });
      } else if (this.brawler.id === 'fightnfire') {
        this.fightnFireNextShotBoost = true;
        this.player.setTint(0xffb347);
        this.time.delayedCall(1800, () => {
          if (this.player.active) this.player.clearTint();
        });
      } else if (this.brawler.id === 'trapper') {
        this.triggerTrapperKnockbackBlast(this.player.x, this.player.y, true);
      } else if (this.brawler.id === 'evil_doctor') {
        this.player.fireUntil = 0;
        this.player.fireTickAt = 0;
        this.player.fireStacks = 0;
        this.player.poisonUntil = 0;
        this.player.poisonTickAt = 0;
        this.player.health = Math.min(this.player.maxHealth, this.player.health + 1200);
        this.player.setTint(0x8dff8d);
        this.time.delayedCall(260, () => {
          if (this.player.active) this.player.clearTint();
        });
      } else {
        this.nextShotPiercesWalls = true;
      }
    }

    if (this.keys && Phaser.Input.Keyboard.JustDown(this.keys.gadget2) && this.player.gadgetUnlocked) {
      if (this.brawler.id === 'chaird') {
        // G2: Shield + immunity
        this.player.setTint(0x00ffff);
        this.time.delayedCall(3000, () => {
          if (this.player.active) this.player.clearTint();
        });
      } else if (this.brawler.id === 'forest') {
        // Forest G2: Grasping Vines
        this.isForestG2Armed = true;
      } else if (this.brawler.id === 'fightnfire') {
        const pointer = this.input.activePointer;
        const targetX = pointer.worldX || this.player.x + 1;
        const targetY = pointer.worldY || this.player.y;
        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, targetX, targetY);
        const hopDistance = Math.min(240, Phaser.Math.Distance.Between(this.player.x, this.player.y, targetX, targetY));
        const hopX = this.player.x + Math.cos(angle) * hopDistance;
        const hopY = this.player.y + Math.sin(angle) * hopDistance;
        this.player.invincibleUntil = time + 500;
        this.player.rootedUntil = time + 500;
        this.player.setTint(0xff914d);
        this.player.setPosition(hopX, hopY);
        this.triggerFightnFireLanding(hopX, hopY, true, true);
        this.time.delayedCall(500, () => {
          if (this.player.active) this.player.clearTint();
        });
      } else if (this.brawler.id === 'trapper') {
        const healAmount = Math.round(this.player.maxHealth * 0.32);
        this.player.health = Math.min(this.player.maxHealth, this.player.health + healAmount);
        this.player.setTint(0x6effb3);
        this.time.delayedCall(220, () => {
          if (this.player.active) this.player.clearTint();
        });
      } else if (this.brawler.id === 'evil_doctor') {
        this.evilDoctorNextShotBoosted = true;
        this.player.setTint(0xc4ff6b);
        this.time.delayedCall(1600, () => {
          if (this.player.active) this.player.clearTint();
        });
      } else {
        this.fireRadialBurst(time);
      }
    }

    if (this.keys && Phaser.Input.Keyboard.JustDown(this.keys.superKey) && this.playerSuperCharge >= 100) {
      this.fireSuperBurst(time);
      this.playerSuperCharge = 0;
    }

    // Bot AI updates
    this.botList.forEach((bot) => {
      if (bot.active && bot.health > 0) {
        updateSpin(bot);
        bot.ai.update(time, this.player, this.botList, this);

        if (bot.isHyperParrot && !bot.laidEgg && bot.health <= bot.maxHealth * 0.5) {
          bot.laidEgg = true;
          this.spawnPet(bot.x, bot.y, 'egg', bot.team || 'bot', bot.parrotSp2 || false, false);
        }
        if (bot.isEgg && bot.hatchTime && time > bot.hatchTime) {
          bot.health = 0;
          this.handleBotHit(bot, 9999, false); 
          this.spawnPet(bot.x, bot.y, 'hatchling', bot.team || 'bot', bot.parrotSp2 || false, false);
        }
      }
    });

    // Projectile cleanup
    this.projectiles = this.projectiles.filter((projectile) => {
      if (!projectile.active) {
        return false;
      }

      if (projectile.isEvilDna) {
        this.updateEvilDnaProjectile(projectile, time);
      }
      
      if (projectile.leaveTrail && time - (projectile.lastTrailAt || 0) > 200) {
        this.triggerExplosion(projectile.x, projectile.y, 400, 30, projectile.ownerIsPlayer, false);
        projectile.lastTrailAt = time;
      }
      
      if (projectile.isHyperOutlit && Math.random() < 0.3) {
          // Small purple fire particles
          const circle = this.add.circle(projectile.x, projectile.y, 4 + Math.random()*4, 0xee00ff, 0.6).setDepth(2);
          this.tweens.add({ targets: circle, alpha: 0, duration: 250, onComplete: () => circle.destroy() });
      }

      if (
        projectile.x < -80 ||
        projectile.x > GAME_CONFIG.arenaWidth + 80 ||
        projectile.y < -80 ||
        projectile.y > GAME_CONFIG.arenaHeight + 80
      ) {
        if (projectile.isEvilDoctorMain && !projectile.evilDoctorHitEffectApplied) {
          this.handleEvilDoctorMainMiss(projectile);
        }
        if (projectile.isFightnFireShot || projectile.isFightnFireShard) {
          this.handleFightnFireImpact(projectile);
        } else {
          projectile.destroy();
        }
        return false;
      }

      if (projectile.dieAt && time > projectile.dieAt) {
        if (projectile.isEvilDoctorMain && !projectile.evilDoctorHitEffectApplied) {
          this.handleEvilDoctorMainMiss(projectile);
        }
        projectile.destroy();
        return false;
      }

      return true;
    });

    // Check win/loss condition
    if (!this.player.active || this.player.health <= 0) {
      sessionState.gameResult = 'loss';
      sessionState.playerScore = this.score;
      sessionState.aliveCount = this.countAlivePlayers();
      this.scene.start('ResultsScene');
      return;
    }

    if (this.mode === 'solo') {
      if (this.soloWave >= this.soloMaxWaves && this.aliveBots <= 0 && this.player.active && this.player.health > 0) {
        sessionState.gameResult = 'win';
        sessionState.playerScore = this.score;
        sessionState.aliveCount = 1;
        this.scene.start('ResultsScene');
        return;
      }
    } else if (this.aliveBots <= 0 && this.player.active && this.player.health > 0) {
      sessionState.gameResult = 'win';
      sessionState.playerScore = this.score;
      sessionState.aliveCount = 1;
      this.scene.start('ResultsScene');
      return;
    }

    this.refreshHud();
  }

  private resolveMovement() {
    const keyboardUp = Boolean(this.keys?.up.isDown);
    const keyboardDown = Boolean(this.keys?.down.isDown);
    const keyboardLeft = Boolean(this.keys?.left.isDown);
    const keyboardRight = Boolean(this.keys?.right.isDown);

    let x = 0;
    let y = 0;

    if (keyboardLeft || controlState.left) {
      x -= 1;
    }
    if (keyboardRight || controlState.right) {
      x += 1;
    }
    if (keyboardUp || controlState.up) {
      y -= 1;
    }
    if (keyboardDown || controlState.down) {
      y += 1;
    }

    const length = Math.hypot(x, y) || 1;
    return {
      x: x / length,
      y: y / length,
      fast: Boolean(
        this.keys?.up.isDown || this.keys?.down.isDown || this.keys?.left.isDown || this.keys?.right.isDown,
      ),
    };
  }

  private tryFire(forceFromPointer: boolean, now = this.time.now) {
    if (now - this.lastShotAt < this.brawler.reloadMs && !forceFromPointer) {
      return;
    }

    const pointer = this.input.activePointer;
    const targetX = pointer.worldX || this.player.x + 1;
    const targetY = pointer.worldY || this.player.y;
    const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, targetX, targetY);
    const spawnX = this.player.x + Math.cos(angle) * 34;
    const spawnY = this.player.y + Math.sin(angle) * 34;

    const baseDamage = Math.round(this.brawler.damage * (this.player.damageMult || 1));

    // Overlord main attack: stage-based wand bolt
    if (this.brawler.id === 'overlord') {
      const stage = this.player.overlordStage || 0;
      const baseDelay = (this.brawler as any).attackDelayMs || 800;
      const delayMultiplier = this.isHypercharged ? ((this.brawler as any).hyperchargeDelayMultiplier || 0.7) : 1;
      const stageDelayMultiplier = stage >= 1 ? 0.9 : 1;
      const delay = baseDelay * delayMultiplier * stageDelayMultiplier;
      const maxRange = 900;
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, targetX, targetY);
      const clampedDist = Math.min(dist, maxRange);
      const boltX = this.player.x + Math.cos(angle) * clampedDist;
      const boltY = this.player.y + Math.sin(angle) * clampedDist;

      const teleRing = this.add.circle(boltX, boltY, (this.brawler as any).attackRadius || 54, 0xfff1ff, 0.08).setDepth(6);
      teleRing.setStrokeStyle(2, 0xd78cff, 0.8);
      teleRing.setBlendMode(Phaser.BlendModes.ADD);
      this.tweens.add({ targets: teleRing, scale: 1.08, yoyo: true, repeat: Math.floor((delay + 120) / 260), duration: 180 });
      this.tweens.add({ targets: teleRing, alpha: 0, delay: delay + 80, duration: 180, onComplete: () => teleRing.destroy() });

      this.fireProjectile(this.player.x, this.player.y, angle, true, {
        damage: Math.round(baseDamage * (stage >= 3 ? 1.1 : 1.0)),
        pierceWalls: false,
        breakWalls: false,
        rangeMultiplier: 1.2,
        applyBurn: this.isHypercharged,
        ownerX: this.player.x,
        ownerY: this.player.y,
        isOverlordBolt: true,
        overlordStage: stage,
        overlordBurst: true,
        overlordHyper: this.isHypercharged,
        hitboxMod: stage >= 3 ? 1.1 : 1,
      } as any);

      this.lastShotAt = now;
      return;
    }

    if (this.brawler.id === 'chaird') {
      const distance = Math.min(500, Phaser.Math.Distance.Between(this.player.x, this.player.y, targetX, targetY));
      this.fireChair(spawnX, spawnY, angle, distance);
      this.lastShotAt = now;
      return;
    } else if (this.brawler.id === 'forest') {
      const angles = [-0.175, 0, 0.175];
      const pull = this.isForestG2Armed && this.player.gadgetUnlocked;
      this.isForestG2Armed = false;
      
      angles.forEach((angOffset, idx) => {
        this.time.delayedCall(150 * idx, () => {
          if (!this.player.active) return;
          const fireAng = angle + angOffset;
          const px = this.player.x + Math.cos(fireAng) * 34;
          const py = this.player.y + Math.sin(fireAng) * 34;
          const _starText = (((this.player as any).selectedStar === 'one') ? this.brawler.starPowerOne : this.brawler.starPowerTwo);
          const applyBurn = (_starText.toLowerCase().includes('flaming') && idx === 1 && this.player.starPowerUnlocked) || this.isHypercharged;

          this.fireProjectile(px, py, fireAng, true, {
            damage: baseDamage, pierceWalls: this.nextShotPiercesWalls, breakWalls: false, rangeMultiplier: 0.72, pullTarget: pull, leaveTrail: true, ownerX: this.player.x, ownerY: this.player.y, applyBurn: applyBurn
          });
        });
      });
      this.nextShotPiercesWalls = false;
      this.lastShotAt = now;
      return;
    } else if (this.brawler.id === 'goonbob') {
      const count = this.isHypercharged ? 2 : 1;
      const sp1 = ((((this.player as any).selectedStar === 'one') ? this.brawler.starPowerOne : this.brawler.starPowerTwo).toLowerCase().includes('industrial')) && this.player.starPowerUnlocked;
      const rooted = this.nextShotPiercesWalls && this.player.gadgetUnlocked;
      
      for (let i = 0; i < count; i++) {
        this.time.delayedCall(i * 200, () => {
          if (!this.player.active) return;
          const fireAng = angle + (i === 1 ? 0.1 : 0);
          const px = this.player.x + Math.cos(fireAng) * 34;
          const py = this.player.y + Math.sin(fireAng) * 34;
          
          this.fireProjectile(px, py, fireAng, true, {
            damage: baseDamage,
            pierceWalls: false,
            breakWalls: false,
            rangeMultiplier: 0.8,
            isGoonLiquidProj: true,
            pullTarget: rooted, // Using pullTarget logic to trigger root/slow in collision
            dieAt: this.time.now + (sp1 ? 7000 : 5000)
          });
        });
      }
      this.nextShotPiercesWalls = false;
      this.lastShotAt = now;
      return;
    } else if (this.brawler.id === 'bouncin_balls') {
      let balls = 6;
      if ((((this.player as any).selectedStar === 'one') ? this.brawler.starPowerOne : this.brawler.starPowerTwo).toLowerCase().includes('desperation') && this.player.health / this.player.maxHealth <= 0.3 && this.player.starPowerUnlocked) {
        balls = 7;
      }
      const rangeMult = (this.nextShotPiercesWalls && this.player.gadgetUnlocked ? 1.5 : 1.0) * (this.isHypercharged ? 1.2 : 1.0);
      const sp2 = this.brawler.starPowerTwo.toLowerCase().includes('momentum') && this.player.starPowerUnlocked;
      
      for (let i = 0; i < balls; i++) {
        this.time.delayedCall(i * 88, () => { // Delay +10%
          if (!this.player.active) return;
          const isShiny = balls === 7 && i === 6;
          const px = this.player.x + Math.cos(angle) * 34;
          const py = this.player.y + Math.sin(angle) * 34;
          this.fireProjectile(px, py, angle, true, {
            damage: isShiny ? baseDamage * 1.2 : baseDamage, pierceWalls: false, breakWalls: false, rangeMultiplier: rangeMult, isHyperOutlit: this.isHypercharged || isShiny,
            bounceDmgLoss: 0.05, bounceLifeLoss: 0.05, ownerSp2: sp2, hitboxMod: 1.5
          });
        });
      }
      this.nextShotPiercesWalls = false; // Consume G1
      this.lastShotAt = now;
      return;
    } else if (this.brawler.id === 'fightnfire') {
      const boosted = this.fightnFireNextShotBoost;
      this.fightnFireNextShotBoost = false;
      const throwDistance = boosted ? 1100 : 900;
      const shardCount = boosted ? 8 : 4;
      this.fireProjectile(spawnX, spawnY, angle, true, {
        damage: Math.round(baseDamage * (boosted ? 1.2 : 1.0)),
        pierceWalls: false,
        breakWalls: false,
        rangeMultiplier: boosted ? 0.75 : 0.5,
        dieAt: now + throwDistance,
        ownerX: this.player.x,
        ownerY: this.player.y,
        isFightnFireShot: true,
        fightnFireShardCount: shardCount,
      });
      this.lastShotAt = now;
      return;
    } else if (this.brawler.id === 'trapper') {
      this.fireTrapperGateAttack(this.player, angle, true, now);
      this.lastShotAt = now;
      return;
    } else if (this.brawler.id === 'evil_doctor') {
      const boosted = this.evilDoctorNextShotBoosted;
      this.evilDoctorNextShotBoosted = false;
      this.fireProjectile(spawnX, spawnY, angle, true, {
        damage: baseDamage,
        pierceWalls: false,
        breakWalls: false,
        rangeMultiplier: 1.05,
        isEvilDoctorMain: true,
        evilDoctorPoisonTicks: boosted ? 4 : 3,
        evilDoctorPoisonDamage: 600,
      });
      if (this.isHypercharged) {
        this.applyHealOverTime(this.player, 300, 4, 350);
      }
      this.lastShotAt = now;
      return;
    }

    if (this.brawler.id === 'overlord') {
      const stage = this.player.overlordStage || 0;
      const nextStage = Math.min(3, stage + 1);
      const upgradeDuration = 900;
      const triangleAngles = [angle, angle + ((Math.PI * 2) / 3), angle + ((Math.PI * 4) / 3)];
      const triangleRadius = 62;

      this.player.overlordStage = nextStage;
      this.player.overlordUpgradeUntil = this.time.now + upgradeDuration;
      this.player.invincibleUntil = this.time.now + upgradeDuration;

      const aura = this.add.circle(this.player.x, this.player.y, 34, 0xb983ff, 0.2).setDepth(6).setBlendMode(Phaser.BlendModes.ADD);
      this.tweens.add({ targets: aura, scale: 1.9, alpha: 0, duration: upgradeDuration, onComplete: () => aura.destroy() });

      triangleAngles.forEach((protectAngle, index) => {
        const shield = this.add.circle(
          this.player.x + Math.cos(protectAngle) * triangleRadius,
          this.player.y + Math.sin(protectAngle) * triangleRadius,
          11,
          index === 1 ? 0xffd36b : 0xf7d7ff,
          0.95,
        ).setDepth(7).setBlendMode(Phaser.BlendModes.ADD);
        this.tweens.add({
          targets: shield,
          x: this.player.x + Math.cos(protectAngle) * (triangleRadius + 16),
          y: this.player.y + Math.sin(protectAngle) * (triangleRadius + 16),
          duration: upgradeDuration,
          ease: 'Sine.easeInOut',
          onComplete: () => shield.destroy(),
        });
      });

      this.time.delayedCall(120, () => {
        if (!this.player.active) return;
        triangleAngles.forEach((protectAngle) => {
          const guardX = this.player.x + Math.cos(protectAngle) * 36;
          const guardY = this.player.y + Math.sin(protectAngle) * 36;
          this.fireProjectile(guardX, guardY, protectAngle, true, {
            damage: Math.round(this.brawler.damage * 0.42),
            pierceWalls: false,
            breakWalls: false,
            rangeMultiplier: 0.65,
            applyBurn: this.isHypercharged,
            ownerX: this.player.x,
            ownerY: this.player.y,
            isOverlordBolt: true,
            overlordStage: this.player.overlordStage || 0,
            overlordGuard: true,
            overlordHyper: this.isHypercharged,
          } as any);
        });
      });

      this.time.delayedCall(upgradeDuration, () => {
        if (this.player.active) this.player.invincibleUntil = 0;
      });

      this.lastShotAt = now;
      return;
    }

    const pellets = Math.max(1, this.brawler.pellets);
    const spread = this.brawler.spread;
    const pelletDamage = Math.max(1, Math.round(baseDamage / pellets));
    const hcRangeMult = (this.isHypercharged && this.brawler.id === 'outlit') ? 1.1 : 1;

    for (let pelletIndex = 0; pelletIndex < pellets; pelletIndex++) {
      const offset = pellets === 1 ? 0 : Phaser.Math.Linear(-spread / 2, spread / 2, pelletIndex / (pellets - 1));
      this.fireProjectile(spawnX, spawnY, angle + Phaser.Math.DegToRad(offset), true, {
        damage: pelletDamage,
        pierceWalls: this.nextShotPiercesWalls,
        breakWalls: false,
        rangeMultiplier: 1.57 * hcRangeMult,
        isHyperOutlit: this.isHypercharged && this.brawler.id === 'outlit'
      });
    }

    this.nextShotPiercesWalls = false;
    this.lastShotAt = now;
  }

  private fireRadialBurst(now: number) {
    if (now - this.lastShotAt < 260) {
      return;
    }

    const shells = 8;
    const shellDamage = Math.max(1, Math.round((this.brawler.damage * (this.player.damageMult || 1)) / 2 / shells));

    for (let index = 0; index < shells; index++) {
      const angle = (Math.PI * 2 * index) / shells;
      const spawnX = this.player.x + Math.cos(angle) * 28;
      const spawnY = this.player.y + Math.sin(angle) * 28;
      this.fireProjectile(spawnX, spawnY, angle, true, {
        damage: shellDamage,
        pierceWalls: false,
        breakWalls: false,
        rangeMultiplier: 0.9,
      });
    }

    this.lastShotAt = now;
  }

  private fireOverlordStrikeAt(x: number, y: number, ownerIsPlayer: boolean, isStun: boolean) {
    const radius = (this.brawler.attackRadius || 90);
    const strikeColor = ownerIsPlayer ? 0x8f00ff : 0xff4444;

    // vertical beam visual
    const beam = this.add.graphics().setDepth(7);
    // bright core
    beam.fillStyle(0xffddff, 0.95);
    beam.fillRect(x - 6, -220, 12, (y - (-220)));
    // glow layers
    beam.fillStyle(0xff88ff, 0.18);
    beam.fillRect(x - 22, -220, 44, (y - (-220)));
    beam.fillStyle(0xff44ff, 0.08);
    beam.fillRect(x - 48, -220, 96, (y - (-220)));
    beam.setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({ targets: beam, alpha: 0, duration: 420, onComplete: () => beam.destroy() });
    // falling streak sparks
    for (let i = 0; i < 6; i++) {
      const sx = x + Phaser.Math.Between(-80, 80);
      const sy = Phaser.Math.Between(-300, -80);
      const streak = this.add.line(0, 0, sx, sy, x + Phaser.Math.Between(-16, 16), y - Phaser.Math.Between(4, 20), 0xffffff, 0.22).setOrigin(0, 0).setDepth(6);
      streak.setBlendMode(Phaser.BlendModes.ADD);
      this.tweens.add({ targets: streak, alpha: 0, duration: 360 + Phaser.Math.Between(0, 160), onComplete: () => streak.destroy() });
    }

    // impact flash + scorch ripple
    const flash = this.add.circle(x, y, 12, 0xffffff, 0.95).setDepth(8).setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({ targets: flash, scale: radius / 12, alpha: 0, duration: 420, onComplete: () => flash.destroy() });

    const scorch = this.add.circle(x, y, radius * 0.35, 0x220022, 0.9).setDepth(5);
    scorch.setStrokeStyle(2, 0x441144, 0.6);
    this.tweens.add({ targets: scorch, scale: 1.6, alpha: 0, duration: 800, ease: 'Cubic.easeOut', onComplete: () => scorch.destroy() });

    // smoke puffs
    for (let i = 0; i < 6; i++) {
      const px = x + Phaser.Math.Between(-radius * 0.6, radius * 0.6);
      const py = y + Phaser.Math.Between(-10, 20);
      const puff = this.add.circle(px, py, Phaser.Math.Between(8, 20), 0x333344, 0.65).setDepth(6);
      this.tweens.add({ targets: puff, y: py - Phaser.Math.Between(40, 100), alpha: 0, scale: 1.6, duration: 900 + Phaser.Math.Between(0, 400), onComplete: () => puff.destroy() });
    }

    // camera shake for impact
    try { this.cameras.main.shake(220, 0.008); } catch (e) {}

    // Apply damage and optional stun
    let hitAny = false;
    const damage = Math.max(1, Math.round((this.brawler.damage || 1000) * (ownerIsPlayer ? (this.player.damageMult || 1) : 1)));

    this.botList.forEach((bot) => {
      if (!bot.active || bot.health <= 0) return;
      const dist = Phaser.Math.Distance.Between(x, y, bot.x, bot.y);
      if (dist <= radius + 24) {
        if ((ownerIsPlayer && bot.team === 'player') || (!ownerIsPlayer && bot.team === 'bot')) return;
        if (isStun) {
          bot.rootedUntil = this.time.now + (this.brawler.stunMs || 500);
          bot.setTint(0xffd700);
          this.time.delayedCall(this.brawler.stunMs || 500, () => { if (bot.active) bot.clearTint(); });
        }
        this.handleBotHit(bot, damage, ownerIsPlayer);
        hitAny = true;
      }
    });

    if (!ownerIsPlayer && this.player.active && this.player.health > 0) {
      const pdist = Phaser.Math.Distance.Between(x, y, this.player.x, this.player.y);
      if (pdist <= radius + 24) {
        if (isStun) {
          this.player.rootedUntil = this.time.now + (this.brawler.stunMs || 500);
          this.player.setTint(0xffd700);
          this.time.delayedCall(this.brawler.stunMs || 500, () => { if (this.player.active) this.player.clearTint(); });
        }
        this.handlePlayerHit(damage);
        hitAny = true;
      }
    }

  }

  private fireSuperBurst(now: number) {
    if (now - this.lastShotAt < 120) {
      return;
    }

    const pointer = this.input.activePointer;
    const targetX = pointer.worldX || this.player.x + 1;
    const targetY = pointer.worldY || this.player.y;
    const baseAngle = Phaser.Math.Angle.Between(this.player.x, this.player.y, targetX, targetY);

    if (this.brawler.id === 'chaird') {
      this.player.isChairSpinning = true;
      this.player.chairSpinTimer = 5000;
      this.player.chairSpinDamageTimer = 0;
      this.player.chairSpinSpeedMult = this.isHypercharged ? 1.4 : 1.25;
      this.player.isHypercharged = this.isHypercharged;
      
      if (this.isHypercharged) {
         for(let i = 0; i < 8; i++) {
           const angle = (i / 8) * Math.PI * 2;
           this.fireProjectile(this.player.x, this.player.y, angle, true, {
             damage: 800, pierceWalls: false, breakWalls: false, rangeMultiplier: 0.5
           });
         }
      }
      this.lastShotAt = now;
      return;
    }

    if (this.brawler.id === 'goonbob') {
      const sp2 = this.brawler.starPowerTwo.toLowerCase().includes('recycling');
      const splatters = this.goonLiquidGroup.getChildren();
      
      splatters.forEach((splat: any) => {
        if (this.isHypercharged) {
          this.triggerExplosion(splat.x, splat.y, 1200, 80, true);
        }
        if (sp2) this.player.health = Math.min(this.player.maxHealth, this.player.health + 400);
        splat.destroy();
      });

      this.fireProjectile(this.player.x, this.player.y, baseAngle, true, {
        damage: 1500,
        pierceWalls: false,
        breakWalls: false,
        rangeMultiplier: 1.2,
        isGoonJar: true,
        applyBurn: true,
        ownerWasHyper: this.isHypercharged,
        ownerX: this.player.x,
        ownerY: this.player.y
      });

      this.lastShotAt = now;
      return;
    }
    
    if (this.brawler.id === 'forest') {
      this.spawnPet(this.player.x, this.player.y, 'parrot', 'player', true, this.isHypercharged);
      this.lastShotAt = now;
      return;
    }
    
    if (this.brawler.id === 'bouncin_balls') {
      const hc = this.isHypercharged;
      const balls = hc ? 10 : 7;
      const sp2 = this.brawler.starPowerTwo.toLowerCase().includes('momentum');
      const superDamage = Math.max(1, Math.round(this.brawler.damage * 1.1));
      for (let i = 0; i < balls; i++) {
        this.time.delayedCall(i * 88, () => { // Delay +10%
          if (!this.player.active) return;
          const px = this.player.x + Math.cos(baseAngle) * 34;
          const py = this.player.y + Math.sin(baseAngle) * 34;
          this.fireProjectile(px, py, baseAngle, true, {
            damage: superDamage, pierceWalls: false, breakWalls: false, rangeMultiplier: this.brawler.superRangeMultiplier * (hc ? 1.2 : 1.0),
            bounceDmgLoss: 0, bounceLifeLoss: 0, ownerSp2: sp2, splitOnHit: hc, hitboxMod: 1.5
          });
        });
      }
      this.lastShotAt = now;
      return;
    }

    if (this.brawler.id === 'fightnfire') {
      const landingDistance = Math.min(420, Phaser.Math.Distance.Between(this.player.x, this.player.y, targetX, targetY));
      const landingX = this.player.x + Math.cos(baseAngle) * landingDistance;
      const landingY = this.player.y + Math.sin(baseAngle) * landingDistance;
      this.player.invincibleUntil = now + 700;
      this.player.rootedUntil = now + 700;
      this.player.setTint(0xff914d);
      this.player.setAlpha(0.7);
      this.time.delayedCall(700, () => {
        if (!this.player.active) return;
        this.player.setPosition(landingX, landingY);
        this.player.setAlpha(1);
        this.player.clearTint();
        this.triggerFightnFireLanding(landingX, landingY, true, this.isHypercharged);
      });
      this.lastShotAt = now;
      return;
    }

    if (this.brawler.id === 'trapper') {
      const isSp1 = Boolean(this.player.starPowerUnlocked && (this.player as any).selectedStar === 'one');
      this.spawnTrapperFence(targetX, targetY, true, this.isHypercharged, isSp1);
      this.lastShotAt = now;
      return;
    }

    if (this.brawler.id === 'evil_doctor') {
      this.spawnEvilDoctorDnaBurst(this.player.x, this.player.y, true, this.isHypercharged, false);
      this.lastShotAt = now;
      return;
    }

    const superDamage = Math.max(1, Math.round(this.brawler.damage * 1.15));

    [-6, 6].forEach((offset) => {
      const angle = baseAngle + Phaser.Math.DegToRad(offset);
      const spawnX = this.player.x + Math.cos(angle) * 36;
      const spawnY = this.player.y + Math.sin(angle) * 36;
      this.fireProjectile(spawnX, spawnY, angle, true, {
        damage: superDamage,
        pierceWalls: false,
        breakWalls: this.brawler.superBreaksWalls,
        rangeMultiplier: this.brawler.superRangeMultiplier,
      });
    });

    this.lastShotAt = now;
  }

  public fireProjectile(
    x: number,
    y: number,
    angle: number,
    ownerIsPlayer: boolean,
    options: {
      damage: number;
      pierceWalls: boolean;
      breakWalls: boolean;
      rangeMultiplier: number;
      pullTarget?: boolean;
      leaveTrail?: boolean;
      ownerX?: number;
      ownerY?: number;
      applyBurn?: boolean;
      isHyperOutlit?: boolean;
      splitOnHit?: boolean;
      bounceDmgLoss?: number;
      bounceLifeLoss?: number;
      ownerSp2?: boolean;
      hitboxMod?: number;
      isGoonJar?: boolean;
      isGoonLiquidProj?: boolean;
      isFightnFireShot?: boolean;
      isFightnFireShard?: boolean;
      fightnFireShardCount?: number;
      bouncesLeft?: number;
      dieAt?: number;
      ownerWasHyper?: boolean;
      isOverlordBolt?: boolean;
      overlordStage?: number;
      overlordGuard?: boolean;
      overlordHyper?: boolean;
      isEvilDoctorMain?: boolean;
      evilDoctorPoisonTicks?: number;
      evilDoctorPoisonDamage?: number;
      isEvilDna?: boolean;
      evilDnaHyper?: boolean;
      evilDnaFromStar?: boolean;
    },
  ) {
    const projectile = this.projectileGroup.create(x, y, 'bullet') as any;
    projectile.setDepth(3);
    projectile.setCircle(7, 1, 1);
    projectile.setCollideWorldBounds(false);
    projectile.ownerIsPlayer = ownerIsPlayer;
    projectile.damage = options.damage;
    projectile.pierceWalls = options.pierceWalls;
    projectile.breakWalls = options.breakWalls;
    projectile.rangeMultiplier = options.rangeMultiplier;
    projectile.pullTarget = options.pullTarget;
    projectile.leaveTrail = options.leaveTrail;
    projectile.lastTrailAt = this.time.now;
    projectile.ownerX = options.ownerX;
    projectile.ownerY = options.ownerY;
    projectile.applyBurn = options.applyBurn;
    projectile.isHyperOutlit = options.isHyperOutlit;
    projectile.splitOnHit = options.splitOnHit;
    projectile.bounceDmgLoss = options.bounceDmgLoss;
    projectile.bounceLifeLoss = options.bounceLifeLoss;
    projectile.ownerSp2 = options.ownerSp2;
    projectile.isGoonJar = options.isGoonJar;
    projectile.isGoonLiquidProj = options.isGoonLiquidProj;
    projectile.isFightnFireShot = options.isFightnFireShot;
    projectile.isFightnFireShard = options.isFightnFireShard;
    projectile.fightnFireShardCount = options.fightnFireShardCount;
    projectile.bouncesLeft = options.bouncesLeft;
    projectile.ownerWasHyper = options.ownerWasHyper;
    projectile.isOverlordBolt = options.isOverlordBolt;
    projectile.overlordStage = options.overlordStage;
    projectile.overlordGuard = options.overlordGuard;
    projectile.overlordHyper = options.overlordHyper;
    projectile.isEvilDoctorMain = options.isEvilDoctorMain;
    projectile.evilDoctorPoisonTicks = options.evilDoctorPoisonTicks;
    projectile.evilDoctorPoisonDamage = options.evilDoctorPoisonDamage;
    projectile.isEvilDna = options.isEvilDna;
    projectile.evilDnaHyper = options.evilDnaHyper;
    projectile.evilDnaFromStar = options.evilDnaFromStar;
    projectile.dieAt = options.dieAt !== undefined ? options.dieAt : this.time.now + (1800 * options.rangeMultiplier);
    
    if (options.isGoonLiquidProj || options.isGoonJar) projectile.setTint(0xadff2f);
    if (options.isEvilDoctorMain) projectile.setTint(0xa6ff4d);
    if (options.isEvilDna) projectile.setTint(options.evilDnaHyper ? 0xff5cf4 : 0x67ff67);
    
    if (options.isHyperOutlit) {
        projectile.setTint(0xee00ff); // Purple fire bullet tint
    }
    
    if (options.hitboxMod) {
        projectile.setScale(options.hitboxMod);
        projectile.setCircle(7 * options.hitboxMod, 1, 1);
    }
    
    if (projectile.body && 'setAllowGravity' in projectile.body) {
      (projectile.body as any).setAllowGravity(false);
    }
    projectile.body?.setVelocity(
      Math.cos(angle) * this.brawler.projectileSpeed,
      Math.sin(angle) * this.brawler.projectileSpeed,
    );

    if (options.bounceDmgLoss !== undefined) {
      projectile.setBounce(1, 1);
      projectile.setCollideWorldBounds(true);
      if (projectile.body) (projectile.body as any).onWorldBounds = true;
    }

    this.projectiles.push(projectile);
  }

  private handleProjectileBounce(projectile: any) {
    if (!projectile.active) return;
    const body = projectile.body as Phaser.Physics.Arcade.Body | undefined;

    if (projectile.isFightnFireShard) {
      if (projectile.fightnFireBounced) {
        this.handleFightnFireImpact(projectile, true);
        return;
      }
      projectile.fightnFireBounced = true;
    }

    if (projectile.bouncesLeft !== undefined) {
      projectile.bouncesLeft--;
      if (projectile.bouncesLeft < 0) {
        if (projectile.isFightnFireShard) {
          this.handleFightnFireImpact(projectile, true);
        } else {
          projectile.destroy();
        }
        return;
      }
    }

    if (body) {
      body.velocity.x *= -1;
      body.velocity.y *= -1;
    }

    if (projectile.bounceDmgLoss) projectile.damage *= (1 - projectile.bounceDmgLoss);
    if (projectile.bounceLifeLoss) projectile.dieAt -= (1800 * projectile.bounceLifeLoss);
    if (projectile.ownerSp2 && projectile.body) {
      projectile.body.velocity.x *= 1.1;
      projectile.body.velocity.y *= 1.1;
    }
  }

  private handleJarWallHit(projectile: any) {
    if (projectile.ownerWasHyper) {
      const body = projectile.body as Phaser.Physics.Arcade.Body;
      const ang = Math.atan2(body.velocity.y, body.velocity.x);
      [-0.3, 0.3].forEach((off) => {
        this.fireProjectile(projectile.x, projectile.y, ang + off, projectile.ownerIsPlayer, {
          damage: 500,
          pierceWalls: false,
          breakWalls: false,
          rangeMultiplier: 0.5,
          bounceDmgLoss: 0,
          bounceLifeLoss: 0,
          bouncesLeft: 2,
          isGoonLiquidProj: true,
        });
      });
    }
    this.triggerExplosion(projectile.x, projectile.y, projectile.damage, 100, projectile.ownerIsPlayer);
    projectile.destroy();
  }

  private onProjectileHitPlayer(projectile: any) {
    if (projectile.ownerIsPlayer || !projectile.active || !this.player.active) return;

    if (projectile.isEvilDna) {
      this.handleEvilDnaHitPlayer(projectile);
      return;
    }

    if (projectile.isOverlordBolt) {
      this.handleOverlordBoltImpact(projectile, projectile.x, projectile.y, false);
      return;
    }

    if (projectile.isFightnFireShot || projectile.isFightnFireShard) {
      this.handleFightnFireImpact(projectile, false);
      return;
    }

    if (projectile.pullTarget && projectile.ownerX !== undefined) {
      const pullAngle = Phaser.Math.Angle.Between(this.player.x, this.player.y, projectile.ownerX, projectile.ownerY);
      this.player.x += Math.cos(pullAngle) * 60;
      this.player.y += Math.sin(pullAngle) * 60;
    }

    if (projectile.isEvilDoctorMain && !projectile.evilDoctorHitEffectApplied) {
      this.applyPoison(this.player, false, projectile.evilDoctorPoisonTicks || 3, projectile.evilDoctorPoisonDamage || 600);
      projectile.evilDoctorHitEffectApplied = true;
    }

    this.handleStatusEffects(this.player, projectile);
    this.handlePlayerHit(projectile.damage, projectile.ownerWasHyper ? '#ff00ff' : '#ff4d4d');
    this.handleSplitProjectile(projectile);
    projectile.destroy();
  }

  private onProjectileHitBot(projectile: any, bot: any) {
    if (!projectile.active || !bot.active) return;
    if (projectile.ownerIsPlayer && bot.team === 'player') return;
    if (!projectile.ownerIsPlayer && bot.team === 'bot') return;

    if (projectile.isEvilDna) {
      this.handleEvilDnaHitBot(projectile, bot);
      return;
    }

    if (projectile.isOverlordBolt) {
      this.handleOverlordBoltImpact(projectile, bot.x, bot.y, true);
      return;
    }

    if (projectile.isFightnFireShot || projectile.isFightnFireShard) {
      this.handleFightnFireImpact(projectile, projectile.ownerIsPlayer);
      return;
    }

    if (projectile.pullTarget && projectile.ownerX !== undefined) {
      const pullAngle = Phaser.Math.Angle.Between(bot.x, bot.y, projectile.ownerX, projectile.ownerY);
      bot.x += Math.cos(pullAngle) * 60;
      bot.y += Math.sin(pullAngle) * 60;
    }

    if (projectile.isEvilDoctorMain && !projectile.evilDoctorHitEffectApplied) {
      this.applyPoison(bot, projectile.ownerIsPlayer, projectile.evilDoctorPoisonTicks || 3, projectile.evilDoctorPoisonDamage || 600);
      projectile.evilDoctorHitEffectApplied = true;
      if (projectile.ownerIsPlayer && this.isHypercharged) {
        this.applyHealOverTime(this.player, 300, 4, 350);
      }
    }

    this.handleStatusEffects(bot, projectile);
    this.handleBotHit(bot, projectile.damage, projectile.ownerIsPlayer);
    this.handleSplitProjectile(projectile);
    if (!projectile.pierceWalls) projectile.destroy();
  }

  private handleStatusEffects(target: PlayerSprite, projectile: any) {
    if (projectile.applyBurn) {
      const now = this.time.now;
      target.fireStacks = (now > (target.fireUntil || 0)) ? 1 : (target.fireStacks || 1) + 1;
      target.fireUntil = now + 3000;
      if (!target.fireTickAt || now >= target.fireTickAt) target.fireTickAt = now + 1000;
    }
    if (projectile.isGoonJar) target.slowUntil = this.time.now + 2000;
  }

  private applyPoison(target: PlayerSprite, ownerIsPlayer: boolean, ticks: number, damagePerTick: number) {
    const now = this.time.now;
    const durationMs = Math.max(1, ticks) * 1000;
    target.poisonUntil = Math.max(target.poisonUntil || 0, now + durationMs);
    target.poisonTickAt = Math.min(target.poisonTickAt || (now + 1000), now + 1000);
    target.poisonDamagePerTick = damagePerTick;
    target.poisonOwnerIsPlayer = ownerIsPlayer;
  }

  private updatePoisonTicks(time: number) {
    const applyTick = (target: PlayerSprite) => {
      if (!target.active || target.health <= 0) return;
      if (!target.poisonUntil || time >= target.poisonUntil) return;
      if (!target.poisonTickAt || time < target.poisonTickAt) return;
      const damage = Math.max(1, target.poisonDamagePerTick || 250);
      target.poisonTickAt = time + 1000;
      if (target.isPlayer) {
        this.handlePlayerHit(damage, '#8dff4d');
      } else {
        this.handleBotHit(target, damage, Boolean(target.poisonOwnerIsPlayer), '#8dff4d');
      }
    };

    applyTick(this.player);
    this.botList.forEach((bot) => applyTick(bot));
  }

  private applyHealOverTime(target: PlayerSprite, amountPerTick: number, ticks: number, intervalMs: number) {
    for (let i = 0; i < ticks; i++) {
      this.time.delayedCall(intervalMs * (i + 1), () => {
        if (!target.active || target.health <= 0) return;
        target.health = Math.min(target.maxHealth, target.health + amountPerTick);
      });
    }
  }

  private handleEvilDoctorMainMiss(projectile: ProjectileSprite) {
    projectile.evilDoctorHitEffectApplied = true;
    if (projectile.ownerIsPlayer) {
      this.applyHealOverTime(this.player, 300, 4, 350);
      const usingSp2 = this.player.starPowerUnlocked && (this.player as any).selectedStar === 'two';
      if (usingSp2) {
        this.player.speedBoostUntil = Math.max(this.player.speedBoostUntil || 0, this.time.now + 2000);
      }
    } else {
      const ownerBot = this.botList.find((bot) => bot.active && Phaser.Math.Distance.Between(bot.x, bot.y, projectile.x, projectile.y) <= 240);
      if (ownerBot) this.applyHealOverTime(ownerBot, 300, 4, 350);
    }
  }

  public spawnEvilDoctorDnaBurst(x: number, y: number, ownerIsPlayer: boolean, isHyper: boolean, fromStar: boolean) {
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i) / 6;
      this.fireProjectile(x, y, angle, ownerIsPlayer, {
        damage: 500,
        pierceWalls: true,
        breakWalls: false,
        rangeMultiplier: isHyper ? 1.8 : 1.5,
        isEvilDna: true,
        evilDnaHyper: isHyper,
        evilDnaFromStar: fromStar,
        dieAt: this.time.now + (isHyper ? 3800 : 3200),
        hitboxMod: isHyper ? 1.2 : 1,
      });
    }
  }

  private updateEvilDnaProjectile(projectile: ProjectileSprite, time: number) {
    const body = projectile.body as Phaser.Physics.Arcade.Body | undefined;
    if (!body) return;
    const targets = projectile.ownerIsPlayer
      ? this.botList.filter((bot) => bot.active && bot.health > 0 && bot.team !== 'player')
      : [this.player, ...this.botList.filter((bot) => bot.active && bot.health > 0 && bot.team === 'player')];
    let nearest: PlayerSprite | null = null;
    let nearestDist = 520;
    targets.forEach((candidate) => {
      const distance = Phaser.Math.Distance.Between(projectile.x, projectile.y, candidate.x, candidate.y);
      if (distance < nearestDist) {
        nearest = candidate;
        nearestDist = distance;
      }
    });
    if (!nearest) return;
    const target = nearest as PlayerSprite;
    const angle = Phaser.Math.Angle.Between(projectile.x, projectile.y, target.x, target.y);
    const speed = projectile.evilDnaHyper ? 760 : 620;
    body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    if (time + 120 >= (projectile.dieAt || 0)) {
      body.setVelocity(Math.cos(angle) * (speed * 0.8), Math.sin(angle) * (speed * 0.8));
    }
  }

  private handleEvilDnaHitPlayer(projectile: ProjectileSprite) {
    this.handlePlayerHit(500, '#8dff4d');
    this.applyPoison(this.player, false, 4, 250);
    projectile.destroy();
  }

  private handleEvilDnaHitBot(projectile: ProjectileSprite, bot: PlayerSprite) {
    const wasAlive = bot.health > 0;
    this.handleBotHit(bot, 500, projectile.ownerIsPlayer, '#8dff4d');
    this.applyPoison(bot, projectile.ownerIsPlayer, 4, 250);
    const killed = wasAlive && bot.health <= 0;

    if (projectile.ownerIsPlayer && killed && projectile.evilDnaHyper) {
      this.spawnEvilDoctorDnaBurst(this.player.x, this.player.y, true, true, false);
    }
    if (projectile.ownerIsPlayer && killed && projectile.evilDnaFromStar) {
      this.spawnEvilDoctorDnaBurst(bot.x, bot.y, true, false, false);
    }
    projectile.destroy();
  }

  private handleOverlordBoltImpact(projectile: any, x: number, y: number, hitEnemy: boolean) {
    if (!projectile.active) return;
    const ownerIsPlayer = !!projectile.ownerIsPlayer;
    const stage = projectile.overlordStage || 0;
    const baseDamage = Math.max(1, Math.round(projectile.damage || this.brawler.damage));
    const radius = stage >= 2 ? 76 : 54;

    this.triggerExplosion(x, y, baseDamage, radius, ownerIsPlayer);

    if (projectile.overlordHyper || this.isHypercharged) {
      this.applyOverlordBurn(x, y, radius, ownerIsPlayer);
    }

    if (stage >= 3 && hitEnemy) {
      this.time.delayedCall(110, () => {
        this.triggerExplosion(x, y, Math.round(baseDamage * 0.8), Math.round(radius * 1.1), ownerIsPlayer);
        if (projectile.overlordHyper || this.isHypercharged) {
          this.applyOverlordBurn(x, y, Math.round(radius * 1.1), ownerIsPlayer);
        }
      });
    }

    projectile.destroy();
  }

  private applyOverlordBurn(x: number, y: number, radius: number, ownerIsPlayer: boolean) {
    const now = this.time.now;
    const burnTargets = this.botList.filter((bot) => bot.active && bot.health > 0 && Phaser.Math.Distance.Between(x, y, bot.x, bot.y) <= radius + 24 && ((ownerIsPlayer && bot.team !== 'player') || (!ownerIsPlayer && bot.team !== 'bot')));
    burnTargets.forEach((target) => {
      target.fireUntil = Math.max(target.fireUntil || 0, now + 2600);
      target.fireTickAt = Math.min(target.fireTickAt || (now + 1000), now + 1000);
      target.fireStacks = Math.min(3, (target.fireStacks || 0) + 1);
    });

    if (!ownerIsPlayer && this.player.active && this.player.health > 0 && Phaser.Math.Distance.Between(x, y, this.player.x, this.player.y) <= radius + 24) {
      this.player.fireUntil = Math.max(this.player.fireUntil || 0, now + 2600);
      this.player.fireTickAt = Math.min(this.player.fireTickAt || (now + 1000), now + 1000);
      this.player.fireStacks = Math.min(3, (this.player.fireStacks || 0) + 1);
    }
  }

  private handleSplitProjectile(projectile: any) {
    if (projectile.splitOnHit) {
      const body = projectile.body as Phaser.Physics.Arcade.Body;
      const ang = Math.atan2(body.velocity.y, body.velocity.x);
      const remTime = (projectile.dieAt || 0) - this.time.now;
      if (remTime > 0) {
        [-0.25, 0.25].forEach((offset) => {
          this.fireProjectile(projectile.x, projectile.y, ang + offset, projectile.ownerIsPlayer, {
            damage: projectile.damage,
            pierceWalls: false,
            breakWalls: false,
            rangeMultiplier: (remTime / 1800) * 1.2,
          });
        });
      }
    }
  }

  private showDamageNumber(x: number, y: number, amount: number, color: string = '#ff4d4d') {
    const text = this.add.text(x, y - 20, `-${Math.round(amount)}`, {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: color,
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(20);

    this.tweens.add({
      targets: text,
      y: y - 50,
      alpha: 0,
      duration: 800,
      ease: 'Power1',
      onComplete: () => text.destroy(),
    });
  }

  public triggerExplosion(x: number, y: number, damage: number, radius: number, isPlayer: boolean, isChairExplosion: boolean = false) {
    const circle = this.add.circle(x, y, radius, 0xffa500, 0.4).setDepth(2);
    this.tweens.add({ targets: circle, alpha: 0, duration: 300, onComplete: () => circle.destroy() });

    let hitAny = false;
    this.botList.forEach((bot) => {
      if (bot.invincibleUntil && this.time.now < bot.invincibleUntil) return;
      if (bot.active && bot.health > 0 && Phaser.Math.Distance.Between(x, y, bot.x, bot.y) <= radius + 24) {
        if ((isPlayer && bot.team === 'player') || (!isPlayer && bot.team === 'bot')) return;
        this.handleBotHit(bot, damage, isPlayer);
        hitAny = true;
      }
    });

    if (!isPlayer && this.player.active && this.player.health > 0 && !(this.player.invincibleUntil && this.time.now < this.player.invincibleUntil) && Phaser.Math.Distance.Between(x, y, this.player.x, this.player.y) <= radius + 24) {
      this.handlePlayerHit(damage);
      hitAny = true;
    }

    if (isPlayer && isChairExplosion) {
      if (hitAny) {
        this.chairBonusRadius += radius * 0.3;
      } else {
        this.chairBonusRadius = 0;
      }
    }
  }

  private handleFightnFireImpact(projectile: any, shardImpact: boolean = false) {
    if (!projectile.active) return;
    const ownerIsPlayer = !!projectile.ownerIsPlayer;
    const damage = Math.max(1, Math.round(projectile.damage || this.brawler.damage));
    const radius = shardImpact || projectile.isFightnFireShard ? 70 : 96;

    this.triggerExplosion(projectile.x, projectile.y, damage, radius, ownerIsPlayer);

    if (!projectile.isFightnFireShard) {
      this.spawnFightnFireShards(
        projectile.x,
        projectile.y,
        ownerIsPlayer,
        Math.max(1, Math.round(damage * 0.6)),
        projectile.fightnFireShardCount || 4,
      );
    }

    projectile.destroy();
  }

  private spawnFightnFireShards(x: number, y: number, ownerIsPlayer: boolean, damage: number, shardCount: number) {
    const count = Math.max(4, shardCount);
    const baseOffset = count === 4 ? Math.PI / 4 : 0;
    for (let index = 0; index < count; index++) {
      const angle = baseOffset + (Math.PI * 2 * index) / count;
      this.fireProjectile(x, y, angle, ownerIsPlayer, {
        damage,
        pierceWalls: false,
        breakWalls: false,
        rangeMultiplier: 0.45,
        dieAt: this.time.now + 850,
        isFightnFireShard: true,
        bouncesLeft: 1,
        fightnFireShardCount: 0,
      });
    }
  }

  public triggerFightnFireLanding(x: number, y: number, isPlayer: boolean, isHyper: boolean) {
    const centerDamage = Math.max(1, Math.round(this.brawler.damage * (isHyper ? 1.35 : 1.15)));
    const outerDamage = Math.max(1, Math.round(centerDamage * 0.45));
    const radius = isHyper ? 260 : 220;
    this.triggerExplosion(x, y, centerDamage, 72, isPlayer);
    const circle = this.add.circle(x, y, radius, 0xff6b2d, 0.22).setDepth(1.5);
    this.tweens.add({ targets: circle, alpha: 0, duration: 1400, onComplete: () => circle.destroy() });
    this.fightnFireZones.push({
      x,
      y,
      radius,
      expireAt: this.time.now + 2500,
      nextTickAt: this.time.now + 250,
      ownerIsPlayer: isPlayer,
      centerDamage,
      outerDamage,
    });
  }

  private updateFightnFireZones(time: number) {
    this.fightnFireZones = this.fightnFireZones.filter((zone) => {
      if (time > zone.expireAt) return false;
      if (time < zone.nextTickAt) return true;
      zone.nextTickAt = time + 450;

      const applyZoneDamage = (x: number, y: number, team: string, apply: (damage: number) => void) => {
        const distance = Phaser.Math.Distance.Between(zone.x, zone.y, x, y);
        if (distance > zone.radius) return;
        if ((zone.ownerIsPlayer && team === 'player') || (!zone.ownerIsPlayer && team === 'bot')) return;
        const falloff = 1 - (distance / zone.radius);
        const damage = Math.max(1, Math.round(zone.outerDamage + (zone.centerDamage - zone.outerDamage) * falloff));
        apply(damage);
      };

      this.botList.forEach((bot) => {
        if (!bot.active || bot.health <= 0 || (bot.invincibleUntil && time < bot.invincibleUntil)) return;
        applyZoneDamage(bot.x, bot.y, bot.team || 'bot', (damage) => this.handleBotHit(bot, damage, zone.ownerIsPlayer));
      });

      if (this.player.active && this.player.health > 0 && !(this.player.invincibleUntil && time < this.player.invincibleUntil)) {
        applyZoneDamage(this.player.x, this.player.y, 'player', (damage) => this.handlePlayerHit(damage));
      }

      return true;
    });
  }

  private drawFightnFireAim() {
    this.aimGraphics.clear();
    if (!this.player.active || this.player.health <= 0) return;

    if (this.brawler.id === 'trapper') {
      const pointer = this.input.activePointer;
      const targetX = pointer.worldX || this.player.x + 1;
      const targetY = pointer.worldY || this.player.y;
      const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, targetX, targetY);
      const coneLength = 280;
      const coneHalfAngle = Phaser.Math.DegToRad(22);

      this.aimGraphics.fillStyle(0x95a8ff, 0.16);
      this.aimGraphics.beginPath();
      this.aimGraphics.moveTo(this.player.x, this.player.y);
      this.aimGraphics.arc(this.player.x, this.player.y, coneLength, angle - coneHalfAngle, angle + coneHalfAngle, false);
      this.aimGraphics.closePath();
      this.aimGraphics.fillPath();
      this.aimGraphics.lineStyle(2, 0xdbe4ff, 0.78);
      this.aimGraphics.strokePath();

      const superReady = this.playerSuperCharge >= 100;
      if (superReady) {
        const width = this.isHypercharged ? 520 : 380;
        const height = this.isHypercharged ? 360 : 260;
        const centerX = Phaser.Math.Clamp(targetX, 180, GAME_CONFIG.arenaWidth - 180);
        const centerY = Phaser.Math.Clamp(targetY, 180, GAME_CONFIG.arenaHeight - 180);
        const left = centerX - width / 2;
        const top = centerY - height / 2;

        this.aimGraphics.fillStyle(this.isHypercharged ? 0xff66d4 : 0x7f8dff, 0.12);
        this.aimGraphics.fillRect(left, top, width, height);
        this.aimGraphics.lineStyle(3, this.isHypercharged ? 0xffb3eb : 0xd9e2ff, 0.8);
        this.aimGraphics.strokeRect(left, top, width, height);
        this.aimGraphics.fillStyle(0xfff4ff, 0.9);
        this.aimGraphics.fillCircle(centerX, centerY, 5);
      }
      return;
    }

    if (this.brawler.id !== 'fightnfire') return;

    const pointer = this.input.activePointer;
    const targetX = pointer.worldX || this.player.x + 1;
    const targetY = pointer.worldY || this.player.y;
    const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, targetX, targetY);
    const isSuper = this.playerSuperCharge >= 100;
    const maxRange = isSuper ? 420 : (this.fightnFireNextShotBoost ? 1100 : 900);
    const distance = Math.min(maxRange, Phaser.Math.Distance.Between(this.player.x, this.player.y, targetX, targetY));
    const landingX = this.player.x + Math.cos(angle) * distance;
    const landingY = this.player.y + Math.sin(angle) * distance;

    this.aimGraphics.lineStyle(3, isSuper ? 0xffb347 : 0xff7f50, 0.7);
    this.aimGraphics.strokeLineShape(new Phaser.Geom.Line(this.player.x, this.player.y, landingX, landingY));
    this.aimGraphics.fillStyle(isSuper ? 0xff6b2d : 0xffc07a, 0.18);
    this.aimGraphics.fillCircle(landingX, landingY, isSuper ? 94 : 44);
    this.aimGraphics.lineStyle(2, isSuper ? 0xfff0d0 : 0xfff3d4, 0.75);
    this.aimGraphics.strokeCircle(landingX, landingY, isSuper ? 220 : 95);
    this.aimGraphics.fillStyle(isSuper ? 0xffe08a : 0xfff0b3, 0.9);
    this.aimGraphics.fillCircle(landingX, landingY, 5);
  }

  private updateTrapperGateWalls(time: number) {
    this.trapperGateWalls = this.trapperGateWalls.filter((entry) => {
      if (time < entry.expireAt && entry.wall.active) return true;
      if (entry.wall.active) entry.wall.destroy();
      return false;
    });
  }

  private isPointInsideFence(entity: PlayerSprite, fence: { x: number; y: number; width: number; height: number }) {
    const halfW = fence.width / 2;
    const halfH = fence.height / 2;
    return entity.x >= fence.x - halfW && entity.x <= fence.x + halfW && entity.y >= fence.y - halfH && entity.y <= fence.y + halfH;
  }

  private getTrapperSpeedBoostMultiplier(entity: PlayerSprite, ownerIsPlayer: boolean, time: number) {
    let mult = 1;
    this.trapperFences.forEach((fence) => {
      if (fence.expireAt <= time) return;
      if (fence.speedBoostMult <= 1) return;
      if (fence.ownerIsPlayer !== ownerIsPlayer) return;
      if (this.isPointInsideFence(entity, fence)) {
        mult = Math.max(mult, fence.speedBoostMult);
      }
    });
    return mult;
  }

  public fireTrapperGateAttack(owner: PlayerSprite, angle: number, ownerIsPlayer: boolean, now: number, sourceDamage = this.brawler.damage) {
    const coneLength = 280;
    const coneHalfAngle = Phaser.Math.DegToRad(22);
    const baseDamage = Math.round(sourceDamage * (owner.damageMult || 1));
    const slamDamage = Math.round(baseDamage * 1.12);

    const enemies: PlayerSprite[] = ownerIsPlayer
      ? this.botList.filter((bot) => bot.active && bot.health > 0 && bot.team !== 'player')
      : [this.player, ...this.botList.filter((bot) => bot !== owner && bot.active && bot.health > 0 && bot.team === 'player')];

    let bestTarget: PlayerSprite | null = null;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (const target of enemies) {
      if (!target.active || target.health <= 0) continue;
      const distance = Phaser.Math.Distance.Between(owner.x, owner.y, target.x, target.y);
      if (distance > coneLength) continue;
      const targetAngle = Phaser.Math.Angle.Between(owner.x, owner.y, target.x, target.y);
      const delta = Math.abs(Phaser.Math.Angle.Wrap(targetAngle - angle));
      if (delta > coneHalfAngle) continue;
      if (distance < bestDistance) {
        bestDistance = distance;
        bestTarget = target;
      }
    }

    const telegraph = this.add.graphics().setDepth(4.5);
    telegraph.fillStyle(0x95a8ff, 0.18);
    telegraph.beginPath();
    telegraph.moveTo(owner.x, owner.y);
    telegraph.arc(owner.x, owner.y, coneLength, angle - coneHalfAngle, angle + coneHalfAngle, false);
    telegraph.closePath();
    telegraph.fillPath();
    telegraph.lineStyle(2, 0xdbe4ff, 0.8);
    telegraph.strokePath();
    this.tweens.add({ targets: telegraph, alpha: 0, duration: 180, onComplete: () => telegraph.destroy() });

    if (bestTarget) {
      if (ownerIsPlayer) {
        this.handleBotHit(bestTarget, slamDamage, true);
      } else {
        this.handlePlayerHit(slamDamage);
      }

      const knockbackAngle = Phaser.Math.Angle.Between(owner.x, owner.y, bestTarget.x, bestTarget.y);
      const knockbackForce = 120;
      bestTarget.x = Phaser.Math.Clamp(bestTarget.x + Math.cos(knockbackAngle) * knockbackForce, 30, GAME_CONFIG.arenaWidth - 30);
      bestTarget.y = Phaser.Math.Clamp(bestTarget.y + Math.sin(knockbackAngle) * knockbackForce, 30, GAME_CONFIG.arenaHeight - 30);
      if (bestTarget.body) {
        (bestTarget.body as Phaser.Physics.Arcade.Body).setVelocity(
          Math.cos(knockbackAngle) * 360,
          Math.sin(knockbackAngle) * 360,
        );
      }

      const sp2Active = ownerIsPlayer && this.player.starPowerUnlocked && (this.player as any).selectedStar === 'two';
      if (sp2Active) {
        owner.speedBoostUntil = now + 1800;
      }
      return;
    }

    const gateDistance = 170;
    const gateX = owner.x + Math.cos(angle) * gateDistance;
    const gateY = owner.y + Math.sin(angle) * gateDistance;
    this.spawnTrapperGateWall(gateX, gateY, angle, now + 2000);
  }

  private spawnTrapperGateWall(x: number, y: number, angle: number, expireAt: number) {
    const gate = this.physics.add.staticImage(x, y, 'barrier') as unknown as Phaser.Physics.Arcade.Image;
    const horizontalShot = Math.abs(Math.cos(angle)) >= Math.abs(Math.sin(angle));
    gate.setDisplaySize(horizontalShot ? 28 : 132, horizontalShot ? 132 : 28);
    gate.setTint(0x9fb4ff);
    gate.setDepth(2.5);
    gate.refreshBody();

    this.physics.add.collider(this.player, gate);
    this.botList.forEach((bot) => this.physics.add.collider(bot, gate));
    this.trapperGateWalls.push({ wall: gate, expireAt });
  }

  private triggerTrapperKnockbackBlast(x: number, y: number, ownerIsPlayer: boolean) {
    const radius = 180;
    const pulse = this.add.circle(x, y, radius, 0x8ab0ff, 0.22).setDepth(2.5);
    pulse.setStrokeStyle(3, 0xdce8ff, 0.85);
    this.tweens.add({ targets: pulse, alpha: 0, scale: 1.2, duration: 220, onComplete: () => pulse.destroy() });

    const targets = ownerIsPlayer
      ? this.botList.filter((bot) => bot.active && bot.health > 0 && bot.team !== 'player')
      : [this.player, ...this.botList.filter((bot) => bot.active && bot.health > 0 && bot.team === 'player')];

    targets.forEach((target) => {
      const distance = Phaser.Math.Distance.Between(x, y, target.x, target.y);
      if (distance > radius) return;
      const angle = Phaser.Math.Angle.Between(x, y, target.x, target.y);
      const force = 170;
      target.x = Phaser.Math.Clamp(target.x + Math.cos(angle) * force, 30, GAME_CONFIG.arenaWidth - 30);
      target.y = Phaser.Math.Clamp(target.y + Math.sin(angle) * force, 30, GAME_CONFIG.arenaHeight - 30);
      if (target.body) {
        (target.body as Phaser.Physics.Arcade.Body).setVelocity(
          Math.cos(angle) * 440,
          Math.sin(angle) * 440,
        );
      }
    });
  }

  public spawnTrapperFence(targetX: number, targetY: number, ownerIsPlayer: boolean, isHyper: boolean, extendDuration: boolean, sourceDamage = this.brawler.damage) {
    const width = isHyper ? 520 : 380;
    const height = isHyper ? 360 : 260;
    const duration = (extendDuration ? 4300 : 3000);
    const centerX = Phaser.Math.Clamp(targetX, 180, GAME_CONFIG.arenaWidth - 180);
    const centerY = Phaser.Math.Clamp(targetY, 180, GAME_CONFIG.arenaHeight - 180);
    const thickness = 26;
    const edgeColor = isHyper ? 0xf7a8ff : 0x9aaeff;

    const wallTop = this.physics.add.staticImage(centerX, centerY - height / 2, 'barrier') as unknown as Phaser.Physics.Arcade.Image;
    wallTop.setDisplaySize(width + thickness * 2, thickness).setTint(edgeColor).setDepth(2.6).refreshBody();
    const wallBottom = this.physics.add.staticImage(centerX, centerY + height / 2, 'barrier') as unknown as Phaser.Physics.Arcade.Image;
    wallBottom.setDisplaySize(width + thickness * 2, thickness).setTint(edgeColor).setDepth(2.6).refreshBody();
    const wallLeft = this.physics.add.staticImage(centerX - width / 2, centerY, 'barrier') as unknown as Phaser.Physics.Arcade.Image;
    wallLeft.setDisplaySize(thickness, height).setTint(edgeColor).setDepth(2.6).refreshBody();
    const wallRight = this.physics.add.staticImage(centerX + width / 2, centerY, 'barrier') as unknown as Phaser.Physics.Arcade.Image;
    wallRight.setDisplaySize(thickness, height).setTint(edgeColor).setDepth(2.6).refreshBody();
    const walls = [wallTop, wallBottom, wallLeft, wallRight];

    this.physics.add.collider(this.player, wallTop);
    this.physics.add.collider(this.player, wallBottom);
    this.physics.add.collider(this.player, wallLeft);
    this.physics.add.collider(this.player, wallRight);
    this.botList.forEach((bot) => {
      walls.forEach((wall) => this.physics.add.collider(bot, wall));
    });

    const fenceVisual = this.add.rectangle(centerX, centerY, width, height, isHyper ? 0xff66d4 : 0x7f8dff, 0.11).setDepth(1.8);
    fenceVisual.setStrokeStyle(4, isHyper ? 0xffb3eb : 0xd9e2ff, 0.7);
    this.tweens.add({ targets: fenceVisual, alpha: 0, duration, onComplete: () => fenceVisual.destroy() });

    this.trapperFences.push({
      x: centerX,
      y: centerY,
      width,
      height,
      expireAt: this.time.now + duration,
      nextTickAt: this.time.now + 260,
      ownerIsPlayer,
      damagePerTick: Math.max(1, Math.round(sourceDamage * (isHyper ? 0.24 : 0.18))),
      vulnerabilityMult: isHyper ? 1.3 : 1,
      speedBoostMult: isHyper ? 1.2 : 1,
      walls,
    });
  }

  private updateTrapperZones(time: number) {
    this.trapperFences = this.trapperFences.filter((fence) => {
      if (time > fence.expireAt) {
        fence.walls.forEach((wall) => {
          if (wall.active) wall.destroy();
        });
        return false;
      }

      if (time < fence.nextTickAt) {
        return true;
      }

      fence.nextTickAt = time + 420;

      this.botList.forEach((bot) => {
        if (!bot.active || bot.health <= 0 || (bot.invincibleUntil && time < bot.invincibleUntil)) return;
        if (!this.isPointInsideFence(bot, fence)) return;
        if ((fence.ownerIsPlayer && bot.team === 'player') || (!fence.ownerIsPlayer && bot.team === 'bot')) return;
        if (fence.vulnerabilityMult > 1) {
          bot.trapperVulnerableUntil = time + 520;
          bot.trapperVulnerableMult = fence.vulnerabilityMult;
        }
        this.handleBotHit(bot, fence.damagePerTick, fence.ownerIsPlayer, '#ff9ce8');
      });

      if (this.player.active && this.player.health > 0 && !(this.player.invincibleUntil && time < this.player.invincibleUntil)) {
        if (this.isPointInsideFence(this.player, fence) && !fence.ownerIsPlayer) {
          if (fence.vulnerabilityMult > 1) {
            this.player.trapperVulnerableUntil = time + 520;
            this.player.trapperVulnerableMult = fence.vulnerabilityMult;
          }
          this.handlePlayerHit(fence.damagePerTick, '#ff9ce8');
        }
      }

      return true;
    });
  }

  private fireChair(spawnX: number, spawnY: number, angle: number, distance: number, ownerIsPlayer: boolean = true) {
    const flightTime = (distance / this.brawler.projectileSpeed) * 1000;
    const currentRadius = 40 + this.chairBonusRadius;
    this.chairBonusRadius = 0;

    const chair = this.physics.add.image(spawnX, spawnY, 'barrier');
    chair.setDisplaySize(20, 20);
    chair.setDepth(5);
    
    this.tweens.add({
      targets: chair,
      x: spawnX + Math.cos(angle) * distance,
      y: spawnY + Math.sin(angle) * distance,
      angle: 360,
      duration: flightTime,
      ease: 'Linear',
      onComplete: () => {
        const cx = chair.x;
        const cy = chair.y;
        chair.destroy();
        
        this.triggerExplosion(cx, cy, this.brawler.damage, currentRadius, ownerIsPlayer, true);
        this.time.delayedCall(800, () => {
          this.triggerExplosion(cx, cy, this.brawler.damage * 0.7, currentRadius, ownerIsPlayer, true);
          if (this.isHypercharged) {
             this.time.delayedCall(800, () => {
               this.triggerExplosion(cx, cy, this.brawler.damage * 0.5, currentRadius, ownerIsPlayer, true);
             });
          }
        });
      }
    });
  }

  private spawnBots() {
    const spawnPoints = this.generateSpawnPoints(9);
    const brickDifficulty = getBrickOpponentLevel(this.playerProgress);

    spawnPoints.forEach((spawnPoint, index) => {
      const botBrawler = this.getRandomBrawler();
      if (!this.textures.exists(`bot-${index}`)) {
        const graphics = this.add.graphics();
        graphics.fillStyle(botBrawler.color, 1);
        graphics.fillCircle(32, 32, 24);
        graphics.lineStyle(5, botBrawler.accent, 1);
        graphics.strokeCircle(32, 32, 24);
        graphics.fillStyle(0xffffff, 0.9);
        graphics.fillCircle(24, 23, 6);
        graphics.fillStyle(0x0a1020, 1);
        graphics.fillCircle(39, 37, 5);
        graphics.generateTexture(`bot-${index}`, 64, 64);
        graphics.destroy();
      }

      const bot = this.physics.add.sprite(
        spawnPoint.x,
        spawnPoint.y,
        `bot-${index}`,
      ) as any;
      const botLevel = Phaser.Math.Clamp(brickDifficulty + Phaser.Math.Between(-1, 2), 1, 11);
      bot.setDepth(3);
      bot.setImmovable(false);
      bot.setCircle(24, 8, 8);
      bot.body?.setCollideWorldBounds(true);
      const statMult = 0.55 + (botLevel - 1) * 0.045;
      bot.health = Math.round(botBrawler.health * statMult);
      bot.maxHealth = Math.round(botBrawler.health * statMult);
      bot.baseTint = 0x6ee7ff + (index % 3) * 0x00aa00;
      bot.setTint(bot.baseTint);
      bot.superCharge = 0;
      bot.overlordStage = 0;
      bot.overlordUpgradeUntil = 0;
      bot.team = 'bot';
      bot.level = botLevel;

      const label = this.add
        .text(spawnPoint.x, spawnPoint.y - 38, `${bot.health} hp`, {
          fontFamily: 'Trebuchet MS, sans-serif',
          fontSize: '12px',
          color: '#e8eeff',
          stroke: '#07111e',
          strokeThickness: 3,
        })
        .setOrigin(0.5)
        .setDepth(4);

      bot.label = label;

      // Create AI brain
      bot.ai = new AIBotBrain(bot, botBrawler, this);

      this.botList.push(bot);
      this.bots.add(bot);
    });
  }

  private generateSpawnPoints(count: number) {
    const points: Array<{ x: number; y: number }> = [];
    const margin = 300;
    const minDistance = 400;

    for (let i = 0; i < count; i++) {
      let point: { x: number; y: number };
      let attempts = 0;
      do {
        point = {
          x: Phaser.Math.Between(margin, GAME_CONFIG.arenaWidth - margin),
          y: Phaser.Math.Between(margin, GAME_CONFIG.arenaHeight - margin),
        };
        attempts++;
      } while (
        attempts < 10 &&
        (Math.hypot(point.x - GAME_CONFIG.arenaWidth / 2, point.y - GAME_CONFIG.arenaHeight / 2) <
          minDistance ||
          points.some((p) => Math.hypot(p.x - point.x, p.y - point.y) < minDistance))
      );
      points.push(point);
    }

    return points;
  }

  private getRandomBrawler() {
    const playableBrawlers = getPlayableBrawlers().filter((brawler) => brawler.id !== 'evil_doctor' || isEvilDoctorUnlocked());
    return playableBrawlers[Math.floor(Math.random() * playableBrawlers.length)];
  }

  private createWalls() {
    this.walls = this.physics.add.staticGroup();

    const blocks = [
      { x: 400, y: 300, w: 200, h: 120 },
      { x: 1520, y: 280, w: 240, h: 100 },
      { x: 1800, y: 600, w: 180, h: 140 },
      { x: 320, y: 780, w: 220, h: 100 },
      { x: 1200, y: 900, w: 240, h: 110 },
      { x: 1700, y: 800, w: 200, h: 120 },
      { x: 800, y: 550, w: 180, h: 150 },
    ];

    blocks.forEach((block) => {
      const wall = this.walls.create(block.x, block.y, 'barrier') as any;
      wall.setDisplaySize(block.w, block.h);
      wall.refreshBody();
    });

    this.physics.add.collider(this.player, this.walls);
  }

  private drawBackground() {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x08111f, 1);
    graphics.fillRect(0, 0, GAME_CONFIG.arenaWidth, GAME_CONFIG.arenaHeight);
    graphics.lineStyle(1, 0x22314d, 0.8);

    for (let x = 0; x <= GAME_CONFIG.arenaWidth; x += 160) {
      graphics.lineBetween(x, 0, x, GAME_CONFIG.arenaHeight);
    }
    for (let y = 0; y <= GAME_CONFIG.arenaHeight; y += 160) {
      graphics.lineBetween(0, y, GAME_CONFIG.arenaWidth, y);
    }

    graphics.fillStyle(0x10213a, 0.8);
    graphics.fillRoundedRect(72, 72, GAME_CONFIG.arenaWidth - 144, GAME_CONFIG.arenaHeight - 144, 28);
    graphics.lineStyle(4, 0x304876, 0.55);
    graphics.strokeRoundedRect(72, 72, GAME_CONFIG.arenaWidth - 144, GAME_CONFIG.arenaHeight - 144, 28);
    graphics.destroy();
  }

  private createTextures() {
    if (!this.textures.exists('bullet')) {
      const graphics = this.add.graphics();
      graphics.fillStyle(0xf7fbff, 1);
      graphics.fillCircle(8, 8, 6);
      graphics.lineStyle(2, 0x6ee7ff, 1);
      graphics.strokeCircle(8, 8, 6);
      graphics.generateTexture('bullet', 16, 16);
      graphics.destroy();
    }

    if (!this.textures.exists('barrier')) {
      const graphics = this.add.graphics();
      graphics.fillStyle(0x17213c, 1);
      graphics.fillRoundedRect(0, 0, 64, 64, 16);
      graphics.lineStyle(2, 0x7b92d1, 0.75);
      graphics.strokeRoundedRect(0, 0, 64, 64, 16);
      graphics.generateTexture('barrier', 64, 64);
      graphics.destroy();
    }

    const playerKey = this.playerTextureKey(this.brawler);
    if (!this.textures.exists(playerKey)) {
      const graphics = this.add.graphics();
      graphics.fillStyle(this.brawler.color, 1);
      graphics.fillCircle(32, 32, 24);
      graphics.lineStyle(5, this.brawler.accent, 1);
      graphics.strokeCircle(32, 32, 24);
      graphics.fillStyle(0xffffff, 0.9);
      graphics.fillCircle(24, 23, 6);
      graphics.fillStyle(0x0a1020, 1);
      graphics.fillCircle(39, 37, 5);
      graphics.generateTexture(playerKey, 64, 64);
      graphics.destroy();
    }
  }

  private playerTextureKey(brawler: BrawlerSpec) {
    return `player-${brawler.id}`;
  }

  private spawnBoss() {
    const playableBrawlers = getPlayableBrawlers().filter((brawler) => brawler.id !== 'evil_doctor' || isEvilDoctorUnlocked());
    const bossBrawler = playableBrawlers[Math.floor(Math.random() * playableBrawlers.length)];
    const spawnX = GAME_CONFIG.arenaWidth - 300;
    const spawnY = GAME_CONFIG.arenaHeight / 2;
    const bossDifficulty = getBrickOpponentLevel(this.playerProgress);
    
    const bot = this.physics.add.sprite(spawnX, spawnY, `bot-0`) as any;
    bot.setDepth(3);
    bot.setScale(2.5);
    bot.setCircle(24, 8, 8);
    bot.body?.setCollideWorldBounds(true);
    bot.health = Math.round(bossBrawler.health * (8 + bossDifficulty * 0.75));
    bot.maxHealth = Math.round(bossBrawler.health * (8 + bossDifficulty * 0.75));
    bot.setTint(0xff0000);
    bot.team = 'bot';
    bot.isBoss = true;

    bot.label = this.add.text(spawnX, spawnY - 80, `BOSS: ${bot.health} hp`, {
      fontFamily: 'Trebuchet MS, sans-serif', fontSize: '24px', fontStyle: 'bold', color: '#ff0000', stroke: '#000', strokeThickness: 5
    }).setOrigin(0.5).setDepth(4);

    bot.ai = new AIBotBrain(bot, bossBrawler, this);
    this.botList.push(bot);
    this.bots.add(bot);
    this.aliveBots = 1;
  }

  private clearSoloBattlefield() {
    this.projectiles.forEach((projectile) => projectile.destroy());
    this.projectiles = [];
    this.goonLiquidGroup.clear(true, true);

    this.botList.forEach((bot) => {
      if ((bot as any).label) {
        (bot as any).label.destroy();
      }
      if (bot.active) {
        bot.destroy();
      }
    });

    this.botList = [];
    this.bots.clear(true, true);
    this.aliveBots = 0;
  }

  private spawnSoloTrial() {
    const playableBrawlers = getPlayableBrawlers().filter((brawler) => brawler.id !== 'evil_doctor' || isEvilDoctorUnlocked());
    this.soloSpawnPending = false;
    this.clearSoloBattlefield();

    this.soloWave += 1;
    sessionState.soloWave = this.soloWave;

    const trialBrawler = playableBrawlers[(this.soloWave + Math.floor(Math.random() * playableBrawlers.length)) % playableBrawlers.length];
    const waveScale = 3.25 + (this.soloWave - 1) * 1.1;
    const trialSpec: BrawlerSpec = {
      ...trialBrawler,
      health: Math.round(trialBrawler.health * waveScale),
      damage: Math.round(trialBrawler.damage * (0.75 + (this.soloWave - 1) * 0.1)),
      speed: Math.round(trialBrawler.speed * (1 + (this.soloWave - 1) * 0.04)),
      reloadMs: Math.max(540, Math.round(trialBrawler.reloadMs * (0.9 - (this.soloWave - 1) * 0.03))),
      projectileSpeed: Math.round(trialBrawler.projectileSpeed * (1 + (this.soloWave - 1) * 0.04)),
    };

    const spawnX = Phaser.Math.Between(420, GAME_CONFIG.arenaWidth - 420);
    const spawnY = Phaser.Math.Between(260, GAME_CONFIG.arenaHeight - 260);

    if (!this.textures.exists(`solo-wave-${this.soloWave}`)) {
      const graphics = this.add.graphics();
      graphics.fillStyle(trialBrawler.color, 1);
      graphics.fillCircle(32, 32, 24);
      graphics.lineStyle(5, trialBrawler.accent, 1);
      graphics.strokeCircle(32, 32, 24);
      graphics.fillStyle(0xffffff, 0.92);
      graphics.fillCircle(24, 23, 6);
      graphics.fillStyle(0x0a1020, 1);
      graphics.fillCircle(39, 37, 5);
      graphics.generateTexture(`solo-wave-${this.soloWave}`, 64, 64);
      graphics.destroy();
    }

    const bot = this.physics.add.sprite(spawnX, spawnY, `solo-wave-${this.soloWave}`) as any;
    bot.setDepth(3);
    bot.setScale(1.5);
    bot.setCircle(24, 8, 8);
    bot.body?.setCollideWorldBounds(true);
    bot.health = trialSpec.health;
    bot.maxHealth = trialSpec.health;
    bot.setTint(0x6ee7ff + (this.soloWave * 0x001100));
    bot.team = 'bot';
    bot.isBoss = true;
    bot.level = Math.min(11, getBrickOpponentLevel(this.playerProgress) + this.soloWave - 1);

    bot.label = this.add.text(spawnX, spawnY - 80, `SOLO WAVE ${this.soloWave}/${this.soloMaxWaves}: ${bot.health} hp`, {
      fontFamily: 'Trebuchet MS, sans-serif', fontSize: '22px', fontStyle: 'bold', color: '#6ee7ff', stroke: '#000', strokeThickness: 5
    }).setOrigin(0.5).setDepth(4);

    bot.ai = new AIBotBrain(bot, trialSpec, this);
    this.botList.push(bot);
    this.bots.add(bot);
    this.aliveBots = 1;
    this.refreshHud();
  }

  private refreshHud() {
    const health = Math.max(0, Math.round(this.player.health));
    const modeName = this.mode === 'solo' ? 'SOLO TRIAL' : (this.mode === 'boss' ? 'BOSS FIGHT' : 'SHOWDOWN');
    const enemyLine = this.mode === 'solo'
      ? `Wave: ${Math.min(this.soloWave, this.soloMaxWaves)}/${this.soloMaxWaves}`
      : (this.mode === 'boss' ? `Boss HP: ${this.botList[0]?.health || 0}` : `Bots Alive: ${this.aliveBots}`);
    this.hud.setText([
      `${this.brawler.name} | ${modeName}`,
      `Health: ${health}/${this.brawler.health}`,
      `Score: ${this.score}`,
      enemyLine,
      `Super: ${Math.min(100, this.playerSuperCharge)}%`,
    ]);

    // Leaderboard
    const alive = this.countAlivePlayers();
    const playerLine = `You (${this.score})`;
    const topLine = this.mode === 'solo' ? 'Solo trial active' : `Players Alive: ${alive}`;
    this.leaderboard.setText([topLine, playerLine].join('\n'));
  }

  private handlePlayerHit(damage: number, color: string = '#ff4d4d') {
    if (this.player.invincibleUntil && this.time.now < this.player.invincibleUntil) return;
    if (this.player.trapperVulnerableUntil && this.time.now < this.player.trapperVulnerableUntil) {
      damage *= this.player.trapperVulnerableMult || 1.25;
    }
    this.player.health -= damage;
    this.player.setTintFill(0xffffff);
    this.time.delayedCall(80, () => {
      if (this.player.active) {
        this.player.clearTint();
      }
    });

    if (damage > 0) this.showDamageNumber(this.player.x, this.player.y, damage, color);

    if (this.player.health <= 0) {
      this.player.disableBody(true, true);
      this.playerLabel.setVisible(false);
    }
  }

  private handleBotHit(bot: PlayerSprite, damage: number, hitByPlayer: boolean, overrideColor?: string) {
    if (bot.invincibleUntil && this.time.now < bot.invincibleUntil) return;
    if (bot.trapperVulnerableUntil && this.time.now < bot.trapperVulnerableUntil) {
      damage *= bot.trapperVulnerableMult || 1.25;
    }
    bot.health -= damage;
    bot.label.setText(`${Math.max(0, bot.health)} hp`);
    bot.setTintFill(0xffffff);
    this.time.delayedCall(80, () => {
      if (bot.active) {
        bot.clearTint();
      }
    });

    if (damage > 0) this.showDamageNumber(bot.x, bot.y, damage, overrideColor || (hitByPlayer ? '#ff4d4d' : '#ff9b9b'));

    if (hitByPlayer && bot.team !== 'player') {
      if (!bot.isParrot && !bot.isEgg) {
        this.playerSuperCharge = Math.min(100, this.playerSuperCharge + (damage / 8000) * 100);
      }
      if (this.brawler.id === 'outlit' && ((((this.player as any).selectedStar === 'one') ? this.brawler.starPowerOne : this.brawler.starPowerTwo).toLowerCase().includes('slow'))) {
        bot.slowUntil = this.time.now + 1000;
      }
    } else if (!hitByPlayer && bot.team === 'bot') {
      bot.superCharge = Math.min(100, (bot.superCharge || 0) + (damage / 8000) * 100);
    }

    if (hitByPlayer && bot.team !== 'player') {
      this.score += 30;
    }

    if (bot.health > 0) {
      return;
    }

    if (hitByPlayer && bot.team !== 'player') {
      this.score += 120;
    }

    if (
      hitByPlayer &&
      bot.team !== 'player' &&
      this.brawler.id === 'evil_doctor' &&
      this.player.starPowerUnlocked &&
      (this.player as any).selectedStar === 'one'
    ) {
      this.spawnEvilDoctorDnaBurst(bot.x, bot.y, true, false, true);
    }

    if (bot.team === 'bot' && !bot.isParrot && !bot.isEgg) {
      this.aliveBots--;
    }

    bot.disableBody(true, true);
    bot.label.setVisible(false);

    if (this.mode === 'solo' && !this.soloSpawnPending && this.soloWave < this.soloMaxWaves) {
      this.soloSpawnPending = true;
      this.time.delayedCall(1000, () => {
        if (!this.player.active || this.player.health <= 0) return;
        this.spawnSoloTrial();
      });
    }
  }

  public spawnPet(x: number, y: number, type: 'parrot' | 'egg' | 'hatchling', team: string, sp2: boolean, isHyper: boolean) {
    const isEgg = type === 'egg';
    const isHatch = type === 'hatchling';
    const petBrawler: BrawlerSpec = {
      ...this.brawler,
      ...BRAWLERS[0],
      speed: isEgg ? 0 : (280 * (sp2 ? 1.2 : 1.0)),
      damage: isEgg ? 0 : (isHatch ? 425 : (isHyper ? 850 : 600)) * (this.player.damageMult || 1),
      health: (isEgg ? 4000 : (isHatch ? 4000 : (isHyper ? 5000 : 3500))) * (this.player.damageMult || 1),
      reloadMs: sp2 ? 1040 : 1300,
    };

    const bot = this.physics.add.sprite(x, y, 'bullet') as any; 
    bot.setDisplaySize(isEgg ? 24 : 36, isEgg ? 30 : 36);
    bot.setTint(isEgg ? 0xffffff : (isHyper ? 0xff00ff : 0xff0000));
    bot.setDepth(3);
    bot.setCircle(isEgg ? 12 : 18);
    bot.body?.setCollideWorldBounds(true);
    bot.health = petBrawler.health;
    bot.maxHealth = petBrawler.health;
    bot.team = team;
    bot.isParrot = type === 'parrot' || type === 'hatchling';
    bot.isEgg = isEgg;
    bot.isHyperParrot = isHyper;
    bot.parrotSp2 = sp2;
    bot.laidEgg = isHatch;
    if (isEgg) bot.hatchTime = this.time.now + 4000;

    const labelColor = team === 'player' ? '#5df2c2' : '#ff9b9b';
    bot.label = this.add.text(x, y - 38, `${bot.health} hp`, {
      fontFamily: 'Trebuchet MS, sans-serif', fontSize: '12px', color: labelColor, stroke: '#07111e', strokeThickness: 3
    }).setOrigin(0.5).setDepth(4);

    bot.ai = new AIBotBrain(bot, petBrawler, this);
    this.botList.push(bot);
    this.bots.add(bot);
    this.physics.add.collider(bot, this.walls);
  }

  private countAlivePlayers() {
    return 1 + this.botList.filter((bot) => bot.active && bot.health > 0 && bot.team === 'bot' && !bot.isParrot && !bot.isEgg).length;
  }
}

class AIBotBrain {
  private targetX = 0;
  private targetY = 0;
  private lastShotAt = 0;
  private changeTargetTimer = 0;

  constructor(
    private bot: PlayerSprite,
    private brawler: BrawlerSpec,
    private scene: ShowdownScene,
  ) {
    this.changeTarget();
  }

  update(
    time: number,
    player: PlayerSprite,
    allBots: PlayerSprite[],
    scene: ShowdownScene,
  ) {
    if (!this.bot.active || this.bot.health <= 0) {
      return;
    }

    this.changeTargetTimer--;
    if (this.changeTargetTimer <= 0) {
      this.changeTarget();
    }

    // Find nearest threat
    let nearestThreat: PlayerSprite | null = null;
    let nearestDist = 700;

    const threats = ([
      player,
      ...allBots.filter((otherBot) => otherBot !== this.bot && otherBot.active && otherBot.health > 0),
    ].filter((threat) => threat.active && threat.health > 0 && threat.team !== this.bot.team)) as PlayerSprite[];

    threats.forEach((threat) => {
      const distance = Phaser.Math.Distance.Between(this.bot.x, this.bot.y, threat.x, threat.y);
      if (distance < nearestDist) {
        nearestThreat = threat;
        nearestDist = distance;
      }
    });

    // Move toward target or threat
    const targetX = nearestThreat ? (nearestThreat as any).x : this.targetX;
    const targetY = nearestThreat ? (nearestThreat as any).y : this.targetY;

    const angle = Phaser.Math.Angle.Between(this.bot.x, this.bot.y, targetX, targetY);
    const slowed = Boolean(this.bot.slowUntil && this.bot.slowUntil > time);
    const rooted = Boolean(this.bot.rootedUntil && this.bot.rootedUntil > time);
    let speed = this.brawler.speed * (slowed ? 0.5 : 0.8);
    if (rooted || this.bot.isChairSpinning) speed = this.bot.isChairSpinning ? speed * (this.bot.chairSpinSpeedMult || 1) : 0;

    if (!this.bot.isEgg) {
      if ((this.bot.isParrot && nearestDist <= 200) || speed === 0) {
        this.bot.setVelocity(0, 0);
        this.bot.setRotation(angle + Math.PI / 2);
      } else {
        this.bot.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
        this.bot.setRotation(angle + Math.PI / 2);
      }
    }

    // Try to shoot
    if (this.bot.isParrot) {
        if (nearestThreat && nearestDist <= 300 && time - this.lastShotAt > this.brawler.reloadMs) {
            const fireAngle = Phaser.Math.Angle.Between(this.bot.x, this.bot.y, (nearestThreat as any).x, (nearestThreat as any).y);
            const sx = this.bot.x + Math.cos(fireAngle) * 20;
            const sy = this.bot.y + Math.sin(fireAngle) * 20;
            scene.fireProjectile(sx, sy, fireAngle, this.bot.team === 'player', {
                damage: this.brawler.damage, pierceWalls: false, breakWalls: false, rangeMultiplier: 0.6
            });
            this.lastShotAt = time;
        }
        return;
    } else if (this.bot.isEgg) {
        return;
    }

    if (nearestThreat && time - this.lastShotAt > this.brawler.reloadMs * 1.2) {
      const fireAngle = Phaser.Math.Angle.Between(
        this.bot.x,
        this.bot.y,
        (nearestThreat as any).x,
        (nearestThreat as any).y,
      );

      if (this.brawler.id === 'forest') {
        if (this.bot.superCharge && this.bot.superCharge >= 100) {
           this.bot.superCharge = 0;
           scene.spawnPet(this.bot.x, this.bot.y, 'parrot', this.bot.team || 'bot', this.brawler.starPowerTwo.toLowerCase().includes('bird'), this.bot.isHypercharged || false);
           this.lastShotAt = time;
           return;
        }
      } else if (this.brawler.id === 'evil_doctor' && this.bot.superCharge && this.bot.superCharge >= 100) {
        this.bot.superCharge = 0;
        scene.spawnEvilDoctorDnaBurst(this.bot.x, this.bot.y, false, this.bot.isHypercharged || false, false);
        this.lastShotAt = time;
        return;
      } else if (this.brawler.id === 'trapper' && this.bot.superCharge && this.bot.superCharge >= 100 && nearestThreat) {
        this.bot.superCharge = 0;
        const sp1 = this.brawler.starPowerOne.toLowerCase().includes('longer');
        scene.spawnTrapperFence((nearestThreat as any).x, (nearestThreat as any).y, false, this.bot.isHypercharged || false, sp1, this.brawler.damage);
        this.lastShotAt = time;
        return;
      } else if (this.brawler.id === 'fightnfire' && this.bot.superCharge && this.bot.superCharge >= 100 && nearestThreat) {
        this.bot.superCharge = 0;
        this.bot.invincibleUntil = time + 700;
        this.bot.rootedUntil = time + 700;
        const landingDistance = Math.min(420, nearestDist);
        const landingX = this.bot.x + Math.cos(fireAngle) * landingDistance;
        const landingY = this.bot.y + Math.sin(fireAngle) * landingDistance;
        scene.time.delayedCall(700, () => {
          if (!this.bot.active) return;
          this.bot.setPosition(landingX, landingY);
          scene.triggerFightnFireLanding(landingX, landingY, false, this.bot.isHypercharged || false);
        });
        this.lastShotAt = time;
        return;
      } else if (this.brawler.id === 'cheseypuff') {
        const angles = [-0.175, 0, 0.175];
        angles.forEach((angOffset, idx) => {
          scene.time.delayedCall(150 * idx, () => {
            if (!this.bot.active || this.bot.health <= 0) return;
            const fireAng = fireAngle + angOffset;
            const spawnDist = Math.min(34, nearestDist);
            const sx = this.bot.x + Math.cos(fireAng) * spawnDist;
            const sy = this.bot.y + Math.sin(fireAng) * spawnDist;
            const _starText2 = ((((this.bot as any).selectedStar === 'one') ? this.brawler.starPowerOne : this.brawler.starPowerTwo));
            const applyBurn = (_starText2.toLowerCase().includes('flaming') && idx === 1);
            scene.fireProjectile(sx, sy, fireAng, false, {
              damage: this.brawler.damage, pierceWalls: false, breakWalls: false, rangeMultiplier: 0.72, leaveTrail: true, ownerX: this.bot.x, ownerY: this.bot.y, applyBurn: applyBurn
            });
          });
        });
        this.lastShotAt = time;
        return;
      } else if (this.brawler.id === 'goonbob') {
        const fireAng = fireAngle;
        const px = this.bot.x + Math.cos(fireAng) * 34;
        const py = this.bot.y + Math.sin(fireAng) * 34;
        const sp1 = ((((this.bot as any).selectedStar === 'one') ? this.brawler.starPowerOne : this.brawler.starPowerTwo).toLowerCase().includes('industrial'));
        
        this.scene.fireProjectile(px, py, fireAng, false, {
          damage: this.brawler.damage,
          pierceWalls: false,
          breakWalls: false,
          rangeMultiplier: 0.8,
          isGoonLiquidProj: true,
          dieAt: time + (sp1 ? 7000 : 5000)
        });
        this.lastShotAt = time;
        return;
      } else if (this.brawler.id === 'fightnfire') {
        const boosted = this.bot.level && this.bot.level >= 8;
        const fireAng = fireAngle;
        const px = this.bot.x + Math.cos(fireAng) * 34;
        const py = this.bot.y + Math.sin(fireAng) * 34;
        this.scene.fireProjectile(px, py, fireAng, false, {
          damage: this.brawler.damage * (boosted ? 1.1 : 1),
          pierceWalls: false,
          breakWalls: false,
          rangeMultiplier: boosted ? 0.75 : 0.5,
          dieAt: time + (boosted ? 1100 : 900),
          isFightnFireShot: true,
          fightnFireShardCount: boosted ? 8 : 4,
          ownerX: this.bot.x,
          ownerY: this.bot.y,
        });
        this.lastShotAt = time;
        return;
      } else if (this.brawler.id === 'trapper') {
        this.scene.fireTrapperGateAttack(this.bot, fireAngle, false, time, this.brawler.damage);
        this.lastShotAt = time;
        return;
      } else if (this.brawler.id === 'evil_doctor') {
        const px = this.bot.x + Math.cos(fireAngle) * 34;
        const py = this.bot.y + Math.sin(fireAngle) * 34;
        this.scene.fireProjectile(px, py, fireAngle, false, {
          damage: this.brawler.damage,
          pierceWalls: false,
          breakWalls: false,
          rangeMultiplier: 1.05,
          isEvilDoctorMain: true,
          evilDoctorPoisonTicks: 3,
          evilDoctorPoisonDamage: 600,
        });
        this.lastShotAt = time;
        return;
      }

      const spawnDist = Math.min(34, nearestDist);
      const spawnX = this.bot.x + Math.cos(fireAngle) * spawnDist;
      const spawnY = this.bot.y + Math.sin(fireAngle) * spawnDist;

      if (this.brawler.id === 'chaird') {
        const distance = Math.min(500, Phaser.Math.Distance.Between(this.bot.x, this.bot.y, targetX, targetY));
        const flightTime = (distance / this.brawler.projectileSpeed) * 1000;
        const isPlayerTeam = this.bot.team === 'player';
        const chair = scene.physics.add.image(spawnX, spawnY, 'barrier');
        chair.setDisplaySize(20, 20);
        chair.setDepth(5);
        
        scene.tweens.add({
          targets: chair,
          x: spawnX + Math.cos(fireAngle) * distance,
          y: spawnY + Math.sin(fireAngle) * distance,
          angle: 360,
          duration: flightTime,
          ease: 'Linear',
          onComplete: () => {
            const cx = chair.x;
            const cy = chair.y;
            chair.destroy();
            scene.triggerExplosion(cx, cy, this.brawler.damage, 40, isPlayerTeam, false);
            scene.time.delayedCall(800, () => {
              scene.triggerExplosion(cx, cy, this.brawler.damage * 0.7, 40, isPlayerTeam, false);
            });
          }
        });
      } else {
        scene.fireProjectile(spawnX, spawnY, fireAngle, false, {
          damage: this.brawler.damage,
          pierceWalls: false,
          breakWalls: false,
          rangeMultiplier: 1,
        });
      }
      this.lastShotAt = time;
    }
  }

  private changeTarget() {
    this.targetX = Phaser.Math.Between(300, GAME_CONFIG.arenaWidth - 300);
    this.targetY = Phaser.Math.Between(300, GAME_CONFIG.arenaHeight - 300);
    this.changeTargetTimer = Phaser.Math.Between(120, 300);
  }
}
