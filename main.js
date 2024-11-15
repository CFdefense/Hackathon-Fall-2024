import Phaser from 'phaser';
import { gameWindow, Player, Word, Obstacle} from './src/phaser/sprites';

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    // Preload assets if needed
  }

  // Creating our Initial Display
  create() {
    // Create main game display
    new gameWindow(this, window.innerWidth / 3.3, 75);

    // Create an instance of the RedSquare class
    this.player = new Player(this, 365, 400);

    // Create instances of words
    this.leftWord = new Word(this, 75, 0, 100, 40, "leftWord");
    this.middleWord = new Word(this, 355, 0, 100, 40, "middleWord");
    this.rightWord = new Word(this, 600, 0, 100, 40, "rightWord");
  }

  // For game cycle
  update(time, delta) {
    // Implement logic in here for game functionality

    /* 
      Obstacle logic goes here
      need to have some set timer before an obstacle will spawn again
      maybe decrease timer as game goes on
      game must always be possible to survive
    */

    /*
      Ill use arrow keys for temporary demonstration of functionality
      will need to be changed to look to see if a correct word has been typed to move a set distance
    */ 
    if (this.player) {
      this.player.update(time, delta);
    }
  }
}

// Configuration for the Phaser game
const config = {
  type: Phaser.AUTO, // Automatically choose WebGL or Canvas
  width: window.innerWidth / 1.2, // Full-screen width
  height: window.innerHeight + 30, // Full-screen height
  backgroundColor: 0x1099bb,
  scene: MainScene, // Set the main scene
  parent: 'app', // Optionally set a DOM element to attach the canvas
};

// Initialize the Phaser game
const game = new Phaser.Game(config);
