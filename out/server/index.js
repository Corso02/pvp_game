"use strict";
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
io.on("connection", function (socket) {
    console.log(socket.id);
});
//# sourceMappingURL=index.js.map