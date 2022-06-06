import { Physics } from "phaser"

export interface Weapon{
    x_cord: number, 
    y_cord: number,
    texture: string,
    damage: number
}

/* export const pistol: Weapon = {
    x_cord: 0,
    y_cord: 0, 
    texture: "pistol",
    damage: 20
} */

export const create_custom_weapon = (texture: string, x_cord?: number, y_cord?: number, damage?: number): Weapon => {
    let custom_weapon: Weapon = {
        x_cord: x_cord | 100,
        y_cord: y_cord | 100,
        texture,
        damage: damage | 10
    }
    return custom_weapon
}

export const render_weapon = (scene: Phaser.Scene, group: Physics.Arcade.Group, weapon: Weapon) => {
    group.add(scene.add.sprite(weapon.x_cord, weapon.y_cord, weapon.texture), true)
}