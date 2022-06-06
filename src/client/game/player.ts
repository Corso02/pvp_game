import Phaser ,{ Input, Physics } from "phaser";
import { Weapon } from "./Weapon";

class Player extends Phaser.GameObjects.Container{

    private doubleJumped: boolean
    private hasWeapon: boolean
    private weapon: Weapon
    private arm: Physics.Arcade.Sprite
    private player_body: Physics.Arcade.Sprite

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, game: Phaser.Game){
        super(scene, x, y)
        this.player_body = new Physics.Arcade.Sprite(scene, 0, 0, texture)
        this.player_body.body = new Physics.Arcade.Body(scene.physics.world, this.player_body)
        this.arm = new Physics.Arcade.Sprite(scene, 7, 3, "arm") // +7, +3
        this.arm.body = new Physics.Arcade.Body(scene.physics.world, this.arm) 
        this.setSize(42, 75)
        this.setDisplaySize(42, 75)
       
        this.add([this.player_body, this.arm])

        scene.add.existing(this)
     
        this.scene.physics.world.enableBody(this, Physics.Arcade.DYNAMIC_BODY)
        this.doubleJumped = false
        this.hasWeapon = false

        this.createAnims(game)
    }

    createAnims(game: Phaser.Game): void{
        let frameRate: number = 2
        game.anims.create({
            key: "left_no_gun",
            frames: game.anims.generateFrameNumbers("player", {start: 0, end: 3}),
            frameRate,
            repeat: -1
        })

        game.anims.create({
            key: "turn_no_gun",
            frames: [{key: "player", frame: 4}],
            frameRate
        })

        game.anims.create({
            key: "right_no_gun",
            frames: game.anims.generateFrameNumbers("player", {start: 5, end: 8}),
            frameRate,
            repeat: -1
        })
    }

    setDoubleJumped(val: boolean): void{
        this.doubleJumped = val
    }

    getHasWeapon(): boolean{
        return this.hasWeapon
    }

    setHasWeapon(newState: boolean): void{
        this.hasWeapon = newState
    }

    getWeapon(): Weapon{
        return this.weapon
    }

    setWeapon(newWeapon: Weapon){
        this.weapon = newWeapon
    }

    moveRight(): void{
        this._setVelocityX(150) 
    }

    moveLeft(): void{
         this._setVelocityX(-150)
    }

    jump(): void{
        this._setVelocityY(-150)
    }

    moveStop(): void{
        this._setVelocityX(0)
    }

    move(keys: any): void{
        if(keys.MOVE_LEFT.isDown || keys.MOVE_LEFT_ALT.isDown){
            this.player_body.anims.play("left_no_gun", true)
            this.moveLeft()
        }
        else if(keys.MOVE_RIGHT.isDown || keys.MOVE_RIGHT_ALT.isDown){
            this.player_body.anims.play("right_no_gun", true)
            this.moveRight()
        }
        else{
            this.player_body.anims.play("turn_no_gun", true)
            this.moveStop()
        }
        if(Phaser.Input.Keyboard.JustDown(keys.JUMP) || Phaser.Input.Keyboard.JustDown(keys.JUMP_ALT)){
            if(this.body.gameObject){
                this.setDoubleJumped(false)
                this.jump()
            }
            else if(!this.doubleJumped){
                this.setDoubleJumped(true)
                this.jump()
            }
        }
    }

    getArm(): Physics.Arcade.Sprite{
        return this.arm
    }

    getPlayerBody(): Physics.Arcade.Sprite{
        return this.player_body
    }

    rotateArm(pointer: Input.Pointer){
        this.arm.setRotation(Phaser.Math.Angle.Between(this.arm.x, this.arm.y, pointer.worldX, pointer.worldY) - 135)
    }

    pickWeapon(weaponToPick: Weapon){
        this.setHasWeapon(true)
        this.setWeapon(weaponToPick)
    }

    shoot(): void{
        console.log("klik")
    }

    _setVelocityX(velocity: number): void{
        this.body.velocity.x = velocity
    }

    _setVelocityY(velocity: number): void{
        this.body.velocity.y = velocity
    }
}

export default Player