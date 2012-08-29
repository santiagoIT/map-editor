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

    // backbone
    dest =  path.join(rootPath, '/public/javascripts/libs/backbone/backbone-min.js');
    source = path.join(rootPath, '/submodules/backbone/backbone-min.js');
    createSymlink(dest, source);

    // underscore
    dest =  path.join(rootPath, '/public/javascripts/libs/underscore/underscore-min.js');
    source = path.join(rootPath, '/submodules/underscore/underscore-min.js');
    createSymlink(dest, source);

    // require-jquery
    dest =  path.join(rootPath, '/public/javascripts/require-jquery.js');
    source = path.join(rootPath, '/submodules/require-jquery/jquery-require-sample/webapp/scripts/require-jquery.js');
    createSymlink(dest, source);

    // pathfinding.js
    dest =  path.join(rootPath, '/public/javascripts/libs/pathfinder/pathfinding-browser.js');
    source = path.join(rootPath, '/submodules/pathfinding/lib/pathfinding-browser.js');
    createSymlink(dest, source);

    //jquery - iframe transport
    dest =  path.join(rootPath, '/public/javascripts/libs/jquery.iframe-transport/jquery.iframe-transport.js');
    source = path.join(rootPath, '/submodules/jquery-iframe-transport/jquery.iframe-transport.js');
    createSymlink(dest, source);
}