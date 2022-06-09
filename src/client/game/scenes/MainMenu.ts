import { Input, Scene } from "phaser";
import Player from "../player";
import {KEY_BINDINGS, Keyboard} from "../Keyboard";
import {render_platforms, world_1_platforms } from "../Platforms";
import { create_custom_weapon, render_weapon, Weapon } from "../Weapon";

class MainMenu extends Scene{
    private player: Player
    private keys: any
    private platforms: Phaser.Physics.Arcade.StaticGroup
    private weapons: Phaser.Physics.Arcade.Group

    constructor (){
        super({key: "MainMenu"})
      //  
    }
    preload(){
        /*
            preload assets requires by this scene
        */
       this.load.image("img1", "images/adele6.jpg")
       this.load.image("pistol", "images/pistol.png")
       this.load.spritesheet("player", "images/player.png", {frameHeight: 75, frameWidth: 42})
       this.load.image("arm", "images/arm.png")
    }

    create(){
        /*
            add objects to scene, and events
        */
        this.player = new Player(this, 200, 100, "player", this.game)
        
        this.weapons = this.physics.add.group()
        let pistol: Weapon = create_custom_weapon("pistol", 200, 250, 20)
        render_weapon(this, this.weapons, pistol)

        this.input.keyboard.enabled = true
        this.input.mouse.enabled = true
      
        this.keys = this.input.keyboard.addKeys(KEY_BINDINGS)
        this.platforms = this.physics.add.staticGroup()
        render_platforms(this, world_1_platforms, this.platforms)
        
        this.physics.add.collider(this.platforms, this.weapons)
        this.physics.add.collider(this.platforms, this.player)
        this.physics.add.collider(this.weapons, this.player, this.player.pickWeapon, null, this.player) 


        this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            if(pointer.leftButtonDown()/*  && this.player.getHasWeapon() */){
                this.player.shoot()
            }
        })

        this.input.on("pointermove", (pointer: Input.Pointer) => {
            this.player.rotateArm(pointer)
        })
    }

    update(){
        this.player.move(this.keys, this.input.activePointer)
    }
}

export default MainMenu