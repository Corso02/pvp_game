import Phaser ,{ Input, Physics } from "phaser";
import { pistol, Weapon } from "./Weapon";
import RotateTo from 'phaser3-rex-plugins/plugins/rotateto.js';


class Player extends Phaser.GameObjects.Container{

    private doubleJumped: boolean
    private hasWeapon: boolean
    private weapon: Weapon
    private arm: Physics.Arcade.Sprite
    private player_body: Phaser.GameObjects.Sprite
    private moving: boolean
    private arm_container: Phaser.GameObjects.Container //container to clip together weapon and arm, easier manipulation with weapon and arm
    private rotateObj: RotateTo

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, game: Phaser.Game){
        super(scene, x, y)
        this.player_body = scene.add.sprite(0 , 0, texture) //added sprite like this to make animations playable (sprites in container do not play animations)
        this.arm = new Physics.Arcade.Sprite(scene, 0, 0, "arm") // +7, +3
        this.arm_container =  new Phaser.GameObjects.Container(scene, 0, -5, [this.arm]) /* new ContainerLite(scene, 30, 40, 25, 15, [this.arm]) */
        
        this.setSize(42, 75) //set actual size of container
        this.setDisplaySize(42, 75) //set render size, must call setSize before this funtion (container size is 0x0 when created)
       
        this.add([this.player_body, this.arm_container]) // add elements to this container

        scene.add.existing(this)
        this.arm.setOrigin(0, 0) //pivot point
     
        this.scene.physics.world.enableBody(this, Physics.Arcade.DYNAMIC_BODY)
        this.doubleJumped = false
        this.hasWeapon = false

        this.scene.physics.world.enableBody(this.arm, Physics.Arcade.STATIC_BODY)
        this.scene.physics.world.enableBody(this.arm_container, Physics.Arcade.STATIC_BODY)

        this.createAnims(game)
    }

    createAnims(game: Phaser.Game): void{
        let frameRate: number = 15
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

    moveRight(pointer: Phaser.Input.Pointer): void{
        this.player_body.setFlipX(pointer.worldX < this.x)
        this.arm_container.scaleX = pointer.worldX < this.x ? -1 : 1        
        this._setVelocityX(150) 
        this.moving = true
        this.rotateArm(pointer)
    }

    moveLeft(pointer: Phaser.Input.Pointer): void{
        this.player_body.setFlipX(pointer.worldX > this.x)
        this.arm_container.scaleX = pointer.worldX < this.x ? -1 : 1 //flipping container
        this._setVelocityX(-150)
        this.moving = true
        this.rotateArm(pointer)
    }

    jump(): void{
        this._setVelocityY(-150)
    }

    moveStop(): void{
        this.player_body.setFlipX(false)
        this.arm_container.scaleX = 1
        this.moving = false
        this._setVelocityX(0)
    }

    move(keys: any, pointer: Phaser.Input.Pointer): void{
        if(keys.MOVE_LEFT.isDown || keys.MOVE_LEFT_ALT.isDown){
            this.player_body.anims.play("left_no_gun", true)
            this.moveLeft(pointer)
        }
        else if(keys.MOVE_RIGHT.isDown || keys.MOVE_RIGHT_ALT.isDown){
            this.player_body.anims.play("right_no_gun", true)
            this.moveRight(pointer)
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

    getPlayerBody(): Phaser.GameObjects.Sprite{
        return this.player_body
    }

    rotateArm(pointer: Input.Pointer, scene?: Phaser.Scene){
        let angleOffset: number = 11.75
        this.arm_container.setRotation((Phaser.Math.Angle.BetweenPoints(this, pointer) + angleOffset) - ((pointer.worldX < this.x && this.moving) ? 8 : 0)) // rotata container accroding to mouse position
        if(this.arm_container.getByName("weapon") != null)
            this.arm_container.getByName("weapon").body.gameObject.scaleY = !this.moving && pointer.worldX < this.x ? -1 : 1 // rotate weapon on Y axis according to mouse pos.
    }
    // object1 - player container, object2 - weapon
    pickWeapon(player: any, weapon: any){
        if(weapon.texture.key == "pistol")
            this.setWeapon(pistol)
        this.setHasWeapon(true)
        weapon.setActive(false)
        weapon.body.enable = false
        weapon.x = 25 //position in container
        weapon.y = 22
        weapon.name = "weapon"
        weapon.rotation = -11.75
        this.arm_container.add(weapon) //clip weapon to arm
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