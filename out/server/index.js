"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
require("dotenv/config");
var express_1 = __importDefault(require("express"));
var app = (0, express_1["default"])();
var port = process.env.PORT || process.env.DEV_PORT;
app.get('/', function (req, res) {
    res.status(200).send("XDD peter");
});
var server = app.listen(port, function () {
    console.log("Listening on PORT ".concat(port));
});
var io = require("socket.io")(server);
io.on("connection", function (socket) {
    console.log(socket.id);
});
