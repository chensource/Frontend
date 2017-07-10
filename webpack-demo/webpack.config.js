var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/scripts/index.js',
    vendor: ['react', 'react-dom'],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, "dist")
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Output Management',
            favicon: '../src/images/favicon.ico'
        })
    ]
};