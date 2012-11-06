var
    knox = require('knox'),
    fs = require('fs'),
    MapModel = require('../models/map'),
    LocationModel = require('../models/location'),
    extend = require('xtend'),
    async = require('async')
    ;

module.exports = {

    api:function (req, res) {
        res.send('API is running');
    },

    uploadImage:function (req, res, next) {

        var arFiles = new Array();
        for(var fieldName in req.files) {
            var entry = req.files[fieldName];
            arFiles.push({fieldName:fieldName, name:entry.name, type: entry.type, path:entry.path});
        }

        var client = knox.createClient({
            key:process.env.AWS_ACCESS_KEY,
            secret:process.env.AWS_SECRET_ACCESS_KEY,
            bucket:'itworks.ec'
        });

        var
            statusCode = 200,
            response = {};

        async.forEach(arFiles, function(item, callback){

            fs.readFile(item.path, function (err, buf) {

                // TODO: create a conflict-free file name
                var reqAWS = client.put('/mapeditor/images/' + item.name, {
                    'Content-Length':buf.length,
                    'Content-Type':item.type
                });
                reqAWS.on('response', function (resAWS) {

                    statusCode = resAWS.statusCode;
                    if (200 == resAWS.statusCode) {
                        response[item.fieldName] = item.name;
                    }
                    else {
                        callback({error:'Error ocurred'});
                        return;
                    }
                    callback();
                });
                reqAWS.end(buf);
            });

        }, function(err){
            res.statusCode = statusCode;
            if (err) {
                return res.send(err);
            }
            return res.json(response);
        });

/*
        fs.readFile(imageFile.path, function (err, buf) {

            // TODO: create a conflict-free file name
            var reqAWS = client.put('/mapeditor/images/' + imageFile.name, {
                'Content-Length':buf.length,
                'Content-Type':imageFile.type
            });
            reqAWS.on('response', function (resAWS) {

                res.statusCode = resAWS.statusCode;
                if (200 == resAWS.statusCode) {
                    return res.json({imagename:imageFile.name});
                }

                return res.send({err:'failed!!'});
            });
            reqAWS.end(buf);
        });*/
    },

    uploadMapIconImage:function(req,res,next) {
        var map,
            imageFile = req.files.image;
        var client = knox.createClient({
            key:process.env.AWS_ACCESS_KEY,
            secret:process.env.AWS_SECRET_ACCESS_KEY,
            bucket:'itworks.ec'
        });

        fs.readFile(imageFile.path, function (err, buf) {

            // TODO: create a conflict-free file name
            var reqAWS = client.put('/mapeditor/images/' + imageFile.name, {
                'Content-Length':buf.length,
                'Content-Type':imageFile.type
            });
            reqAWS.on('response', function (resAWS) {

                res.statusCode = resAWS.statusCode;
                if (200 == resAWS.statusCode) {
                    return res.json({linkImageName:imageFile.name});
                }

                return res.send({err:'failed!!'});
            });
            reqAWS.end(buf);
        });
    }
}
