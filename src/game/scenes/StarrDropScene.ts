import Phaser from 'phaser';
import { sessionState, saveState } from '../state';

export class StarrDropScene extends Phaser.Scene {
  private rarity: 'Rare' | 'Super Rare' | 'Epic' | 'Mythic' | 'Legendary' | 'Ultra' = 'Rare';
  private taps = 0;
  private dropObject?: Phaser.GameObjects.Container;
  private rarityText?: Phaser.GameObjects.Text;
  private instructionText?: Phaser.GameObjects.Text;
  private isOpening = false;
  private isSuper = false;

  constructor() {
    super('StarrDropScene');
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    this.cameras.main.setBackgroundColor('#08111f');
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x08111f, 0x08111f, 0x1a1a2e, 0x16213e, 1);
    bg.fillRect(0, 0, width, height);

    this.dropObject = this.add.container(width / 2, height / 2);
    
    const dropColor = this.isSuper ? 0xff00ff : 0x5df2c2;
    const dropShape = this.add.circle(0, 0, 100, dropColor);
    const dropInner = this.add.circle(0, 0, 80, 0xffffff, this.isSuper ? 0.08 : 0.2);
    const dropStar = this.add.star(0, 0, 5, 40, 70, this.isSuper ? 0xffff80 : 0xffffff);
    
    this.dropObject.add([dropShape, dropInner, dropStar]);
    this.dropObject.setSize(200, 200);
    this.dropObject.setInteractive(new Phaser.Geom.Circle(0, 0, 100), Phaser.Geom.Circle.Contains);

    // If there's a Super Tapper in the persistent stash, open that variant
    this.isSuper = !!(sessionState.persistent.superTapperCount && sessionState.persistent.superTapperCount > 0);

    this.rarityText = this.add.text(width / 2, height / 2 - 180, this.isSuper ? 'SUPER TAPPER UPPER' : 'TAPPER UPPER', {
      fontFamily: 'Trebuchet MS, sans-serif', fontSize: '64px', fontStyle: 'bold', color: '#5df2c2',
      stroke: '#000', strokeThickness: 10
    }).setOrigin(0.5);

    this.instructionText = this.add.text(width / 2, height / 2 + 180, this.isSuper ? 'TAP TO OPEN' : 'TAP TO REVEAL', {
      fontFamily: 'Trebuchet MS, sans-serif', fontSize: '24px', color: '#f5f7ff',
    }).setOrigin(0.5);

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const dropX = this.dropObject?.x ?? width / 2;
      const dropY = this.dropObject?.y ?? height / 2;
      const hitArea = new Phaser.Geom.Circle(dropX, dropY, 100);
      const worldX = pointer.worldX ?? pointer.x;
      const worldY = pointer.worldY ?? pointer.y;

      if (Phaser.Geom.Circle.Contains(hitArea, worldX, worldY)) {
        this.handleTap();
      }
    });

    // Float animation
    this.tweens.add({
      targets: this.dropObject,
      y: height / 2 - 20,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private handleTap() {
    if (this.isOpening) return;

    // Super drop opens immediately in one tap and uses distinct visuals
    this.cameras.main.shake(100, 0.005);
    if (this.isSuper) {
      // quick pulse and glow
      const glow = this.add.circle(this.scale.width/2, this.scale.height/2, 0, 0xff00ff, 0.25).setDepth(5);
      this.tweens.add({ targets: glow, radius: 500, alpha: 0, duration: 420, onComplete: () => glow.destroy() });
      this.tweens.add({ targets: this.dropObject, scale: 1.6, duration: 160, yoyo: true, ease: 'Sine.easeOut' });
      this.openSuperDrop();
      return;
    }

    this.taps++;
    // Scale effect
    this.tweens.add({
      targets: this.dropObject,
      scale: 1.2,
      duration: 100,
      yoyo: true
    });

    const rarities: ('Rare' | 'Super Rare' | 'Epic' | 'Mythic' | 'Legendary' | 'Ultra')[] = ['Rare', 'Super Rare', 'Epic', 'Mythic', 'Legendary', 'Ultra'];
    const currentIndex = rarities.indexOf(this.rarity);
    // 40% chance to upgrade per tap if not max
    if (currentIndex < rarities.length - 1 && Math.random() < 0.4) {
      this.rarity = rarities[currentIndex + 1];
      this.updateRarityVisuals();
    }

    if (this.taps >= 4) {
      this.openDrop();
    }
  }

  private updateRarityVisuals() {
    const colors = {
      'Rare': 0x5df2c2,
      'Super Rare': 0x3498db,
      'Epic': 0x9b59b6,
      'Mythic': 0xe74c3c,
      'Legendary': 0xf1c40f,
      'Ultra': 0xff00ff
    };
    
    const color = colors[this.rarity];
    const shape = this.dropObject?.list[0] as any;
    shape.setFillStyle(color);
    
    this.rarityText?.setText('TAPPER UPPER');
    this.rarityText?.setColor(Phaser.Display.Color.IntegerToColor(color).rgba);
    
    // Flash effect
    const flash = this.add.circle(this.scale.width / 2, this.scale.height / 2, 0, color, 0.5);
    this.tweens.add({
      targets: flash,
      radius: 500,
      alpha: 0,
      duration: 400,
      onComplete: () => flash.destroy()
    });
  }

  private openDrop() {
    this.isOpening = true;
    this.instructionText?.setText('OPENING...');
    
    sessionState.persistent.starrDrops = Math.max(0, sessionState.persistent.starrDrops - 1);

    const rewards = {
      'Rare': 50,
      'Super Rare': 100,
      'Epic': 250,
      'Mythic': 500,
      'Legendary': 1000,
      'Ultra': 2500
    };

    const coins = rewards[this.rarity];
    sessionState.persistent.coins += coins;
    saveState();

    this.tweens.add({
      targets: this.dropObject,
      scale: 3,
      alpha: 0,
      duration: 600,
      ease: 'Back.easeIn',
      onComplete: () => {
        this.showReward(coins);
      }
    });
  }

  private pickRarityWeighted(): 'Rare' | 'Super Rare' | 'Epic' | 'Mythic' | 'Legendary' | 'Ultra' {
    const roll = Math.random() * 100;
    if (roll < 1) return 'Ultra';
    if (roll < 5) return 'Legendary';
    if (roll < 15) return 'Mythic';
    if (roll < 35) return 'Epic';
    if (roll < 65) return 'Super Rare';
    return 'Rare';
  }

  private async openSuperDrop() {
    if (this.isOpening) return;
    this.isOpening = true;
    this.instructionText?.setText('OPENING SUPER...');

    // consume one super tapper
    sessionState.persistent.superTapperCount = Math.max(0, (sessionState.persistent.superTapperCount || 1) - 1);
    saveState();

    const rewards = {
      'Rare': 50,
      'Super Rare': 100,
      'Epic': 250,
      'Mythic': 500,
      'Legendary': 1000,
      'Ultra': 2500
    } as Record<string, number>;

    // split into 2..8 reveals
    const splits = Phaser.Math.Between(2, 8);
    let total = 0;

    for (let i = 0; i < splits; i++) {
      // small delay between reveals
      await new Promise((res) => this.time.delayedCall(300 * i, res as any));
      const r = this.pickRarityWeighted();
      const coins = rewards[r];
      total += coins;

      // simple per-reveal animation
      const revealTxt = this.add.text(this.scale.width / 2, this.scale.height / 2 + (i - Math.floor(splits / 2)) * 28, `${r}: +${coins} COINS`, {
        fontFamily: 'Trebuchet MS, sans-serif', fontSize: '22px', color: '#f5f7ff', stroke: '#000', strokeThickness: 4
      }).setOrigin(0.5).setDepth(20);
      this.tweens.add({ targets: revealTxt, alpha: 0, y: revealTxt.y - 80, duration: 900, ease: 'Power1', onComplete: () => revealTxt.destroy() });
    }

    // award total
    sessionState.persistent.coins += total;
    saveState();

    this.tweens.add({
      targets: this.dropObject,
      scale: 3,
      alpha: 0,
      duration: 600,
      ease: 'Back.easeIn',
      onComplete: () => {
        this.showReward(total);
      }
    });
  }

  private showReward(coins: number) {
    const width = this.scale.width;
    const height = this.scale.height;

    this.add.text(width / 2, height / 2, `+${coins} COINS!`, {
      fontFamily: 'Trebuchet MS, sans-serif', fontSize: '80px', fontStyle: 'bold', color: '#f1c40f',
      stroke: '#000', strokeThickness: 12
    }).setOrigin(0.5);

    const backBtn = this.add.rectangle(width / 2, height - 100, 200, 60, 0x5df2c2).setInteractive({ useHandCursor: true });
    this.add.text(width / 2, height - 100, 'CONTINUE', {
      fontFamily: 'Trebuchet MS, sans-serif', fontSize: '24px', fontStyle: 'bold', color: '#08101d',
    }).setOrigin(0.5);

    backBtn.on('pointerdown', () => this.scene.start('HomeScene'));
  }
}
