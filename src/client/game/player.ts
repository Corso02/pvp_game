import Phaser ,{ Input, Physics, Time } from "phaser";
import { pistol, Weapon } from "./Weapon";
import socket from "..";

interface movement {
    moving: boolean,
    moving_left: boolean,
    moving_right: boolean
}

interface event{
    timestamp: number,
    event: string
}

class Player extends Phaser.GameObjects.Container{

    private doubleJumped: boolean
    private hasWeapon: boolean
    private weapon: Weapon
    private arm: Physics.Arcade.Sprite
    private player_body: Phaser.GameObjects.Sprite
    private movement: movement = {
        moving: false,
        moving_left: false,
        moving_right: false
    }
    private arm_container: Phaser.GameObjects.Container //container to clip together weapon and arm, easier manipulation with weapon and arm
    private movement_event_sent: event = { // track when last movement event was emmited
        event: "",
        timestamp: 0
    }

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

        this.movement_event_sent.event = "stop"
        this.movement_event_sent.timestamp = 0

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

    setMovingRight(val: boolean): void{
        this.movement.moving = val
        this.movement.moving_right = val
    }

    setMovingLeft(val: boolean): void{
        this.movement.moving = val
        this.movement.moving_right = val
    }

    resetMovement(): void{
        this.movement.moving = false
        this.movement.moving_left = false
        this.movement.moving_right = false
    }

    moveRight(x_cord: number, y_cord: number): void{
        this.player_body.anims.play("right_no_gun", true)
        this._setVelocityX(150) 
        this.setMovingLeft(false)
        this.setMovingRight(true)
        //if(pointer){
            this.player_body.setFlipX(x_cord < this.x)
            this.arm_container.scaleX = x_cord < this.x ? -1 : 1        
            this.rotateArm(x_cord, y_cord)
        //}
    }

    moveLeft(x_cord: number, y_cord: number): void{
        this.player_body.anims.play("left_no_gun", true)
        this._setVelocityX(-150)
        this.setMovingRight(false)
        this.setMovingLeft(true)
        //if(pointer){
            this.player_body.setFlipX(x_cord > this.x)
            this.arm_container.scaleX = x_cord < this.x ? -1 : 1 //flipping container
            this.rotateArm(x_cord, y_cord)
        //}
    }

    jump(): void{
        this._setVelocityY(-150)
    }

    moveStop(): void{
        this.player_body.anims.play("turn_no_gun", true)
        this.player_body.setFlipX(false)
        this.arm_container.scaleX = 1
        this.resetMovement()
        this._setVelocityX(0)
    }

    move(keys: any, pointer: Phaser.Input.Pointer): void{
        if(keys.MOVE_LEFT.isDown || keys.MOVE_LEFT_ALT.isDown){
            this.moveLeft(pointer.x, pointer.y)
            if(this.movement_event_sent.event != "left" || this.movement_event_sent.timestamp - Math.floor(Date.now() / 1000) > 10){
                socket.emit("movement", {
                    x_cord: this.x,
                    y_cord: this.y,
                    pointer_x_cord: pointer.x,
                    pointer_y_cord: pointer.y,
                    movement: "left"
                })
                this.movement_event_sent.event = "left"
                this.movement_event_sent.timestamp = Math.floor(Date.now() / 1000)
            }
        }
        else if(keys.MOVE_RIGHT.isDown || keys.MOVE_RIGHT_ALT.isDown){
            this.moveRight(pointer.x, pointer.y)
            if(this.movement_event_sent.event != "right" || this.movement_event_sent.timestamp - Math.floor(Date.now() / 1000) > 10){
                socket.emit("movement", {
                    x_cord: this.x,
                    y_cord: this.y,
                    pointer_x_cord: pointer.x,
                    pointer_y_cord: pointer.y,
                    movement: "right"
                })

                this.movement_event_sent.timestamp = Math.floor(Date.now() / 1000)
                this.movement_event_sent.event = "right"
            }
        }
        else{
            this.moveStop()

            if(this.movement_event_sent.event != "stop"){
                socket.emit("movement", {
                    x_cord: this.x,
                    y_cord: this.y,
                    pointer_x_cord: pointer.x,
                    pointer_y_cord: pointer.y,
                    movement: "stop"
                })
                this.movement_event_sent.event = "stop"
            }
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

    rotateArm(x_cord: number, y_cord: number, scene?: Phaser.Scene){
        let angleOffset: number = 11.75
        this.arm_container.setRotation((Phaser.Math.Angle.Between(this.x, this.y, x_cord, y_cord) + angleOffset) - ((x_cord < this.x && this.movement.moving) ? 8 : 0)) // rotata container accroding to mouse position
        if(this.arm_container.getByName("weapon") != null)
            this.arm_container.getByName("weapon").body.gameObject.scaleY = !this.movement.moving && x_cord < this.x ? -1 : 1 // rotate weapon on Y axis according to mouse pos.
        socket.emit("armRotation", {
            x_cord,
            y_cord
        })
    }
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

    shoot(bullets: Phaser.Physics.Arcade.StaticGroup, scene: Phaser.Scene, pointer: Phaser.Input.Pointer): void{
        if(this.getHasWeapon()){
            //let newBullet: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody = scene.physics.add.sprite(this.x, this.y, "bullet")
            let newBullet = scene.add.image(this.x + (this.player_body.flipX && this.movement.moving_left ? -20 : 20), this.y - 10, "bullet")
            scene.physics.world.enableBody(newBullet)
            newBullet.body.gameObject.body.collideWorldBounds = true
            newBullet.body.gameObject.body.allowGravity = false
            scene.physics.moveTo(newBullet, pointer.worldX, pointer.worldY, this.weapon.bullet_speed)
            newBullet.setRotation(this.arm_container.rotation - 11.75 + ((pointer.worldX < this.x && this.movement.moving) ? 8 : 0))
            bullets.add(newBullet)
        }
    }

    _setVelocityX(velocity: number): void{
        this.body.velocity.x = velocity
    }

    _setVelocityY(velocity: number): void{
        this.body.velocity.y = velocity
    }
}

export default Player