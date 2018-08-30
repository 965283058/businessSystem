const merge = require("webpack-merge")
const baseConfig = require("./webpack.base.conf")
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const path = require('path')


let config = merge(baseConfig, {
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [{
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                            js: 'babel-loader'
                        },
                        cssModules: {
                            localIdentName: '[path][name]-[local]-[hash:base64:5]',
                            camelCase: true
                        },
                        postcss: [
                            autoprefixer({browsers: ['last 7 versions']})
                        ]
                    }
                }]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [{
                    loader: "babel-loader",
                }]
            },
            {
                test: /\.css$/,
                use: [
                    {loader: 'style-loader'},
                    {
                        loader: 'css-loader',
                        options: {
                            modules: false
                        }
                    }]
            },
            {
                test: /\.(jpe?g|png|bmp|gif)$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        limit: 1,
                        name: 'images/[name].[hash:7].[ext]'
                    }
                }],
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
                'NODE_ENV': '"dev"',
                'ROUTER_ROOT': "''",
                'API_ROOT': "'/api'"
            }
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new AddAssetHtmlPlugin({
            filepath: path.join(process.cwd(), 'build/dll', 'base.dll.js'),
            includeSourcemap: false
        }),
        new webpack.DllReferencePlugin({
            context: process.cwd(),
            manifest: require(path.join(process.cwd(), 'build/dll', 'manifest.json')),
        })
    ],
    server: {
        port:9999,
        path: '/api/*',
        proxy: {
            path: '/api',
            options: {target: 'http://127.0.0.1:7001', changeOrigin: true}
        }
    }
})
module.exports = config