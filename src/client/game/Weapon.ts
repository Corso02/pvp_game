import { Physics } from "phaser"

export interface Weapon{
    x_cord: number, 
    y_cord: number,
    texture: string,
    damage: number,
    bullet_speed: number
}

 export const pistol: Weapon = {
    x_cord: 0,
    y_cord: 0, 
    texture: "pistol",
    damage: 20,
    bullet_speed: 400
} 

export const create_custom_weapon = (texture: string, x_cord?: number, y_cord?: number, damage?: number, bullet_speed?: number): Weapon => {
    let custom_weapon: Weapon = {
        x_cord: x_cord | 100,
        y_cord: y_cord | 100,
        texture,
        damage: damage | 10,
        bullet_speed: bullet_speed | 200
    }
    return custom_weapon
}

export const render_weapon = (scene: Phaser.Scene, group: Physics.Arcade.Group, weapon: Weapon) => {
    group.add(scene.add.sprite(weapon.x_cord, weapon.y_cord, weapon.texture), true)
}

export const check_bullets = (group: Physics.Arcade.StaticGroup) => {
    group.children.entries.map((bullet: Phaser.GameObjects.Image ) => {
        //console.log(bullet)
        if(bullet.body.gameObject.body.velocity.x == 0 || bullet.body.gameObject.body.velocity.y == 0){
            console.log("hit")
            bullet.setVisible(false)
            bullet.setActive(false)
            bullet.destroy(true)
        }
        return bullet
    })
}