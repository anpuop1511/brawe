import Phaser from 'phaser';
import { HomeScene } from './game/scenes/HomeScene';
import { BrawlerSelectScene } from './game/scenes/BrawlerSelectScene';
import { ShowdownScene } from './game/scenes/ShowdownScene';
import { ResultsScene } from './game/scenes/ResultsScene';
import { StarrDropScene } from './game/scenes/StarrDropScene';
import './styles.css';

const isMobileDevice =
  (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) ||
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

const baseWidth = isMobileDevice ? 1280 : 1920;
const baseHeight = isMobileDevice ? 720 : 1080;

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'app',
  backgroundColor: '#08111f',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: baseWidth,
    height: baseHeight,
  },
  input: {
    activePointers: 3,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scene: [HomeScene, BrawlerSelectScene, ShowdownScene, ResultsScene, StarrDropScene],
});

(window as Window & { __arenaForgeGame?: Phaser.Game; __arenaStartScene?: (sceneName: string) => void }).__arenaForgeGame = game;
(window as Window & { __arenaForgeGame?: Phaser.Game; __arenaStartScene?: (sceneName: string) => void }).__arenaStartScene = (
  sceneName: string,
) => {
  game.scene.start(sceneName);
};
