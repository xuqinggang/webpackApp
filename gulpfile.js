'use strict';

// 配置
var appConfig = require('./shark-deploy-conf.json');

var express = require('express');
var webpack = require('webpack');
var gulp = require('gulp')

var openurl = require('openurl');
var path = require('path');
var fs = require('fs');
var exec = require('sync-exec');
//
var webAppDir = appConfig.webApp;
var htmlPath = appConfig.htmlPath;

//生产环境 或者 执行npm run build
gulp.task('build', function() {
    var prodConfigName =  'webpack.prod.conf.js';
    exec('webpack --display-modules --display-chunks --config ' + prodConfigName);
    // var config = require('./webpack.prod.conf');
    // webpack(config)
});

// 开发环境
gulp.task('develop', function() {
    var config = require('./webpack.dev.conf');
    // 创建一个express实例
    var app = express()
    console.log('!!!!!!!', config.plugins);
    // 调用webpack并把配置传递过去
    var compiler = webpack(config)

    // 使用 webpack-dev-middleware 中间件
    var devMiddleware = require('webpack-dev-middleware')(compiler, {
        publicPath: config.output.publicPath,
        stats: {
            colors: true,   
            chunks: false
        }
    })

    // 使用 webpack-hot-middleware 中间件
    var hotMiddleware = require('webpack-hot-middleware')(compiler)
    // webpack插件，监听html文件改变事件
    compiler.plugin('compilation', function (compilation) {
        compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
            // 发布事件
            hotMiddleware.publish({ action: 'reload' })
            cb()
        })
    })
    // 注册中间件
    app.use(devMiddleware)
    // 注册中间件
    app.use(hotMiddleware)


    // app.use(appConfig.contextPath, headerStatic(path.join(webAppDir, htmlPath), {}));
    // 监听 8888端口，开启服务器
    // app.listen(8888, function (err) {
    //     if (err) {
    //         console.log(err)
    //         return
    //     }
    //     console.log('Listening at http://localhost:8888')
    // });
    app.listen(8080, function() {
            if(appConfig.openurl) {
                openurl.open(appConfig.openurl);
            }
            console.log('socketio listen 8080')
    });

})

//模拟静态资源请求
// function headerStatic(staticPath, headers) {
//     return function(req, res, next) {
//         var reqPath = req.path,
//             reqFullPath = path.join(staticPath, reqPath);
//         if(fs.existsSync(reqFullPath)) {
//             //设置配置的响应头
//             for(var h in headers) {
//                 res.set(h, headers[h]);
//             }

//             if(/\.html$/.test(reqPath)) {
//                 res.set('Content-Type', 'text/html');
//                 res.send((fs.readFileSync(reqFullPath, 'UTF-8')));
//             }else {
//                 if(/\.js$/.test(reqPath)) {
//                     res.set('Content-Type', 'text/javascript');
//                 }else if(/\.css$/.test(reqPath)) {
//                     res.set('Content-Type', 'text/css');
//                 }
//                 res.send(fs.readFileSync(reqFullPath, 'UTF-8'))
//             }
//         }else {
//             if (reqPath !== '/livereload.js') {
//                 // console.warn('Not Found: ' + f);
//             }
//             next();
//         }
//     }
// }