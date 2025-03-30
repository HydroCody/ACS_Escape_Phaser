import { IntroScene } from "./IntroScene.js";
import { MainScene } from "./MainScene.js";
import { EndScene } from "./EndScene.js";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [IntroScene, MainScene, EndScene],  // Register all scenes
};

const game = new Phaser.Game(config);