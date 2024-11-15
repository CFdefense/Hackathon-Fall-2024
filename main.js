import Phaser from 'phaser';
import { gameWindow, Player } from './src/phaser/sprites';

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    // Preload assets if needed
  }

  create() {
    // Create main game display
    new gameWindow(this, window.innerWidth / 3.3, 50);

    // Create an instance of the RedSquare class
    new Player(this, 75, 75, 75, 75);
  }
}

// Configuration for the Phaser game
const config = {
  type: Phaser.AUTO, // Automatically choose WebGL or Canvas
  width: window.innerWidth / 1.2, // Full-screen width
  height: window.innerHeight, // Full-screen height
  backgroundColor: 0x1099bb,
  scene: MainScene, // Set the main scene
  parent: 'app', // Optionally set a DOM element to attach the canvas
};

// Initialize the Phaser game
const game = new Phaser.Game(config);
