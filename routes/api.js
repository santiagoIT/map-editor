var
    knox = require('knox')
    , fs = require('fs')
    , MapModel = require('../models/map')
    ;

var mapFormToModel = function (form, map) {
    if (form.name) {
        map.name = form.name;
    }
    if (form.imageName) {
        map.imageName = form.imageName;
    }
    if (form.columns) {
        map.columns = form.columns;
    }
    if (form.rows) {
        map.rows = form.rows;
    }
    if (form.top) {
        map.top = form.top;
    }
    if (form.left) {
        map.left = form.left;
    }
    if (form.bottom) {
        map.bottom = form.bottom;
    }
    if (form.right) {
        map.right = form.right;
    }
    if (form.blockedNodes) {
        map.blockedNodes = form.blockedNodes;
    }
}

module.exports = {

    api:function (req, res) {
        res.send('API is running');
    },

    getMaps:function (req, res) {

        MapModel.find(function (err, maps) {
            if (!err) {
                return res.send(maps);
            } else {
                return console.log(err);
            }
        });
    },

    postMap:function (req, res, next) {
        var map;

        map = new MapModel();
        mapFormToModel(req.body, map);
        map.save(function (err) {
            if (!err) {
                return res.send(map);
            } else {
                return console.log(err);
            }
        });
    },

    getMapById:function (req, res) {
        console.log("finding map by id: " + req.params.id);
        return MapModel.findById(req.params.id, function (err, map) {
            if (!err) {
                return res.send(map);
            } else {
                return console.log(err);
            }
        });
    },

    updateMap:function (req, res) {
        return MapModel.findById(req.params.id, function (err, map) {
            mapFormToModel(req.body, map);
            return map.save(function (err) {
                if (!err) {
                    console.log("updated");
                } else {
                    console.log(err);
                }
                return res.send(map);
            });
        });
    },

    deleteMap:function (req, res) {
        return MapModel.findById(req.params.id, function (err, map) {
            return map.remove(function (err) {
                if (!err) {
                    console.log("removed");
                    return res.send('');
                } else {
                    console.log(err);
                }
            });
        });
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


console.log('MAP MODEL - in api.js - END');
console.log(MapModel);



