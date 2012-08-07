var
    knox = require('knox')
    , fs = require('fs')
    , MapModel = require('../models/map')
    , LocationModel = require('../models/location')
    , extend = require('xtend')
    ;

module.exports = {

    api:function (req, res) {
        res.send('API is running');
    },

    uploadImage:function (req, res, next) {
        var map,
            imageFile = req.files.image;
        console.log(imageFile);
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
                    return res.json({imagename:imageFile.name});
                }

                return res.send({err:'failed!!'});
            });
            reqAWS.end(buf);
        });
    }
}
