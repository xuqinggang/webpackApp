//配置
var appConfig = require('./shark-deploy-conf');

var path = require('path');
//工具
var util = require('./util');

/*
extract-text-webpack-plugin插件，
有了它就可以将你的样式提取到单独的css文件里，
妈妈再也不用担心样式会被打包到js文件里了。
 */
var ExtractTextPlugin = require('extract-text-webpack-plugin');

/*
html-webpack-plugin插件，重中之重，webpack中生成HTML的插件，
具体可以去这里查看https://www.npmjs.com/package/html-webpack-plugin
 */
var HtmlWebpackPlugin = require('html-webpack-plugin');

//配置参数

/*
entry：入口，可以是一个或者多个资源合并而成，由html通过script标签引入
chunk：被entry所依赖的额外的代码块，同样可以包含一个或者多个文件
 */
var webpackConfig = {
    // 入口文件，path.resolve()方法，可以结合我们给定的两个参数最后生成绝对路径，最终指向的就是我们的index.js文件
    entry: {
        // index: ['./src/app/LivePublisher-web/js/module/index.js'],
        // test3: ['./src/app/LivePublisher-web/js/module/test3.js'],
        // vendors: [
        //     // 'Vue'
        // ]
    },
    /*
         { index: [ './src/app/LivePublisher-web/js/module/index.js' ],
  test3: [ './src/app/LivePublisher-web/js/module/test3.js' ] }

     */
    // 输出配置
    output: {
        // 静态资源的输出路径 'build/static/LivePublisher-web'
        path: path.resolve(__dirname, appConfig.buildWebAppStatic),
        //模板、样式、脚本、图片等资源对应的server上的路径
        publicPath: appConfig.publicPath,
        //每个页面对应的主js的生成配置
        filename: 'js'+ '/' +'[name].[hash:8].js',
        ////The filename of non-entry chunks as relative path inside the output.path directory.
        chunkFilename: '[id].[chunkhash].js'
    },
    resolve: {
        extensions: ['', '.js']
    },
/**
 * loaders
 * css-loader和styleloader，前者负责将CSS文件变成文本返回，并处理其中
 * 的url()和@import()，而后者将CSS以style标签的形式插入到页面中去
 */
    module: {
        
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel?presets=es2015',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        // new ExtractTextPlugin('css/[name].css'),
         //单独使用link标签加载css并设置路径，相对于output配置中的publickPath单独使用link标签加载css并设置路径，相对于output配置中的publickPath
        // new HtmlWebpackPlugin({
        //     filename: 'app/index/index.html',
        //     template: path.resolve(__dirname, './app/index/index.html'),
        //     inject: true
        // })
    ]
}

/*添加多个文件对应的htmlWebpackPlugin*/
var htmlDir = path.join(appConfig.webApp, appConfig.htmlPath);
var pages = Object.keys(util.getEntry( path.join(htmlDir, '/**/*.html'), path.join(htmlDir, '/')));
// var pages = Object.keys(getEntry( 'app/index'+'/**/*.html', 'app/index' + '/'));
pages.forEach(function(pathname) {
    var conf = {
        //favicon路径，通过webpack引入同时可以生成hash值
        // favicon: './src/img/favicon.ico',
        //生成的html存放路径，相对于path
        filename: 'html'+ '/' + pathname + '.html',
        //html模板路径 src/app/LivePublisher-web/html
        template: htmlDir +'/' + pathname + '.html', 
        inject: true, //js插入的位置，true/'head'/'body'/false
        // hash: true, //为静态资源生成hash值
        chunks: [pathname] //需要引入的chunk，不配置就会引入所有页面的资源(html与入口js文件一一对应)
        // minify: { //压缩HTML文件    
        //     removeComments: true, //移除HTML中的注释
        //     collapseWhitespace: false //删除空白符与换行符
        // }
    };
    webpackConfig.plugins.push(new HtmlWebpackPlugin(conf));
});

/*添加多个html文件分别对应的入口文件(规定一个html对应一个js入口文件)*/
var entryJSDir = path.join(appConfig.webApp, appConfig.entryJSPath);
var entries = util.getEntry(path.join(entryJSDir, '/**/*.js'), path.join(entryJSDir, '/'));
webpackConfig.entry = entries;


module.exports =  webpackConfig;