const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const autoprefixer = require('autoprefixer')


module.exports = {
    context: process.cwd(), //全局上下文的起始目录
    entry: ['./src/entry.js'],
    output: {
        path: path.resolve(process.cwd(), "dist"),//输出的文件
        filename: "js/[name].[hash:7].js",//输出的文件名
        publicPath: '/'//公共路径
    },
    resolve: {
        extensions: [".js", ".vue", ".css", ".html", ".json"],//自动查询的后缀名
        alias: {//全局引用快捷变量
            vue: path.resolve(process.cwd(), 'node_modules/vue/dist/vue.runtime.common.js'),
            apis: path.resolve(process.cwd(), 'src/apis'),
            pages: path.resolve(process.cwd(), 'src/pages'),
            components: path.resolve(process.cwd(), 'src/components'),
            utils: path.resolve(process.cwd(), 'src/utils')
        }
    },
    plugins: [
        new HtmlWebpackPlugin({template: "index.html"})
    ]
}