import Phaser, { AUTO, Scenes } from "phaser"
import MainMenu from "./scenes/MainMenu"
const config = {
    type: AUTO,
    width: 800,
    height: 600,
    parent: "game",
    backgroundColor: "#abcffe",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 100},
            debug: true
        }
    },
    scene: [
       /*import scenes*/
       MainMenu
    ]
}

export default config