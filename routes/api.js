var
    knox = require('knox')
    , fs = require('fs')
    , MapModel = require('../models/map')
    , LocationModel = require('../models/location')
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


var mapFormToLocation = function (form, obj) {

    if (form.name) {
        obj.name = form.name;
    }
    if (form.description) {
        obj.imageName = form.description;
    }
    if (form.mapId) {
        obj.mapId = form.mapId;
    }
    if (form.node){
        obj.node = form.node;
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
                throw err;
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
                throw err;
            }
        });
    },

    getMapById:function (req, res) {
        return MapModel.findById(req.params.id, function (err, map) {
            if (!err) {
                return res.send(map);
            } else {
                throw err;
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
                    throw err;
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
                    throw err;
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
    },

    locations : function(req, res, next) {
        LocationModel.find(function (err, maps) {
            if (!err) {
                return res.send(maps);
            } else {
                throw err;
            }
        });
    },

    createLocation : function(req, res, next) {
        var location = new LocationModel();
        mapFormToLocation(req.body, location);
        location.name = req.body.name;
        location.description = req.body.description;
        location.mapId = req.body.mapId;
        location.node = req.body.node;
        location.save(function (err) {
            if (!err) {
                return res.send(location);
            } else {
                throw err;
            }
        });
    },

    deleteLocation : function(req, res) {
        return LocationModel.findById(req.params.id, function (err, entry) {
            return entry.remove(function (err) {
                if (!err) {
                    console.log("removed");
                    return res.send('');
                } else {
                    throw err;
                }
            });
        });
    },

    updateLocation:function (req, res) {
        return LocationModel.findById(req.params.id, function (err, location) {
            mapFormToLocation(req.body, location);
            return location.save(function (err) {
                if (!err) {
                    console.log("updated");
                } else {
                    throw err;
                }
                return res.send(location);
            });
        });
    },
}
