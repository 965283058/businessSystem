const path = require('path')
const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware")
const config = require('../build/webpack.dev.conf.js')
const DashboardPlugin = require('webpack-dashboard/plugin');
var proxy = require('http-proxy-middleware')

//webpack-dashboard --
let app = new express();
let port, serverConfig

serverConfig = Object.assign({}, {
    port: 9999
}, config.server)

config.devServer = config.devServer || {}
config.devServer.publicPath = config.output.publicPath
config.devServer.hot = true

port = process.argv[2] || serverConfig.port
config.entry.unshift('webpack-hot-middleware/client')
let compiler = webpack(config)
compiler.apply(new DashboardPlugin());

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

app.use('/api/*', proxy('/api', {target: 'http://127.0.0.1:7001', changeOrigin: true}));

app.use(function (req, res, next) {
    var url = path.join(compiler.outputPath, 'index.html')
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
    console.log(`http://localhost:${port}`)
})
