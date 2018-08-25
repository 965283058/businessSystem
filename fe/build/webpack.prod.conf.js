const merge = require("webpack-merge")
const base = require("./webpack.base.conf")
const webpack = require('webpack')
const path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const autoprefixer = require('autoprefixer')

let config = merge(base, {
    output: {
        path: path.resolve(process.cwd(), "dist"),//输出的文件
        filename: "js/[name].[hash:7].js",//输出的文件名
        publicPath: '/'//公共路径
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    extractCSS: true,
                    js: 'babel-loader',
                    postcss: [
                        autoprefixer({browsers: ['last 7 versions']})
                    ]
                },
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                use: [{
                    loader: "babel-loader",
                }],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                }),
            },
            {
                test: /\.(jpe?g|png|bmp|gif)$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        limit: 1,
                        name: 'images/[name].[hash:7].[ext]'
                    }
                }]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        limit: 1,
                        name: 'font/[name].[hash:7].[ext]'
                    }
                }]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                'NODE_ENV': "'production'",
                'ROUTER_ROOT': "''",
                'API_ROOT': "'/api'"
            }
        }),
       /* new AddAssetHtmlPlugin({
            filepath: path.join(process.cwd(), 'build/dll', 'base.dll.js'),
            includeSourcemap: false
        }),
        new webpack.DllPlugin({
            context: process.cwd(),
            path: path.join(process.cwd(), '/build/dll', "manifest.json"),
            name: "[name]_library",
        }),*/
        new ExtractTextPlugin({
            filename: "css/[name].[contenthash:6].css"
        }),
        new UglifyJSPlugin()
    ]
})


module.exports = config