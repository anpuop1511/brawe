import Phaser from 'phaser';
import { controlState } from './state';
import type { BrawlerSpec } from './types';

const ARENA_WIDTH = 2800;
const ARENA_HEIGHT = 1800;

type EnemySprite = Phaser.Physics.Arcade.Sprite & {
  health: number;
  maxHealth: number;
  label: Phaser.GameObjects.Text;
  baseTint: number;
};

export function createArenaGame(
  parent: string | HTMLElement,
  getBrawler: () => BrawlerSpec,
): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    backgroundColor: '#08111f',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 1280,
      height: 720,
    },
    scene: [new ArenaScene(getBrawler)],
  });
}

class ArenaScene extends Phaser.Scene {
  private readonly getBrawler: () => BrawlerSpec;
  private player!: Phaser.Physics.Arcade.Sprite;
  private playerLabel!: Phaser.GameObjects.Text;
  private hud!: Phaser.GameObjects.Text;
  private score = 0;
  private lastShotAt = 0;
  private fireKey?: Phaser.Input.Keyboard.Key;
  private keys?: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    fire: Phaser.Input.Keyboard.Key;
  };
  private projectiles: Phaser.Physics.Arcade.Image[] = [];
  private enemies: EnemySprite[] = [];
  private walls!: Phaser.Physics.Arcade.StaticGroup;

  constructor(getBrawler: () => BrawlerSpec) {
    super('ArenaScene');
    this.getBrawler = getBrawler;
  }

  create() {
    const brawler = this.getBrawler();

    this.cameras.main.setBackgroundColor('#08111f');
    this.physics.world.setBounds(0, 0, ARENA_WIDTH, ARENA_HEIGHT);
    this.cameras.main.setBounds(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

    this.createTextures(brawler);
    this.drawBackground();
    this.createWalls();

    this.player = this.physics.add.sprite(ARENA_WIDTH / 2, ARENA_HEIGHT / 2, this.playerTextureKey(brawler));
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(4);
    this.player.setCircle(24, 8, 8);

    this.playerLabel = this.add
      .text(this.player.x, this.player.y - 44, brawler.name, {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '16px',
        color: '#f5f7ff',
        stroke: '#07111e',
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(5);

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);

    this.hud = this.add
      .text(20, 20, '', {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '18px',
        color: '#f5f7ff',
        backgroundColor: 'rgba(5, 10, 18, 0.4)',
        padding: { left: 12, right: 12, top: 10, bottom: 10 },
      })
      .setScrollFactor(0)
      .setDepth(10);

    this.keys = this.input.keyboard?.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      fire: Phaser.Input.Keyboard.KeyCodes.SPACE,
    }) as ArenaScene['keys'];

    this.fireKey = this.keys?.fire;
    this.input.on('pointerdown', () => {
      this.tryFire(true);
    });

    this.spawnEnemies(brawler);
    this.refreshHud(brawler);
  }

  update(time: number, delta: number) {
    const brawler = this.getBrawler();
    const movement = this.resolveMovement();
    const speed = brawler.speed * (movement.fast ? 1.15 : 1);

    this.player.setVelocity(movement.x * speed, movement.y * speed);
    if (movement.x !== 0 || movement.y !== 0) {
      this.player.setRotation(Math.atan2(movement.y, movement.x) + Math.PI / 2);
    }

    this.playerLabel.setPosition(this.player.x, this.player.y - 44);

    const pointer = this.input.activePointer;
    if (pointer.isDown || controlState.firing || this.fireKey?.isDown) {
      this.tryFire(false, time);
    }

    this.projectiles = this.projectiles.filter((projectile) => {
      if (!projectile.active) {
        return false;
      }

      if (
        projectile.x < -80 ||
        projectile.x > ARENA_WIDTH + 80 ||
        projectile.y < -80 ||
        projectile.y > ARENA_HEIGHT + 80
      ) {
        projectile.destroy();
        return false;
      }

      return true;
    });

    this.refreshHud(brawler);

    void delta;
    void time;
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
      fast: Boolean(this.keys?.up.isDown || this.keys?.down.isDown || this.keys?.left.isDown || this.keys?.right.isDown),
    };
  }

  private tryFire(forceFromPointer: boolean, now = this.time.now) {
    const brawler = this.getBrawler();
    if (now - this.lastShotAt < brawler.reloadMs && !forceFromPointer) {
      return;
    }

    const pointer = this.input.activePointer;
    const targetX = pointer.worldX || this.player.x + 1;
    const targetY = pointer.worldY || this.player.y;
    const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, targetX, targetY);
    const spawnX = this.player.x + Math.cos(angle) * 34;
    const spawnY = this.player.y + Math.sin(angle) * 34;

    const projectile = this.physics.add.image(spawnX, spawnY, 'bullet');
    projectile.setDepth(3);
    projectile.setCircle(7, 1, 1);
    projectile.setCollideWorldBounds(false);
    projectile.body?.setVelocity(Math.cos(angle) * brawler.projectileSpeed, Math.sin(angle) * brawler.projectileSpeed);
    if (projectile.body && 'setAllowGravity' in projectile.body) {
      (projectile.body as any).setAllowGravity(false);
    }

    this.physics.add.collider(projectile, this.walls, () => {
      projectile.destroy();
    });

    for (const enemy of this.enemies) {
      this.physics.add.overlap(projectile, enemy, () => {
        if (!projectile.active || !enemy.active) {
          return;
        }
        projectile.destroy();
        this.handleEnemyHit(enemy, brawler);
      });
    }

    this.projectiles.push(projectile);
    this.lastShotAt = now;
  }

  private handleEnemyHit(enemy: EnemySprite, brawler: BrawlerSpec) {
    enemy.health -= brawler.damage;
    enemy.label.setText(`${Math.max(0, enemy.health)} hp`);
    enemy.setTintFill(0xffffff);
    this.time.delayedCall(80, () => {
      if (enemy.active) {
        enemy.clearTint();
      }
    });

    if (enemy.health > 0) {
      this.score += 30;
      return;
    }

    this.score += 120;
    enemy.disableBody(true, true);
    enemy.label.setVisible(false);

    this.time.delayedCall(1200, () => {
      const position = this.pickEnemySpawn();
      enemy.enableBody(true, position.x, position.y, true, true);
      enemy.health = enemy.maxHealth;
      enemy.label.setVisible(true);
      enemy.label.setText(`${enemy.health} hp`);
      enemy.clearTint();
    });
  }

  private spawnEnemies(brawler: BrawlerSpec) {
    const spawnPoints = [
      { x: 560, y: 420 },
      { x: 2240, y: 460 },
      { x: 640, y: 1320 },
      { x: 2160, y: 1280 },
    ];

    spawnPoints.forEach((spawnPoint, index) => {
      const enemy = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'dummy') as unknown as EnemySprite;
      enemy.setDepth(3);
      enemy.setImmovable(true);
      enemy.setCircle(22, 10, 10);
      if (enemy.body && 'setAllowGravity' in enemy.body) {
        (enemy.body as any).setAllowGravity(false);
      }
      enemy.health = Math.round(brawler.health * (0.46 + index * 0.08));
      enemy.maxHealth = enemy.health;
      enemy.baseTint = index % 2 === 0 ? 0x6ee7ff : 0xf8b26a;
      enemy.setTint(enemy.baseTint);

      const label = this.add
        .text(spawnPoint.x, spawnPoint.y - 38, `${enemy.health} hp`, {
          fontFamily: 'Trebuchet MS, sans-serif',
          fontSize: '14px',
          color: '#e8eeff',
          stroke: '#07111e',
          strokeThickness: 3,
        })
        .setOrigin(0.5)
        .setDepth(4);

      enemy.label = label;
      this.physics.add.collider(this.player, enemy);
      this.enemies.push(enemy);
    });
  }

  private createWalls() {
    this.walls = this.physics.add.staticGroup();

    const blocks = [
      { x: 700, y: 620, w: 160, h: 100 },
      { x: 1280, y: 430, w: 260, h: 120 },
      { x: 1860, y: 640, w: 180, h: 92 },
      { x: 980, y: 1180, w: 220, h: 110 },
      { x: 1600, y: 1320, w: 300, h: 120 },
      { x: 2300, y: 1040, w: 180, h: 130 },
    ];

    blocks.forEach((block) => {
      const wall = this.walls.create(block.x, block.y, 'barrier') as Phaser.Physics.Arcade.Sprite;
      wall.setDisplaySize(block.w, block.h);
      wall.refreshBody();
    });

    this.physics.add.collider(this.player, this.walls);
  }

  private drawBackground() {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x08111f, 1);
    graphics.fillRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);
    graphics.lineStyle(1, 0x22314d, 0.8);

    for (let x = 0; x <= ARENA_WIDTH; x += 160) {
      graphics.lineBetween(x, 0, x, ARENA_HEIGHT);
    }
    for (let y = 0; y <= ARENA_HEIGHT; y += 160) {
      graphics.lineBetween(0, y, ARENA_WIDTH, y);
    }

    graphics.fillStyle(0x10213a, 0.8);
    graphics.fillRoundedRect(72, 72, ARENA_WIDTH - 144, ARENA_HEIGHT - 144, 28);
    graphics.lineStyle(4, 0x304876, 0.55);
    graphics.strokeRoundedRect(72, 72, ARENA_WIDTH - 144, ARENA_HEIGHT - 144, 28);
    graphics.destroy();
  }

  private createTextures(brawler: BrawlerSpec) {
    if (!this.textures.exists('bullet')) {
      const graphics = this.add.graphics();
      graphics.fillStyle(0xf7fbff, 1);
      graphics.fillCircle(8, 8, 6);
      graphics.lineStyle(2, 0x6ee7ff, 1);
      graphics.strokeCircle(8, 8, 6);
      graphics.generateTexture('bullet', 16, 16);
      graphics.destroy();
    }

    if (!this.textures.exists('dummy')) {
      const graphics = this.add.graphics();
      graphics.fillStyle(0x1f2d4a, 1);
      graphics.fillRoundedRect(0, 0, 64, 64, 20);
      graphics.lineStyle(3, 0x6ee7ff, 0.95);
      graphics.strokeRoundedRect(0, 0, 64, 64, 20);
      graphics.generateTexture('dummy', 64, 64);
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

    const playerKey = this.playerTextureKey(brawler);
    if (!this.textures.exists(playerKey)) {
      const graphics = this.add.graphics();
      graphics.fillStyle(brawler.color, 1);
      graphics.fillCircle(32, 32, 24);
      graphics.lineStyle(5, brawler.accent, 1);
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

  private refreshHud(brawler: BrawlerSpec) {
    const health = Math.max(0, Math.round(brawler.health - this.score * 2));
    const superCharge = Math.min(100, Math.floor((this.score / 1200) * 100));
    this.hud.setText([
      `${brawler.name}  |  ${brawler.role}`,
      `Health: ${health}   Speed: ${brawler.speed}   Damage: ${brawler.damage}`,
      `Super: ${brawler.superName} ${superCharge}%   Score: ${this.score}`,
      `Move: WASD or arrows   Fire: hold click, Space, or the FIRE button`,
    ]);
  }

  private pickEnemySpawn() {
    const margin = 260;
    const x = Phaser.Math.Between(margin, ARENA_WIDTH - margin);
    const y = Phaser.Math.Between(margin, ARENA_HEIGHT - margin);
    return { x, y };
  }
}
