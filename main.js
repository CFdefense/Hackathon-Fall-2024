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

    // Capture the input from the text box
    this.inputBox = document.querySelector('.text-box');
    
    // Use an arrow function to ensure 'this' is correctly scoped
    this.inputBox.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        this.handleInput(this.inputBox.value)
        this.inputBox.value = ""; //! Not working
      }
    });
}

  // This will check the typed word and move the player if there's a match
  handleInput(text, time, delta) {
    const typedWord = text.trim(); // trimming to avoid extra spaces
    if (!typedWord) {
        console.log("No word entered");
        return;
    }

    // Check if the typed word matches any of the available words
    if (this.leftWord.checkMatch(typedWord)) {
        console.log("left true");

        // Lets attempt to update the players location and find if it moved
        result = this.player.update(time, delta, "left");
    } else if (this.middleWord.checkMatch(typedWord)) {
        console.log("middle true");

        // Lets attempt to update the players location and find if it moved
        result = this.player.update(time, delta, "middle");
    } else if (this.rightWord.checkMatch(typedWord)) {
        console.log("right true");

        // Lets attempt to update the players location and find if it moved
        result = this.player.update(time, delta, "right");
    }

    // ! Do a check on result to see if we moved and then call update on word guessed
    // ! define some sort mechanision to find a new word 
    
  }

  // For game cycle
  update(time, delta) {
    // Implement logic in here for game functionality

    /* 
      Obstacle Logic Goes Here
      need to have some set timer before an obstacle will spawn again
      maybe decrease timer as game goes on
      game must always be possible to survive
    */
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
