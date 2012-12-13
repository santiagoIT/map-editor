var
    fs = require('fs'),
    path = require("path"),
    async = require('async'),
    http = require('http'),
    MapModel = require('../models/map'),
    DoctorModel = require('../models/doctor'),
    LocationModel = require('../models/location');

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
                    // download only once (could be used multiple times)
                    var remotePath = item[fieldName];
                    if (arAssetList.indexOf(remotePath) == -1) {
                        arAssetList.push(remotePath);
                    }
                    else {
                        console.log('File already downloaded. Skipped. ', remotePath);
                    }
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
};

var fnProcessMaps = function(callback) {
    fnProcessGenericCollection(callback, MapModel, ['imageName', 'linkImageName']);
}

var fnProcessServices = function(callback) {
    fnProcessGenericCollection(callback, LocationModel, ['imageUrl']);
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
            async.forEach(arAssetList, downloadFile, mainCallback);
        });

    }
}