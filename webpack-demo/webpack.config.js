var path = require('path');
//一个常见的Webpack配置文件
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    devtool: "cheap-module-eval-source-map",
    entry: {
        main: __dirname + "/app/main.js", //唯一入口文件
        vendor: ['moment']
    },
    output: {
        path: path.join(__dirname, "build"), // 打包后的文件存放的地方
        filename: "[name].entry.js", //打包以后输出的文件名
        chunkFilename: "[name].[hash:8].js"
    },
    resolve: { // resolve 指定可以被 import 的文件后缀
        extensions: ['', '.js', '.jsx']
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
                'babel-loader'
            ]
        }, {
            test: /\.css$/,
            // loader: "style-loader"
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [{
                    loader: 'css-loader',
                    options: {
                        minimize: true
                    }
                }]
            })
        }, {
            test: /\.((woff2?|svg)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff2?|svg|jpe?g|png|gif|ico)$/,
            use: [{
                loader: 'url-loader',
                query: {
                    // 小于10KB的图片会自动转成dataUrl
                    limit: '10240',
                    name: 'img/[hash:8].[name].[ext]'
                }
            }, {
                loader: 'image-webpack-loader',
                query: {
                    bypassOnDebug: true,
                    progressive: true,
                    optimizationLevel: 3,
                    interlaced: false,
                    pngquant: {
                        quality: '65-80',
                        speed: 4
                    }
                }
            }]
        }, {
            test: /\.((ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9]))|(ttf|eot)$/,
            use: [{
                loader: 'url-loader',
                query: {
                    limit: '10000',
                    name: 'fonts/[hash:8].[name].[ext]'
                }
            }]
        }]
    },
    plugins: [
        new ExtractTextPlugin("[name]-[hash:5].min.css"),
        new webpack.LoaderOptionsPlugin({
            options: {
                devServer: {
                    contentBase: './public', //本地服务器所加载的页面所在的目录
                    historyApiFallback: true, //不跳转
                    hot: true,
                    inline: true //实时刷新
                }
            }
        }),
        //压缩混淆js
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false,
            }
        }),
        //通过计算模块出现次数来分配模块。这个经常被使用可以较快地获得模块。这使得模块可以预读，建议这样可以减少总文件大小。
        new webpack.optimize.OccurrenceOrderPlugin(), //为组件分配ID
        new webpack.optimize.CommonsChunkPlugin({
            names: ["vendor", "manifest"] // vendor libs + extracted manifest
        }),
        new HtmlWebpackPlugin({
            template: __dirname + "/app/index.tmpl.html", //new 一个这个插件的实例，并传入相关的参数
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
            inject: 'body',
            filename: 'index.html'
        }),
        new webpack.HotModuleReplacementPlugin(), //热加载插件
        //跳过编译时出错的代码并记录
        new webpack.NoErrorsPlugin()
    ]
};