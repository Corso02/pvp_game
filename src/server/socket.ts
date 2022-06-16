export interface movement_event{
    x_cord: number,
    y_cord: number,
    movement: string
}

export interface room{
    room_id: string,
    player_1_id?: string,
    player_2_id?: string
}

export interface player{
    id: string,
    connected_to_room: boolean
}