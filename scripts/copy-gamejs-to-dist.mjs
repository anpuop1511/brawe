import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const projectRoot = process.cwd();
const sourceFile = resolve(projectRoot, 'game.js');
const distDir = resolve(projectRoot, 'dist');
const targetFile = resolve(distDir, 'game.js');

if (!existsSync(sourceFile)) {
  console.error('Missing game.js at project root.');
  process.exit(1);
}

if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

copyFileSync(sourceFile, targetFile);
console.log('Copied game.js to dist/game.js for Capacitor file:// runtime.');
