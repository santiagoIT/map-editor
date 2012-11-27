var
    fs = require('fs'),
    path = require("path"),
    async = require('async'),
    http = require('http'),
    MapModel = require('../models/map'),
    DoctorModel = require('../models/doctor'),
    ServiceModel = require('../models/service');

var
    S3ROOT = 'http://s3.amazonaws.com/itworks.ec/mapeditor/images/',
    downloadDirectory = 'tmp',
    arAssetList = new Array();

var fnProcessGenericCollection = function(callback, Model, arImageFields) {
    Model.find(function (err, entries) {
        if (err) {
            callback(err);
            return;
        }

        if (!entries ||  entries.length == 0){
            callback();
            return;
        }

        // loop models
        for (var i in entries) {
            var item = entries[i];

            // loop imageFields
            for (var j in arImageFields) {
                var fieldName = arImageFields[j];
                if (item[fieldName]) {
                    arAssetList.push(item[fieldName]);
                }
            }
        }
        callback();
    });
}

// Function to download file
var downloadFile = function(storedPath, callback) {

    // obtain final path and create if it does not exist!
    var fullPath = path.join(downloadDirectory, storedPath);
    var fileUrl = S3ROOT + storedPath;

    // targetDir
    var targetDir = path.dirname(fullPath);
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir);
    }

    console.log('full-path', fullPath);
    console.log('fileUrl', fileUrl);

    // if file exists, delete it
    if (fs.existsSync(fullPath)){
        var err = fs.unlinkSync(fullPath);
        if (err){
            return callback(err);
        }
    }

    var file = fs.createWriteStream(fullPath);
    var request = http.get(fileUrl, function(response) {
        console.log('DOWNLOADED: ' + fileUrl + ' to: ' + fullPath);
        response.pipe(file);
        callback();
    });

/*

    var file = fs.createWriteStream(fullPath);
    http.get(fileUrl, function(res) {
        res.on('data', function(data) {
            file.write(data);})
            .on('end', function() {
                console.log('DOWNLOADED: ' + fileUrl);
                file.end();
                callback();
            })
            .on('error', function(e) {
                console.log("ERROR: " + e.message);
                file.end();
                callback(e);
            });
    })*/
};

var fnProcessMaps = function(callback) {
    fnProcessGenericCollection(callback, MapModel, ['imageName', 'linkImageName']);
}

var fnProcessServices = function(callback) {
    fnProcessGenericCollection(callback, ServiceModel, ['imageUrl']);
}

var fnProcessDoctors = function(callback) {
    fnProcessGenericCollection(callback, DoctorModel, ['imageUrl']);
}

module.exports = {

    downloadAssets : function(mainCallback) {
        // reset
        arAssetList.length = 0;

        // make sure directory exists
        downloadDirectory = path.join(process.env.mapEditorRoot, '/public/data/images');
        if (!fs.existsSync(downloadDirectory)) {
            fs.mkdirSync(downloadDirectory);
        }
        // get list of all used assets
        async.parallel([fnProcessMaps, fnProcessServices, fnProcessDoctors], function(err, results){

            // copy locally
            async.forEach(arAssetList, function(item, callback) {
                downloadFile(item, callback);
            }, function(err){
                mainCallback(err);
            });
        });

    }
}