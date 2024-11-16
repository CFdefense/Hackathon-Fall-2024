import Phaser from 'phaser';
import { gameWindow, Player, Word, Obstacle, increaseSpeed} from './src/phaser/sprites';

class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' }); // Key to identify the scene
  }

  preload() {
    // Preload assets for the menu (e.g., background, buttons)
    this.load.video('menuBackgroundVideo', 'resources/background-video.mp4', 'loadeddata', false, true);
    this.load.image('startButton', 'resources/start-button.png');
  }

  create() {
    const typingElement = document.querySelector('.typing-element');
    typingElement.classList.add('hidden');
    // Add a background image
    // Add the video as the background
    const video = this.add.video(this.cameras.main.centerX, this.cameras.main.centerY, 'menuBackgroundVideo');
    video.setOrigin(0.5);
    video.setScale(2); // Optional: Scale the video
    video.play(true); // Play the video and loop it

    // Display the high score in the top right corner
    this.highScoreText = this.add.text(
      this.cameras.main.width - 10, // Position it at the right edge of the screen
      10, // Position it near the top
      `High Score: ${globalHighScore}`, // Display the high score
      {
        font: '24px Arial',
        fill: '#ffffff',
        align: 'right'
      }
    );
    this.highScoreText.setOrigin(1, 0); // Align to the top-right corner

    // Add a "Start Game" button
    const startButton = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY + 100, 'startButton')
      .setInteractive() // Make the button interactive
      .setScale(.5)
      .on('pointerdown', () => {
        this.scene.start('MainScene'); // Switch to the main game scene
      }); 
  }

  // Method to update the high score text dynamically
  updateHighScore(newScore) {
    if (newScore > globalHighScore) {
      globalHighScore = newScore;
      this.highScoreText.setText(`High Score: ${globalHighScore}`);
    }
  }
}

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
    this.load.audio("death", ["resources/death.mp3"])
  }

  // Creating our Initial Display
  create() {
    // Show the input element when entering the main game
    const typingElement = document.querySelector('.typing-element');
    typingElement.classList.remove('hidden');

    // Create main game display
    new gameWindow(this, window.innerWidth / 3.3, 75);

    // Music
    let backgroundMusic = this.sound.add("background", { volume: 0.04 }, { loop: true });
    backgroundMusic.play()
    this.correctNoise = this.sound.add("ding", { loop: false });
    this.wrongNoise = this.sound.add("wrong", { loop: false });
    this.gameOverSound = this.sound.add("death",  { volume: 0.09 }, { loop: false });

    // Create an instance of the RedSquare class
    this.player = new Player(this, 365, 400);

    this.obstacles = [];
    this.obstaclePos = ["Left", "Middle", "Right"];
    this.obstacleInterval = 1000;
    this.lastObsTime = 0;

    this.speedIncInterval = 1000;
    this.lastSpeedInc = 0;

    // Highscore variable
    this.score = 0;

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
  // Method to check for collisions to run on cycling
  checkForCollision() {
    // Get player's bounding box
    let playerXStart = this.player.x;
    let playerYStart = this.player.y;
    let playerXEnd = this.player.x + 75; 
    let playerYEnd = this.player.y + 75;

    // Traverse rendered obstacles
    for (let i = 0; i < this.obstacles.length; i++) {
      let currObstacle = this.obstacles[i];

      // Get obstacle's bounding box
      let obstacleXStart = currObstacle.x;
      let obstacleYStart = currObstacle.y;
      let obstacleXEnd = currObstacle.x + currObstacle.width;
      let obstacleYEnd = currObstacle.y + currObstacle.height;

      // Check for collision using Axis-Aligned Bounding Box
      if (
        playerXStart < obstacleXEnd && // Player's left edge is before obstacle's right edge
        playerXEnd > obstacleXStart && // Player's right edge is after obstacle's left edge
        playerYStart < obstacleYEnd && // Player's top edge is above obstacle's bottom edge
        playerYEnd > obstacleYStart    // Player's bottom edge is below obstacle's top edge
      ) {
        // Collision detected
        console.log("Collision detected with obstacle:", currObstacle);
        
        // Handle Collision Here
        this.gameOverSound.play();
        alert("GAME OVER");

        // Check local highScore VS global
        this.scene.get('MenuScene').updateHighScore(this.score);

        this.scene.start('MenuScene'); // go to mainmenu
        
        return true;
      }
    }
    return false;
  }

  // This will check the typed word and move the player if there's a match
  handleInput(text, time, delta) {
    const typedWord = text.trim();
    if (!typedWord) {
        console.log("No word entered");
        return;
    }
    
    // Check if the typed word matches any of the available words
    if (this.leftWord.checkMatch(typedWord)) {
        // Lets attempt to update the players location and find if it moved
        let result = this.player.update(time, delta, "left");

        if (result === true) {
          console.log("left true");
          this.correctNoise.play();

          // replace it with a new word
          this.leftWord.update(wordBank[Math.floor(Math.random() * wordBank.length)]);

          // Increment Score
          this.score += 1;
        } else {
          this.wrongNoise.play();
          console.log("Wrong")
        }
    } else if (this.middleWord.checkMatch(typedWord)) {
      // Lets attempt to update the players location and find if it moved
      let result = this.player.update(time, delta, "middle");
      
      if (result === true) {
        console.log("middle true");
        this.correctNoise.play();
        
        // replace it with a new word
        this.middleWord.update(wordBank[Math.floor(Math.random() * wordBank.length)]);

        // Increment Score
        this.score += 1;
      } else {
        this.wrongNoise.play();
        console.log("Wrong")
      }
    } else if (this.rightWord.checkMatch(typedWord)) {
      // Lets attempt to update the players location and find if it moved
      let result = this.player.update(time, delta, "right");

      if (result === true) {}
        console.log("right true");
        this.correctNoise.play();

        this.rightWord.update(wordBank[Math.floor(Math.random() * wordBank.length)]);

        // Lets attempt to update the players location and find if it moved
        this.player.update(time, delta, "right");

        // Increment Score
        this.score += 1;
    } else {
      this.wrongNoise.play();
      console.log("Wrong")
    }
  }

  // For game cycle
  update(time, delta) {
    // Implement logic in here for game functionality
    // make obstacles
    let currentTime = Date.now();
    // make obstacles move faster
    if (currentTime - this.lastSpeedInc >= this.speedIncInterval) {
      increaseSpeed();
      this.lastSpeedInc = currentTime;
    }

    if ((this.obstacles.length < 2) && (currentTime - this.lastObsTime >= this.obstacleInterval)) {
      let newPos = this.obstaclePos[Math.floor(Math.random() * this.obstaclePos.length)];
      console.log("New Obstacle in Pos: " + newPos)
      this.lastObsTime = currentTime;
      this.obstacles.push(new Obstacle(this, newPos));
    }

    // move them down
    this.obstacles.forEach((obs) => {
      obs.update();
      // remove obstacle if off screen
      if(obs.y >= 326) {
        this.obstacles.splice(this.obstacles.indexOf(obs), 1);
        obs.graphics.clear();
      }
    });

    // detect collision
    this.checkForCollision();
  }
}

// Configuration for the Phaser game
const config = {
  type: Phaser.AUTO, // Automatically choose WebGL or Canvas
  width: window.innerWidth / 1.2, // Full-screen width
  height: window.innerHeight + 30, // Full-screen height
  backgroundColor: 0x1099bb,
  scene: [MenuScene, MainScene], // Start with MenuScene
  parent: 'app', // Optionally set a DOM element to attach the canvas
};

// Initialize the Phaser game
const game = new Phaser.Game(config);

// globals
let wordBank = [];
let globalHighScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;