const path = require("path")
const fs = require("fs");
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const nodeModules = {};
fs.readdirSync("node_modules")
    .filter(function (x) {
        return [".bin"].indexOf(x) === -1;
    })
    .forEach(function (mod) {
        nodeModules[mod] = "commonjs " + mod;
    });
module.exports = {
    mode: 'development',
    entry: './server/app.js',
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "SysServer.js",
        chunkFilename: "[name].chunk.js",
        libraryTarget: "commonjs"
    },
    node: {
        fs: 'empty',
        child_process: 'empty',
        tls: 'empty',
        net: 'empty'
    },
    plugins: [
        new CleanWebpackPlugin()
    ],
    target: "node",
    externals: nodeModules,
};