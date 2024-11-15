export class RedSquare {
    constructor(scene, x, y, width, height) {
      this.scene = scene; // Reference to the Phaser scene
      this.graphics = scene.add.graphics(); // Create a graphics object
      this.graphics.fillStyle(0xff0000, 1); // Set the fill color
      this.graphics.fillRect(x, y, width, height); // Draw the rectangle
    }
  }