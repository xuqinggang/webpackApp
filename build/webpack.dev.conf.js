var HtmlWebpackPlugin = require('html-webpack-plugin')
var path = require('path');
var webpack = require('webpack');
var glob = require('glob');
// 引入基本配置
var config = require('./webpack.config');

config.output.publicPath = 'http://localhost:8888/';

config.plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    // new HtmlWebpackPlugin({
    //     filename: 'app/index/index.html',
    //     template: path.resolve(__dirname, '../app/index/index.html'),
    //     inject: true
    // })
];

// var devClient = 'webpack-hot-middleware/client';
var devClient = './build/dev-client';
Object.keys(config.entry).forEach(function (name, i) {
    var extras = [devClient]
    config.entry[name] = extras.concat(config.entry[name])
})
console.log(config.entry);
module.exports = config;

var pages = Object.keys(getEntry( 'app/index'+'/**/*.html', 'app/index' + '/'));
pages.forEach(function(pathname) {
    var conf = {
        filename: 'app/index'+ '/' + pathname + '.html', //生成的html存放路径，相对于path
        template: 'app/index/' + pathname + '.html', //html模板路径
        inject: true,    //js插入的位置，true/'head'/'body'/false

    };
    config.plugins.push(new HtmlWebpackPlugin(conf));
    console.log(config.plugins);
});

function getEntry(globPath, pathDir) {
    var files = glob.sync(globPath);
    var entries = {},
        entry, dirname, basename, pathname, extname;

    for (var i = 0; i < files.length; i++) {
        entry = files[i];
        dirname = path.dirname(entry);
        extname = path.extname(entry);
        basename = path.basename(entry, extname);
        // pathname = path.join(dirname, basename);
        pathname = path.join(dirname, basename).replace(/\\/g, '/');
        pathname = pathDir ? pathname.replace(new RegExp('^' + pathDir), '') : pathname;
        entries[pathname] = ['./' + entry];
    }
    console.log(entries);
    console.log(44);
    return entries;
}