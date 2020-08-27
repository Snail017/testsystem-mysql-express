'use strict';

const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const CompressionWebpackPlugin =require('compression-webpack-plugin')

module.exports = {
    mode: 'production',
    entry: {
        app: './app.js',
    },
    target: 'node',
    output: {
        // path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js']
    },
    externals: _externals(),
    node: {
        console: true,
        global: true,
        process: true,
        Buffer: true,
        __filename: true,
        __dirname: true,
        setImmediate: true
    },
    module: {
        // rules: [
        //     {
        //         test: /\.(js|jsx)$/,
        //         use: 'babel-loader'
        //     }
        // ]
    },

    plugins: [
        new webpack.ProgressPlugin(),
        new CopyPlugin(
            [
                {
                    from: __dirname+'/key',
                    to: __dirname+'/dist/key',
                    toType: 'dir',
                    ignore: [
                        '.DS_Store',
                    ]
                }
            ]
        ),
        
        new CompressionWebpackPlugin({
            // asset: '[path].gz[query]',
            algorithm: 'gzip',
            threshold: 10240,
            minRatio: 0.8
          })
    ],
    optimization: {
        minimize: true//是否压缩代码
    }
};

function _externals() {
    let manifest = require('./package.json');
    let dependencies = manifest.dependencies;
    let externals = {};
    for (let p in dependencies) {
        externals[p] = 'commonjs ' + p;
    }
    return externals;
}