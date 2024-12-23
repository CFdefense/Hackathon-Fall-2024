import Phaser from 'phaser';
import { gameWindow, Player, Word, Obstacle, increaseSpeed, resetSpeed} from './src/phaser/sprites';

class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' }); // Key to identify the scene
  }

  preload() {
    // Preload assets for the menu (e.g., background, buttons)
    this.load.video('menuBackgroundVideo', 'resources/background-video.mp4', 'loadeddata', false, true);
    this.load.image('startButton', 'resources/start-button.png');
    this.load.image('leaderboardButton', 'resources/leaderboard.png');
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


    // Add the "Leaderboard" button at the top-left corner
    const leaderboardButton = this.add.image(10, 10, 'leaderboardButton')
    .setInteractive()
    .setScale(0.1)
    .setOrigin(0, 0) // Align to the top-left corner
    .on('pointerdown', () => {
      this.scene.start('LeaderboardScene'); // Replace 'LeaderboardScene' with the actual scene name for your leaderboard
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

class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LeaderboardScene' });
  }

  preload() {
    // Preload assets if needed
  }

  create() {
    // Load leaderboard data from local storage
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

    // Display the leaderboard title
    this.add.text(100, 100, 'Leaderboard', { font: '32px Arial', fill: '#ffffff' });

    // Display top 5 players
    leaderboard.slice(0, 5).forEach((entry, index) => {
      this.add.text(100, 150 + index * 40, `${entry.name}: ${entry.score}`, { font: '24px Arial', fill: '#ffffff' });
    });

    // Add a back button
    const backButton = this.add.text(100, 200 + leaderboard.length * 40, 'Back', { font: '24px Arial', fill: '#ff0000' })
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('MenuScene'); // Go back to the MenuScene
      });
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
    this.highScoreText = this.add.text(
      10, // Position it near the left edge
      this.cameras.main.height - 65, // Adjusted to make it a little higher from the bottom
      `High Score: ${globalHighScore}`, // Display the high score
      {
        font: '24px Arial',
        fill: '#ffffff',
        align: 'left'
      }
    );
    // Align to the bottom-left corner (origin at top-left of the text)
    this.highScoreText.setOrigin(0, 1);

    this.scoreText = this.add.text(
      10, // Position it near the left edge
      this.cameras.main.height - 40, // Adjusted to make it a little higher from the bottom
      `Current Score: ${this.score}`, // Display the high score
      {
        font: '24px Arial',
        fill: '#ffffff',
        align: 'left'
      }
    );
    // Align to the bottom-left corner (origin at top-left of the text)
    this.scoreText.setOrigin(0, 1);

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
    this.obstacleInterval = 3000;
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
    this.leftWord = new Word(this, 55, 0, 125, 40, wordBank[Math.floor(Math.random() * wordBank.length)]);
    this.middleWord = new Word(this, 340, 0, 125, 40, wordBank[Math.floor(Math.random() * wordBank.length)]);
    this.rightWord = new Word(this, 580, 0, 125, 40, wordBank[Math.floor(Math.random() * wordBank.length)]);
    
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
    let playerYStart = this.player.y;
    let playerYEnd = this.player.y + 75;

    // Traverse rendered obstacles
    for (let i = 0; i < this.obstacles.length; i++) {
      let currObstacle = this.obstacles[i];

      // Get obstacle's bounding box
      let obstacleYStart = currObstacle.y;
      let obstacleYEnd = currObstacle.y + currObstacle.height;

      // Check for collision using Axis-Aligned Bounding Box
      if (
        playerYStart < obstacleYEnd && // Player's top edge is above obstacle's bottom edge
        playerYEnd > obstacleYStart && // Player's bottom edge is below obstacle's top edge
        currObstacle.position.toLowerCase() === this.player.position.toLowerCase()
      ) {
        // Collision detected
        console.log("Collision detected with obstacle:", currObstacle);
        
        // Handle Collision Here
        this.gameOverSound.play();
        alert("GAME OVER");

        // At game over, call handleGameOver
        if (this.score > globalHighScore) {
          globalHighScore = this.score;
          this.scene.get('MenuScene').updateHighScore(globalHighScore);
        }
        this.handleGameOver(); // Prompt for name and save score

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
    
    let newWord = this.leftWord.initialText;
    // make sure word isnt already there
    while(newWord == this.leftWord.initialText | newWord == this.middleWord.initialText | newWord == this.rightWord.initialText) {
        newWord = wordBank[Math.floor(Math.random() * wordBank.length)];
    }
    // Check if the typed word matches any of the available words
    if (this.leftWord.checkMatch(typedWord)) {
        // Lets attempt to update the players location and find if it moved
        let result = this.player.update(time, delta, "left");

        if (result === true) {
          console.log("left true");
          this.correctNoise.play();

          // replace it with a new word
          this.leftWord.update(newWord);

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
        this.middleWord.update(newWord);

        // Increment Score
        this.score += 1;
      } else {
        this.wrongNoise.play();
        console.log("Wrong")
      }
    } else if (this.rightWord.checkMatch(typedWord)) {
      // Lets attempt to update the players location and find if it moved
      let result = this.player.update(time, delta, "right");

      if (result === true) {
        console.log("right true");
        this.correctNoise.play();

        this.rightWord.update(newWord);

        // Lets attempt to update the players location and find if it moved
        this.player.update(time, delta, "right");

        // Increment Score
        this.score += 1;
      } else {
        this.wrongNoise.play();
        console.log("Wrong")
      }
    }
  }

  // Method to handle the end of the game
  handleGameOver() {
    // Prompt for player name
    const playerName = prompt("Enter your name:");

    // If player provided a name, save it with their score
    if (playerName) {
      const playerData = {
        name: playerName,
        score: this.score
      };

      // Save to local storage (for simplicity, using local storage here)
      let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
      leaderboard.push(playerData);
      leaderboard.sort((a, b) => b.score - a.score);  // Sort leaderboard by score (descending)

      // Save back to local storage
      localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    }

    // Update global high score if needed
    if (this.score > globalHighScore) {
      globalHighScore = this.score;
      localStorage.setItem('highScore', globalHighScore);
    }

    // Go to the menu scene
    this.scene.start('MenuScene');
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

    // update score
    this.scoreText.destroy();
    this.scoreText = this.add.text(
      10, // Position it near the left edge
      this.cameras.main.height - 40, // Adjusted to make it a little higher from the bottom
      `Current Score: ${this.score}`, // Display the high score
      {
        font: '24px Arial',
        fill: '#ffffff',
        align: 'left'
      }
    );
    // Align to the bottom-left corner (origin at top-left of the text)
    this.scoreText.setOrigin(0, 1);
  }
}

// Configuration for the Phaser game
const config = {
  type: Phaser.AUTO, // Automatically choose WebGL or Canvas
  width: window.innerWidth / 1.2, // Full-screen width
  height: window.innerHeight + 30, // Full-screen height
  backgroundColor: 0x34495e,
  scene: [MenuScene, MainScene, LeaderboardScene], // Start with MenuScene
  parent: 'app', // Optionally set a DOM element to attach the canvas
};

// Initialize the Phaser game
const game = new Phaser.Game(config);

// globals
let wordBank = [];
let globalHighScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;