var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var path = require('path');
var webpack = require('webpack');

//工具
var util = require('util');

// 引入基本配置
var webpackConfig = require('./webpack.config');

//添加loader
webpackConfig.module.loaders = webpackConfig.module.loaders.concat({
    test: /\.css$/, 
    loader: ExtractTextPlugin.extract("style-loader", "css-loader")
},{
    test: /\.scss/, 
    loader: ExtractTextPlugin.extract("style-loader", "css-loader", 'sass-loader')
});

//添加插件
/*
单独使用link标签加载css并设置路径，相对于output配置中的publickPath
输出资源路径 相对于output配置中的path
 */
webpackConfig.plugins = webpackConfig.plugins.concat([
    // 提取css为单文件
    new ExtractTextPlugin("styles/css/[name].[contenthash:8].css"),
]);
// console.log(webpackConfig.plugins);

module.exports = webpackConfig;
