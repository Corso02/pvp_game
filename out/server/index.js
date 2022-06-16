"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
require("dotenv/config");
var express_1 = __importDefault(require("express"));
var path = require("path");
var app = (0, express_1["default"])();
var port = process.env.PORT || process.env.DEV_PORT;
app.get('/', function (req, res) {
    res.status(200).sendFile(path.resolve("./views/index.html"));
});
app.use(express_1["default"].static(path.resolve("./static")));
var server = app.listen(port, function () {
    console.log("Listening on PORT ".concat(port));
});
var io = require("socket.io")(server);
var connectedPlayers = [];
var rooms = [];
io.on("connection", function (socket) {
    console.log(socket.id);
    var new_player = {
        connected_to_room: false,
        id: socket.id
    };
    connectedPlayers.push(new_player);
    console.log(connectedPlayers.length);
    if (connectedPlayers.length % 2 == 0) {
        var new_id = generateRandomString();
        var second_player = getFreePlayer();
        io.emit("secondPlayerConnected", {
            forId: second_player.id
        });
        io.emit("secondPlayerConnected", {
            forId: socket.id
        });
        var new_room = {
            room_id: new_id,
            player_1_id: new_player.id,
            player_2_id: second_player.id
        };
        rooms.push(new_room);
    }
    else
        console.log("wait pls");
    socket.on("movement", function (data) {
        if (getPlayerById(socket.id).connected_to_room) {
            var otherPlayerId = "";
            var playerRoom = getRoomByPlayerId(socket.id);
            otherPlayerId = playerRoom.player_1_id === socket.id ? playerRoom.player_2_id : playerRoom.player_1_id;
            io.emit("playerMovement", __assign({ forId: otherPlayerId }, data));
        }
    });
    socket.on("armRotation", function (data) {
        if (getPlayerById(socket.id).connected_to_room) {
            var otherPlayerId = "";
            var playerRoom = getRoomByPlayerId(socket.id);
            otherPlayerId = playerRoom.player_1_id === socket.id ? playerRoom.player_2_id : playerRoom.player_1_id;
            io.emit("rotateArm", __assign({ forId: otherPlayerId }, data));
        }
    });
    socket.on("disconnect", function () {
        removeRoom(getRoomByPlayerId(socket.id));
        removeElementFromArray(socket.id);
        console.log(rooms);
        console.log(connectedPlayers);
    });
});
//move given element to the end, and remove it
var removeElementFromArray = function (playerId) {
    var playerToRemove = getPlayerById(playerId);
    connectedPlayers[connectedPlayers.indexOf(playerToRemove)] = connectedPlayers[connectedPlayers.length - 1];
    connectedPlayers.pop();
};
var getPlayerById = function (id) {
    return connectedPlayers.filter(function (player) { return player.id === id; })[0];
};
var getFreePlayer = function () {
    return changePlayerState(connectedPlayers.filter(function (player) { return !player.connected_to_room; })[0]);
};
var changePlayerState = function (player) {
    player.connected_to_room = true;
    return player;
};
var generateRandomString = function () {
    return Math.random().toString(36).slice(2);
};
var getRoomByPlayerId = function (playerId) {
    return rooms.filter(function (room) { return room.player_1_id === playerId || room.player_2_id === playerId; })[0];
};
var removeRoom = function (roomToRemove) {
    getPlayerById(roomToRemove.player_1_id).connected_to_room = false;
    getPlayerById(roomToRemove.player_2_id).connected_to_room = false;
    rooms[rooms.indexOf(roomToRemove)] = rooms[rooms.length - 1];
    rooms.pop();
};
//# sourceMappingURL=index.js.map