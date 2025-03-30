export class EndScene extends Phaser.Scene {
    constructor() {
        super({ key: "EndScene" });
    }

    create() {
        let { width, height } = this.sys.game.canvas;

        // Dark background overlay
        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7).setOrigin(0.5);

        // Congratulations text
        this.add.text(width / 2, height / 3, "Congratulations!", {
            font: "32px Arial",
            fill: "#ffffff"
        }).setOrigin(0.5);

        // Message text
        this.add.text(width / 2, height / 2, "You successfully restocked the crash cart! \nJust in time too! I hear the next patient coming!\nGreat job!", {
            font: "24px Arial",
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5);

        // Button to restart the game
        let restartButton = this.add.text(width / 2, height * 0.7, "Play Again", {
            font: "24px Arial",
            fill: "#ffffff",
            backgroundColor: "#444444",
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive();

        // Button hover effects
        restartButton.on('pointerover', () => restartButton.setBackgroundColor('#555555'));
        restartButton.on('pointerout', () => restartButton.setBackgroundColor('#444444'));

        // Restart game on click
        restartButton.on('pointerdown', () => {
            this.scene.start("MainScene"); // Restart main game
        });
    }
}
