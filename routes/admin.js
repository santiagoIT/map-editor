var MapModel = require('../models/map');

// Dependencies
var
    url = require('url'),
    exec = require('child_process').exec,
    fs = require('fs'),
    path = require("path"),
    async = require('async'),
    http = require('http');

// App variables
var S3ROOT = 'https//s3.amazonaws.com/itworks.ec/mapeditor/images/';

// Function to download file
var download_file = function(DOWNLOAD_DIR, file_url, callback) {

    var file_name = url.parse(file_url).pathname.split('/').pop();

    var fullName = path.join(DOWNLOAD_DIR, file_name);
    // if file exists, delete it
    if (fs.existsSync(fullName)){
        var err = fs.unlinkSync(fullName);
        if (err){
            return callback(err);
        }
    }

    var file = fs.createWriteStream(fullName);
    http.get(file_url, function(res) {
        res.on('data', function(data) {
            file.write(data);})
            .on('end', function() {
                console.log('FINISHED: ' + file_url);
                file.end();
                callback();
            })
            .on('error', function(e) {
                console.log("ERROR: " + e.message);
                file.end();
                callback(e);
            });
    })
};

module.exports = {
    index : function(req, res) {
        res.render('admin', { title: 'Map Editor' });
    },

    localSetup : function(req, res) {
        res.render('admin/localSetup', { title: 'Local Server Setup' });
    },

    localSetupPost : function(req, res, next) {

        var
            downloadPath = path.join(process.env.mapEditorRoot, '/public/data/images');
        // make sure directory exists
        if (!fs.existsSync(downloadPath)) {
            fs.mkdirSync(downloadPath);
        }

        // loop through maps
        var arClonedImages = new Array();

        MapModel.find(function (err, entries) {
            if (!err) {
                if (entries && entries.length > 0)
                {
                    async.forEach(entries, function(item, callback){
                        arClonedImages.push(item.imageName);
                        download_file(downloadPath, S3ROOT + item.imageName, callback);
                    }, function(err){
                        console.log(arClonedImages);
                        if (err) {
                            return res.send(err);
                        }
                        res.redirect('/admin/localSetupSuccess');
                    });
                }
            }
            else {
                return next(err);
            }
        });
    },

    localSetupSuccess : function(req, res) {
        res.render('admin/localSetupSuccess', { title: 'Local Server Setup' });
    }
};