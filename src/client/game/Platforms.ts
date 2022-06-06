export interface Platform{
    x_cord: number,
    y_cord: number,
    width: number,
    height: number,
    color: number
}

export const world_1_platforms: Platform [] = [
    {x_cord: 150, y_cord: 300, width: 150, height: 20, color: 0xff0000},
    {x_cord: 650, y_cord: 300, width: 150, height: 20, color: 0xff0000},
    {x_cord: 400, y_cord: 500, width: 800, height: 20, color: 0xff0000}
]

export const render_platforms = (scene: Phaser.Scene, platforms: Platform [], staticGroup: Phaser.Physics.Arcade.StaticGroup) => {
    platforms.forEach((platform: Platform, idx: number) => {
        //scene.add.rectangle(platform.x_cord, platform.y_cord, platform.width, platform.height, platform.color)
        staticGroup.add(scene.add.rectangle(platform.x_cord, platform.y_cord, platform.width, platform.height, platform.color), true)
    })
}