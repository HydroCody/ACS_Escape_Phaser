export class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: "IntroScene" });
    }

    preload() {
        // Load assets if needed
    }

    create() {
        this.add.text(400, 200, "Acute Coronary Syndrome Escape Room!", {
            font: "34px Arial",
            fill: "#ffffff"
        }).setOrigin(0.5);

        this.add.text(400, 300, "Can you refill the crash cart in time? Solve puzzles to find all the medications and get them refilled into the crash cart!", {
            font: "20px Arial",
            fill: "#ffffff",
            wordWrap: { width: 600 },
            align: "center"
        }).setOrigin(0.5);

        let startButton = this.add.text(400, 400, "Start", {
            font: "20px Arial",
            fill: "#ffffff",
            backgroundColor: "#444444",
            padding: { x: 10, y: 5 }
        })
        .setOrigin(0.5)
        .setInteractive();

        startButton.on("pointerdown", () => {
            this.scene.start("MainScene");
        });
    }
}
