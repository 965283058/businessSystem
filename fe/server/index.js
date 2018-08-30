const path = require('path')
const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware")
const config = require('../build/webpack.dev.conf.js')
const DashboardPlugin = require('webpack-dashboard/plugin');
const proxy = require('http-proxy-middleware')
const chalk=require("chalk")


let app = new express();
let port, serverConfig

serverConfig = Object.assign({}, {
    port: 8080
}, config.server)

config.devServer = config.devServer || {}
config.devServer.publicPath = config.output.publicPath
config.devServer.hot = true

port = process.argv[2] || serverConfig.port
config.entry.unshift('webpack-hot-middleware/client')

app.use(config.server.path, proxy(config.server.proxy.path, config.server.proxy.options));
delete config.server
let compiler = webpack(config)

// compiler.apply(new DashboardPlugin());//性能监视

app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath || '',
    quiet: false,
    hot: true,
    noInfo: true,
    lazy: false,
    index: 'index.html',
    stats: {
        colors: true
    }
}))

app.use(webpackHotMiddleware(compiler));


app.use(function (req, res, next) {
    let url = path.join(compiler.outputPath, 'index.html')
    if (req.path.indexOf(".") > 0) {
        url = path.join(compiler.outputPath, req.path)
    }
    compiler.outputFileSystem.readFile(url, function (err, result) {
        if (err) {
            return res.end(JSON.stringify(err))
        }
        res.end(result)
    })
})


app.listen(port, function (err) {
    if (err) {
        return console.log(err)
    }
    console.log(chalk.red(' # Access URL:'))
    console.log(chalk.gray(' ----------------------------------------'))
    console.log('     Local: ' + chalk.green(`http://localhost:${port}`))
    console.log(chalk.gray(' ----------------------------------------'))
    console.log('')
})
