const path = require("path")
const fs = require("fs");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const nodeModules = {};
fs.readdirSync("node_modules")
    .filter(function (x) {
        return [".bin"].indexOf(x) === -1;
    })
    .forEach(function (mod) {
        nodeModules[mod] = "commonjs " + mod;
    });
module.exports = {
    mode: 'production',
    entry: './server/app.js',
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "SysServer.js",
    },
    devtool: 'inline-source-map',
    node: {
        fs: 'empty',
        child_process: 'empty',
        tls: 'empty',
        net: 'empty',
        __dirname: false
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin([
            {
                from: __dirname + '/key/',
                to: __dirname + "/dist/key/",
                toType: 'dir',
                force: true,
                ignore: ['.*']
            }
        ])
    ],
    target: "node",
    externals: nodeModules,
};