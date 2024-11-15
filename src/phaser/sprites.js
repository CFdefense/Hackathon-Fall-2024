// Player Sprite
export class Player {
  constructor(scene, x, y) {
    // Players Properties
    this.x = x;
    this.y = y;
    this.width = 75; 
    this.height = 75;
    this.position = "middle"; // flag for current position

    // Players Design
    this.scene = scene;
    this.graphics = scene.add.graphics(); 
    this.graphics.fillStyle(0xff0000, 1); 
    this.graphics.fillRect(x, y, this.width, this.height);
    this.scene.add.existing(this.graphics);
  }

  update(time, delta, direction) {
    let newXPos = this.x;
    let newDirection = null; // Flag to be returned to tell Game whether or not to update the word
    switch(direction) {
      case "left":
        // Can only go left if in the middle 
        if (this.position === "middle") {
          newXPos = 291;
          this.position = "left";
          newDirection = true;
        }
        break;
      case "right":
        // Can only go right if in the middle
        if (this.position === "middle") {
          newXPos = 441;
          this.position = "right";
          newDirection = true;
        }
        break;
      case "middle":
        // Can go middle from anywhere
        newXPos = 365;
        this.position = "middle";
        newDirection = true;
        break;
    }

    this.x = newXPos;

    // Clear the previous graphics before redrawing
    this.graphics.clear();

    // Set the fill color again (important after clear)
    this.graphics.fillStyle(0xff0000, 1); // Red color

    // Redraw the player at the new position
    this.graphics.fillRect(this.x, this.y, this.width, this.height);

    return newDirection
  }
}

// Obstacle Sprite
export class Obstacle {
  constructor(scene, newPosition) {
    // Obstacle Properties
    this.width = 75; 
    this.height = 75;
    this.position = newPosition; // flag for current position

    // Set current x and y based on position
    switch(newPosition) {
      case "Left":
        this.x = 291;
        this.y = 75;
        break;
      case "Middle":
        this.x = 365;
        this.y = 75;
        break;
      case "Right":
        this.x = 441;
        this.y = 75;
        break;
    }

    // Obstacle Design
    this.scene = scene;
    this.graphics = scene.add.graphics(); 
    this.graphics.fillStyle(0x000000, 1); 
    this.graphics.fillRect(this.x, this.y, this.width, this.height);
    this.scene.add.existing(this.graphics);
  }

  update(time, delta) {
    // Move down some value towards player
    this.y += .05;

    // Clear the previous graphics before redrawing
    this.graphics.clear();

    // Set the fill color again (important after clear)
    this.graphics.fillStyle(0x000000, 1); // Red color

    // Redraw the Obstacle at the new position
    this.graphics.fillRect(this.x, this.y, this.width, this.height);
  }
}

// Game Window Sprite
export class gameWindow {
  constructor(scene, x, y) {
    this.scene = scene; // Reference to the Phaser scene
    this.graphics = scene.add.graphics(); // Create a graphics object

    const width = 225; // Fixed width
    const height = 400; // Fixed height
    
    // Draw the black outline
    this.graphics.lineStyle(2, 0x000000, 1); // Line width and color
    this.graphics.strokeRect(x, y, width, height);

    // Fill the rectangle with white
    this.graphics.fillStyle(0xffffff, 1);
    this.graphics.fillRect(x, y, width, height);
  }
}

// Word Object to show what words you need to match to move
export class Word {
  constructor(scene, x, y, width, height, initialText) {
    // Word's properties
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.initialText = initialText || 'Default Word'; // Default to "Default Word" if no text is provided

    // Word's design
    this.scene = scene;

    // Create a graphics object for the rectangle
    this.graphics = scene.add.graphics();
    this.graphics.fillStyle(0x00ff00, 1); // Set rectangle color (green)
    this.graphics.fillRect(this.x, this.y, this.width, this.height);

    // Create text inside the rectangle with increased resolution (adjust the 'resolution' parameter)
    this.text = scene.add.text(this.x + 10, this.y + 10, this.initialText, {
      fontSize: '18px',
      fill: '#00000',
      resolution: 1,
    });
  }
  
  // Method to check an input text to the words text
  checkMatch(inputText) {
    return this.initialText.toLowerCase() === inputText.toLowerCase();
  }

  // Method to update the word's content and position
  update(newText, xOffset = 10, yOffset = 10) {
    // Update the text inside the rectangle
    this.initialText = newText.trim(); // Trim spaces
    this.text.setText(newText);

    // Update text position to keep it inside the rectangle
    this.text.setPosition(this.x + xOffset, this.y + yOffset);
  }
}
