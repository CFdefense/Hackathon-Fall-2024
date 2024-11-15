import Phaser from 'phaser';
import { RedSquare } from './src/phaser/sprites';

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    // Preload assets if needed
  }

  create() {
    // Create an instance of the RedSquare class
    new RedSquare(this, 50, 50, 200, 100); // x, y, width, height
  }
}

// Configuration for the Phaser game
const config = {
  type: Phaser.AUTO, // Automatically choose WebGL or Canvas
  width: 800,
  height: 600,
  backgroundColor: 0x1099bb,
  scene: MainScene, // Set the main scene
  parent: 'game-container', // Optionally set a DOM element to attach the canvas
};

// Initialize the Phaser game
const game = new Phaser.Game(config);
