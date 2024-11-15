import Phaser from 'phaser';
import { gameWindow, Player, Word, Obstacle} from './src/phaser/sprites';

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    // Preload assets if needed
    this.load.text('wordBankFile', 'resources/wordbank.txt');
    this.load.audio("background", ["resources/jazz-beat.mp3"]); 
    this.load.audio("ding", ["resources/ding.mp3"]);
    this.load.audio("wrong", ["resources/wrong.mp3"]);
  }

  // Creating our Initial Display
  create() {
    // Create main game display
    new gameWindow(this, window.innerWidth / 3.3, 75);

    // Music
    let backgroundMusic = this.sound.add("background", { volume: 0.04 }, { loop: false });
    backgroundMusic.play();

    this.correctNoise = this.sound.add("ding", { loop: false });
    this.wrongNoise = this.sound.add("wrong", { loop: false });

    // Create an instance of the RedSquare class
    this.player = new Player(this, 365, 400);

    // load the wordbank
    const fileContent = this.cache.text.get('wordBankFile');
    const lines = fileContent.split('\n').map(line => line.trim());
    lines.forEach(line => {
      const newWords = line.split(',').map(word => word.trim());
      wordBank = wordBank.concat(newWords);
    });
    console.log("Word Bank: " + wordBank);

    // Create instances of words
    this.leftWord = new Word(this, 75, 0, 100, 40, wordBank[Math.floor(Math.random() * wordBank.length)]);
    this.middleWord = new Word(this, 355, 0, 100, 40, wordBank[Math.floor(Math.random() * wordBank.length)]);
    this.rightWord = new Word(this, 600, 0, 100, 40, wordBank[Math.floor(Math.random() * wordBank.length)]);
    
    // Capture the input from the text box
    this.inputBox = document.querySelector('.text-box');
    
    // Use an arrow function to ensure 'this' is correctly scoped
    this.inputBox.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        console.log("User: " + this.inputBox.value);
        this.handleInput(this.inputBox.value);
        this.inputBox.value = ""; 
      }
    });
}

  // This will check the typed word and move the player if there's a match
  handleInput(text, time, delta) {
    const typedWord = text.trim();
    if (!typedWord) {
      this.wrongNoise.play();
        console.log("No word entered");
        return;
    }
    
    // Check if the typed word matches any of the available words
    if (this.leftWord.checkMatch(typedWord)) {
        // Lets attempt to update the players location and find if it moved
        let result = this.player.update(time, delta, "left");

        if (result == true) {
          console.log("left true");
          this.correctNoise.play();

          // replace it with a new word
          this.leftWord.update(wordBank[Math.floor(Math.random() * wordBank.length)]);
        } else {
          this.wrongNoise.play();
          console.log("Wrong")
        }
    } else if (this.middleWord.checkMatch(typedWord)) {
      // Lets attempt to update the players location and find if it moved
      let result = this.player.update(time, delta, "middle");
      
      if (result == true) {
        console.log("middle true");
        this.correctNoise.play();

        this.middleWord.update(wordBank[Math.floor(Math.random() * wordBank.length)]);
      } else {
        this.wrongNoise.play();
        console.log("Wrong")
      }
    } else if (this.rightWord.checkMatch(typedWord)) {
      // Lets attempt to update the players location and find if it moved
      let result = this.player.update(time, delta, "right");

      if (result == true) {
        console.log("right true");
        this.correctNoise.play();

        // replace it with a new word
        this.rightWord.update(wordBank[Math.floor(Math.random() * wordBank.length)]);
      } else {
        this.wrongNoise.play();
        console.log("Wrong")
      }
    } else {
      this.wrongNoise.play();
        console.log("Wrong")
    }
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

let wordBank = []; // global