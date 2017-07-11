var path = require('path');
//一个常见的Webpack配置文件
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: "eval-source-map",
    entry: __dirname + "/app/main.js", //唯一入口文件
    output: {
        path: __dirname + "/public", // 打包后的文件存放的地方
        filename: "bundle.js" //打包以后输出的文件名
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }, {
            test: /\.css$/,
            // loader: "style-loader"
            loader: 'style-loader!css-loader?modules'
        }]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            options: {
                devServer: {
                    contentBase: './public', //本地服务器所加载的页面所在的目录
                    historyApiFallback: true, //不跳转
                    inline: true //实时刷新
                }
            }
        }),
        new HtmlWebpackPlugin({
            template: __dirname + "/app/index.tmpl.html" //new 一个这个插件的实例，并传入相关的参数
        }),
        new webpack.HotModuleReplacementPlugin() //热加载插件

    ]
};