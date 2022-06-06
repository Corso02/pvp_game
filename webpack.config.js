const path = require("path")

module.exports = {
    mode: "development",
    entry: ["./out/client/game", "./out/client"],
    output: {
        library: "GlobalAccess",
        libraryTarget: "umd",
        filename: "[name].js",
        path: path.resolve(__dirname, "static")
    },
    /* optimization: {
        runtimeChunk: {
            name: entrypoint => `wbpack-${entrypoint.name}`
        }
    } */
}