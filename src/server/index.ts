import "dotenv/config"
import express, {Express, Request, Response} from "express"
import { Socket } from "socket.io"

const app: Express = express()
const port: string = process.env.PORT || process.env.DEV_PORT

app.get('/', (req: Request, res: Response) => {
    res.status(200).send("XDD peter")
})

let server = app.listen(port, () => {
    console.log(`Listening on PORT ${port}`)
})

const io = require("socket.io")(server)

io.on("connection", (socket: Socket) => {
    console.log(socket.id)
})