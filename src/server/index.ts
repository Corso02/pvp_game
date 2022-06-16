import "dotenv/config"
import express, {Express, Request, Response} from "express"
import { Server, Socket } from "socket.io"
import path = require("path")
import {movement_event, room, player} from "./socket"

const app: Express = express()
const port: string = process.env.PORT || process.env.DEV_PORT

app.get('/', (req: Request, res: Response) => {
    res.status(200).sendFile(path.resolve("./views/index.html"))
})

app.use(express.static(path.resolve("./static")))

let server = app.listen(port, () => {
    console.log(`Listening on PORT ${port}`)
})


const io: Server = require("socket.io")(server)

let connectedPlayers: player[] = []
let rooms: room[] = []


io.on("connection", (socket: Socket) => {
    console.log(socket.id)

    let new_player: player = {
        connected_to_room: false,
        id: socket.id
    }

    connectedPlayers.push(new_player)

    console.log(connectedPlayers.length)

    if(connectedPlayers.length % 2 == 0){
        let new_id: string = generateRandomString()
        let second_player: player = getFreePlayer()

        io.emit("secondPlayerConnected", {
            forId: second_player.id
        })

        io.emit("secondPlayerConnected", {
            forId: socket.id
        })

        let new_room: room = {
            room_id: new_id,
            player_1_id: new_player.id,
            player_2_id: second_player.id
        }

        rooms.push(new_room)
    }

    else console.log("wait pls")

    socket.on("movement", (data: movement_event) => {
        if(getPlayerById(socket.id).connected_to_room){
            let otherPlayerId: string = ""
            let playerRoom: room = getRoomByPlayerId(socket.id)
            otherPlayerId = playerRoom.player_1_id === socket.id ? playerRoom.player_2_id : playerRoom.player_1_id 
            io.emit("playerMovement", {
                forId: otherPlayerId,
                ...data
            })  
        }
    })

    socket.on("armRotation", (data: any) => {
        if(getPlayerById(socket.id).connected_to_room){
            let otherPlayerId: string = ""
            let playerRoom: room = getRoomByPlayerId(socket.id)
            otherPlayerId = playerRoom.player_1_id === socket.id ? playerRoom.player_2_id : playerRoom.player_1_id 
            io.emit("rotateArm", {
                forId: otherPlayerId,
                ...data
            })
        }
    })

    socket.on("disconnect", () => {
        removeRoom(getRoomByPlayerId(socket.id))
        removeElementFromArray(socket.id)
        console.log(rooms)
        console.log(connectedPlayers)
    })
})

//move given element to the end, and remove it
const removeElementFromArray = (playerId: string): void => {
    let playerToRemove: player = getPlayerById(playerId)
    connectedPlayers[connectedPlayers.indexOf(playerToRemove)] = connectedPlayers[connectedPlayers.length - 1]
    connectedPlayers.pop()
}

const getPlayerById = (id: string): player => {
    return connectedPlayers.filter((player: player) => player.id === id)[0]
}

const getFreePlayer = () : player => {
    return changePlayerState(connectedPlayers.filter((player: player) => !player.connected_to_room)[0])
}

const changePlayerState = (player: player): player => {
    player.connected_to_room = true
    return player
}

const generateRandomString = (): string => {
    return Math.random().toString(36).slice(2)
}

const getRoomByPlayerId = (playerId: string): room => {
    return rooms.filter((room: room) => room.player_1_id === playerId || room.player_2_id === playerId)[0]
}

const removeRoom = (roomToRemove: room): void => {
    getPlayerById(roomToRemove.player_1_id).connected_to_room = false
    getPlayerById(roomToRemove.player_2_id).connected_to_room = false
    rooms[rooms.indexOf(roomToRemove)] = rooms[rooms.length - 1]
    rooms.pop()
}
