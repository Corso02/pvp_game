import "dotenv/config"
import express, {Express, Request, Response} from "express"
import { Socket } from "socket.io"
import path = require("path")

const app: Express = express()
const port: string = process.env.PORT || process.env.DEV_PORT

app.get('/', (req: Request, res: Response) => {
    res.status(200).sendFile(path.resolve("./views/index.html"))
})

app.use(express.static(path.resolve("./static")))

let server = app.listen(port, () => {
    console.log(`Listening on PORT ${port}`)
})

const io = require("socket.io")(server)

io.on("connection", (socket: Socket) => {
    console.log(socket.id)
})