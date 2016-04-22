/*约定大于配置*/
/*
    src目录下 html目录及其中的文件名字与js一一对应
    保证一个html文件对应一个js入口文件
 */
//工具
var util = require('./util');
/*
html-webpack-plugin插件，重中之重，webpack中生成HTML的插件，
具体可以去这里查看https://www.npmjs.com/package/html-webpack-plugin
 */
var HtmlWebpackPlugin = require('html-webpack-plugin');

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var appConfig = require('./shark-deploy-conf');
var path = require('path');
var webpack = require('webpack');
var glob = require('glob');
// 引入基本配置
var webpackConfig = require('./webpack.config');

webpackConfig.output.publicPath = 'http://localhost:8080/';

//添加loader
webpackConfig.module.loaders = webpackConfig.module.loaders.concat({
    test: /\.css$/,
    //配置css的抽取器、加载器。'-loader'可以省去
    loaders: ['style-loader', 'css-loader'] 
},{
    test: /\.scss$/,
    //配置scss的抽取器、加载器。'-loader'可以省去
    loaders: ["style", "css", "sass"]
});

//添加插件
webpackConfig.plugins = webpackConfig.plugins.concat([
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    
    // new HtmlWebpackPlugin({
    //     filename: 'app/index/index.html',
    //     template: path.resolve(__dirname, '../app/index/index.html'),
    //     inject: true
    // })
]);

// var devClient = 'webpack-hot-middleware/client';
var devClient = './dev-client';
Object.keys(webpackConfig.entry).forEach(function (name, i) {
    var extras = [devClient]
    webpackConfig.entry[name] = extras.concat(webpackConfig.entry[name])
})


module.exports = webpackConfig;






