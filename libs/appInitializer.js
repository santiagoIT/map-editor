var
    fs = require('fs'),
    path = require('path');

var createSymlink = function(dest, source){
    if (!fs.existsSync(dest)) {
        fs.symlinkSync(source, dest);
        console.log('symlink created: ' + dest);
    }
}

module.exports = function (rootPath) {

    var
        dest, source;
    console.log('dirname:');
    console.log(rootPath);

    // bootstrap images
    dest = path.join(rootPath, '/public/img');
    source = path.join(rootPath, '/submodules/bootstrap/img');
    createSymlink(dest, source);

    // bootstrap js
    dest =  path.join(rootPath, '/public/javascripts/bootstrap');
    source = path.join(rootPath, '/submodules/bootstrap/docs/assets/js');
    createSymlink(dest, source);
}