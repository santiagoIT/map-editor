var
    knox = require('knox'),
    fs = require('fs'),
    MapModel = require('../models/map'),
    LocationModel = require('../models/location'),
    extend = require('xtend'),
    async = require('async'),
    imageUploader = require('../libs/imageUploader')
    ;

module.exports = {

    api:function (req, res) {
        res.send('API is running');
    },

    uploadImage:function (req, res, next) {

        imageUploader.processImages(req, function(error, response){
           if (error){
               return res.send(err);
           }
           else {
               return res.send(response);
           }
        });
    }
}
