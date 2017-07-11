var path = require('path');
//一个常见的Webpack配置文件
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    devtool: "eval-source-map",
    entry: {
        main: __dirname + "/app/main.js", //唯一入口文件
        vendor: ['moment']
    },
    output: {
        path: __dirname + '/public', // 打包后的文件存放的地方
        filename: "[name].[hash].js", //打包以后输出的文件名
        chunkFilename: "[name].[hash].js"
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
            use: [
                'style-loader', {
                    loader: 'css-loader',
                    options: {
                        modules: true, // 设置css模块化,详情参考https://github.com/css-modules/css-modules
                        minimize: true
                    }
                }, {
                    loader: 'postcss-loader',
                    // 在这里进行配置，也可以在postcss.config.js中进行配置，详情参考https://github.com/postcss/postcss-loader
                    options: {
                        plugins: function() {
                            return [
                                require('autoprefixer')
                            ];
                        }
                    }
                }, {
                    loader: ExtractTextPlugin.extract("style-loader", "css-loader")
                }
            ]
        }]
    },
    plugins: [
        new ExtractTextPlugin("css/[name].css"),
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
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false,
            }
        }),
        //通过计算模块出现次数来分配模块。这个经常被使用可以较快地获得模块。这使得模块可以预读，建议这样可以减少总文件大小。
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            names: ["vendor", "manifest"] // vendor libs + extracted manifest
        }),
        new HtmlWebpackPlugin({
            template: __dirname + "/app/index.tmpl.html" //new 一个这个插件的实例，并传入相关的参数
        }),
        new webpack.HotModuleReplacementPlugin() //热加载插件

    ]
};