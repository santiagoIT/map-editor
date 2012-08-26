var MapModel = require('../models/map');

// Dependencies
var
    url = require('url'),
    exec = require('child_process').exec,
    fs = require('fs'),
    path = require("path"),
    http = require('http');

// App variables
var S3ROOT = 'https://s3.amazonaws.com/itworks.ec/mapeditor/images/';

// Function to download file
var download_file = function(DOWNLOAD_DIR, file_url) {


    var options = {
        host: url.parse(file_url).host,
        port: 8080,
        path: url.parse(file_url).pathname
    };

    var file_name = url.parse(file_url).pathname.split('/').pop();

    var fullName = path.join(DOWNLOAD_DIR, file_name);
    // if file exists, delete it
    if (fs.existsSync(fullName)){
        if (!fs.unlinkSync(fullName)){
            throw new Error('Failed to delete: ' + fullName);
        }
    }

    var file = fs.createWriteStream(fullName);

    http.get(options, function(res) {
        res.on('data', function(data) {
            file.write(data);
        }).on('end', function() {
                file.end();
            });
    });
};

module.exports = {
    index : function(req, res) {
        res.render('admin', { title: 'Map Editor' });
    },

    localSetup : function(req, res) {
        res.render('admin/localSetup', { title: 'Local Server Setup' });
    },

    localSetupPost : function(req, res) {

        var
            downloadPath = path.join(process.cwd(), '/public/data/images');
        // make sure directory exists
        var exists = fs.existsSync(downloadPath);
        if (!exists){
            fs.mkdirSync(downloadPath);
        }

        // loop through maps
        MapModel.find(function (err, entries) {
            if (!err) {

                for(var i in entries){
                    var map = entries[i];
                    download_file(downloadPath, S3ROOT + map.imageName);
                }
            } else {
                throw err;
            }
        });
        // foreach map download image

        res.render('localSetup', { title: 'Local Server Setup' });
    }
};