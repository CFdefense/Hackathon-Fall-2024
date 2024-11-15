// Player Sprite
export class Player {
  constructor(scene, x, y) {
    // Players Properties
    this.x = x;
    this.y = y;
    this.width = 75; 
    this.height = 75;

    // Players Design
    this.scene = scene;
    this.graphics = scene.add.graphics(); 
    this.graphics.fillStyle(0xff0000, 1); 
    this.graphics.fillRect(x, y, this.width, this.height);
    this.scene.add.existing(this.graphics);

    // Add key events
    this.keyLeft = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.keyRight = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.keyUp = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.keyDown = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
  }

  update(time, delta) {
    const moveDistance = 1

    // Handle movement with arrow keys
    if (this.keyLeft.isDown) {
      this.x -= moveDistance; // Move left
    } else if (this.keyRight.isDown) {
      this.x += moveDistance; // Move right
    }
    
    if (this.keyUp.isDown) {
      this.y -= moveDistance; // Move up
    } else if (this.keyDown.isDown) {
      this.y += moveDistance; // Move down
    }

    // Clear the previous graphics before redrawing
    this.graphics.clear();

    // Set the fill color again (important after clear)
    this.graphics.fillStyle(0xff0000, 1); // Red color

    // Redraw the player at the new position
    this.graphics.fillRect(this.x, this.y, this.width, this.height);
  }
}

// Obstacle Sprite
export class Obstacle {
  constructor(scene, x, y) {
    // Obstacle Properties
    this.x = x;
    this.y = y;
    this.width = 75; 
    this.height = 75;

    // Obstacle Design
    this.scene = scene;
    this.graphics = scene.add.graphics(); 
    this.graphics.fillStyle(0x0000, 1); 
    this.graphics.fillRect(x, y, this.width, this.height);
    this.scene.add.existing(this.graphics);
  }

  update(time, delta) {
    // Move down some value towards player
    const newYPos = this.y - 1;

    // Clear the previous graphics before redrawing
    this.graphics.clear();

    // Set the fill color again (important after clear)
    this.graphics.fillStyle(0xff0000, 1); // Red color

    // Redraw the Obstacle at the new position
    this.graphics.fillRect(this.x, newYPos, this.width, this.height);
  }
}

// Game Window Sprite
export class gameWindow {
  constructor(scene, x, y) {
    this.scene = scene; // Reference to the Phaser scene
    this.graphics = scene.add.graphics(); // Create a graphics object\

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

  // Method to update the word's content and position
  update(newText, xOffset = 10, yOffset = 10) {
    // Update the text inside the rectangle
    this.text.setText(newText);

    // Update text position to keep it inside the rectangle
    this.text.setPosition(this.x + xOffset, this.y + yOffset);
  }
}
