/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , http = require('http')
    , mongoose = require('mongoose')
    , knox = require('knox')
    , fs = require('fs')
    ;


// mongodb
mongoose.connect(process.env.MONGODB_CONNSTR);

console.log(process.env.MONGODB_CONNSTR);

// define schema
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var MapSchema = new Schema({
    'id':ObjectId,
    'name':{ type:String, index:true, default:'hi sb' },
    'imageData':String,
    'columns':{type:Number, default:19},
    'rows':{type:Number, default:19},
    'top':{type:Number, default:0},
    'left':{type:Number, default:0},
    'bottom':{type:Number, default:0},
    'right':{type:Number, default:0},
    'imageWidth':{type:Number, default:497},
    'imageHeight':{type:Number, default:386}
});

var MapModel = mongoose.model('Map', MapSchema);

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(require('stylus').middleware(__dirname + '/public'));
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

app.get('/', routes.index);


// API routes
app.get('/api', function (req, res) {
    res.send('API is running');
});

app.get('/api/maps', function (req, res) {
    console.log('api/maps called');
    MapModel.find(function (err, maps) {
        if (!err) {
            console.log('some maps found???');
            return res.send(maps);
        } else {
            return console.log(err);
        }
    });
});

app.post('/api/maps', function (req, res, next) {
    var map;

    // cache props
    var name = req.body.name;
    var imageWidth = req.body.imageWidth;
    var imageHeight = req.body.imageHeight;

    map = new MapModel({
        name:name,
        imageName:req.body.imageName,
        imageWidth:imageWidth,
        imageHeight:imageHeight
    });
    map.save(function (err) {
        if (!err) {
            return res.send(map);
        } else {
            return console.log(err);
        }
    });
});

app.post('/api/uploadmapimage', function (req, res, next) {
    var map;
    var imageFile = req.files.image;
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
});

app.get('/api/maps/:id', function (req, res) {
    console.log("finding map by id: " + req.params.id);
    return MapModel.findById(req.params.id, function (err, map) {
        if (!err) {
            return res.send(map);
        } else {
            return console.log(err);
        }
    });
});

app.put('/api/maps/:id', function (req, res) {
    return MapModel.findById(req.params.id, function (err, map) {
        product.title = req.body.title;
        product.description = req.body.description;
        product.style = req.body.style;
        return map.save(function (err) {
            if (!err) {
                console.log("updated");
            } else {
                console.log(err);
            }
            return res.send(map);
        });
    });
});

app.delete('/api/maps/:id', function (req, res) {
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
});


app.get('/api/test', function (req, res) {

    var client = knox.createClient({
        key:process.env.AWS_ACCESS_KEY, secret:process.env.AWS_SECRET_ACCESS_KEY, bucket:'itworks.ec'
    });
    fs.readFile('Readme.md', function (err, buf) {
        var req = client.put('/test/Readme.md', {
            'Content-Length':buf.length, 'Content-Type':'text/plain'
        });
        req.on('response', function (res) {
            if (200 == res.statusCode) {
                console.log('saved to %s', req.url);
            }
        });
        req.end(buf);
    });
});


var port = process.env.PORT || 5000;
http.createServer(app).listen(port, function () {
    console.log("Express server listening on port " + app.get('port'));
});

