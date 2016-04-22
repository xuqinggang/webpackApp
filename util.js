var glob = require('glob');
var path = require('path');
/**
 * 返回 **\/* 对应的目录+文件的basename
 * @param  {[type]} globPath ['app/index'+'/**\/*.html']
 * @param  {[type]} pathDir  ['app/index' + '/']
 * @return {[type]}          [**\/*.html]
 */
function getEntry(globPath, pathDir) {
    // console.log(globPath, '!!');
    var files = glob.sync(globPath);
    var entries = {},
        entry, dirname, basename, pathname, extname;

    for (var i = 0; i < files.length; i++) {
        entry = files[i];
        dirname = path.dirname(entry);
        extname = path.extname(entry);
        basename = path.basename(entry, extname);
        pathname = path.join(dirname, basename);
        // console.log(pathname, '00');
        // pathname = path.join(dirname, basename).replace(/\\/g, '/');
        // pathDir.replace(/\\/g), '\\\\')
        pathname = pathDir ? pathname.replace(new RegExp('^' + pathDir.replace(/\\/g, '\\\\')), '') : pathname;
        entries[pathname] = ['./' + entry];
    }
    // console.log(entries);
    // console.log(44);
    return entries;
}

module.exports.getEntry = getEntry;