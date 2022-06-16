import { Input, Scene } from "phaser";
import Player from "../player";
import {KEY_BINDINGS, Keyboard} from "../Keyboard";
import {render_platforms, world_1_platforms } from "../Platforms";
import { check_bullets, create_custom_weapon, render_weapon, Weapon } from "../Weapon";
import socket from "../..";

class MainMenu extends Scene{
    private player: Player
    private opponent: Player
    private keys: any
    private platforms: Phaser.Physics.Arcade.StaticGroup
    private weapons: Phaser.Physics.Arcade.Group
    private bullets: Phaser.Physics.Arcade.StaticGroup

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
       this.load.image("bullet", "images/bullet.png")
    }

    create(){
        /*
            add objects to scene, and events
        */
        this.player = new Player(this, 200, 100, "player", this.game)

        this.opponent = new Player(this, 600, 100, "player", this.game)
     //   this.opponent.setVisible(false)
        
        this.weapons = this.physics.add.group()
        let pistol: Weapon = create_custom_weapon("pistol", 200, 250, 20)
        render_weapon(this, this.weapons, pistol)

        this.input.keyboard.enabled = true
        this.input.mouse.enabled = true
      
        this.keys = this.input.keyboard.addKeys(KEY_BINDINGS)
        this.platforms = this.physics.add.staticGroup()
        render_platforms(this, world_1_platforms, this.platforms)

        this.bullets = this.physics.add.staticGroup()
        
        this.physics.add.collider(this.platforms, this.weapons)
        this.physics.add.collider(this.platforms, this.player)
        this.physics.add.collider(this.weapons, this.player, this.player.pickWeapon, null, this.player) 
        this.physics.add.collider(this.opponent, this.platforms)


        this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            if(pointer.leftButtonDown()/*  && this.player.getHasWeapon() */){
                this.player.shoot(this.bullets, this, pointer)
            }
        })

        this.input.on("pointermove", (pointer: Input.Pointer) => {
            this.player.rotateArm(pointer.x, pointer.y)
        })

        socket.on("secondPlayerConnected", (data: any) => {
            if(data.forId == socket.id){
                this.opponent.moveStop()
                this.opponent.setVisible(true)
            }
        })

        socket.on("playerMovement", (data: any) => {
            if(data.forId == socket.id){
                console.log("player moved")
                this.opponent.x = data.x_cord
                this.opponent.y = data.y_cord
                if(data.movement === "right")
                    this.opponent.moveRight(data.pointer_x_cord, data.pointer_y_cord)
                else if(data.movement === "left")
                    this.opponent.moveLeft(data.pointer_x_cord, data.pointer_y_cord)
                else
                    this.opponent.moveStop()
            }
        })

        socket.on("rotateArm", (data: any) => {
            if(data.forId === socket.id){
                this.opponent.rotateArm(data.x_cord, data.y_cord)
            }
        })
    }

    update(){
        this.player.move(this.keys, this.input.activePointer)
        check_bullets(this.bullets)
    }
}

export default MainMenu