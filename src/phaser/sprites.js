// Player Sprite
export class Player {
    constructor(scene, x, y, width, height) {
      this.scene = scene; // Reference to the Phaser scene
      this.graphics = scene.add.graphics(); // Create a graphics object
      this.graphics.fillStyle(0xff0000, 1); // Set the fill color
      this.graphics.fillRect(x, y, width, height); // Draw the rectangle
    }
  }

// Game Window Sprite
export class gameWindow {
  constructor(scene, x, y) {
    this.scene = scene; // Reference to the Phaser scene
    this.graphics = scene.add.graphics(); // Create a graphics object\

    const width = 225; // Fixed width
    const height = 350; // Fixed height
    
    // Draw the black outline
    this.graphics.lineStyle(2, 0x000000, 1); // Line width and color
    this.graphics.strokeRect(x, y, width, height);

    // Fill the rectangle with white
    this.graphics.fillStyle(0xffffff, 1);
    this.graphics.fillRect(x, y, width, height);
  }
}