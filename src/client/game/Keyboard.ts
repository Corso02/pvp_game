const { KeyCodes } = Phaser.Input.Keyboard


export interface Keyboard{
    [key: string]: number
}

export const KEY_BINDINGS: Keyboard = {
    JUMP: KeyCodes.SPACE,
    JUMP_ALT: KeyCodes.UP,
    MOVE_RIGHT: KeyCodes.RIGHT,
    MOVE_RIGHT_ALT: KeyCodes.D,
    MOVE_LEFT: KeyCodes.LEFT,
    MOVE_LEFT_ALT: KeyCodes.A,
    PAUSE: KeyCodes.ESC
}

