/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , mongoose = require('mongoose')
    , stylus = require('stylus')
    ;

// mongodb
mongoose.connect(process.env.MONGODB_CONNSTR);

console.log(process.env.MONGODB_CONNSTR);

// define schema
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var NodeSchema = new Schema({
    'column':{type:Number, default:0},
    'row':{type:Number, default:0}
});

var MapSchema = new Schema({
    'id':ObjectId,
    'name':{ type:String, index:true, default:'hi sb' },
    'imageName':String,
    'columns':{type:Number, default:1},
    'rows':{type:Number, default:1},
    'top':{type:Number, default:0},
    'left':{type:Number, default:0},
    'bottom':{type:Number, default:0},
    'right':{type:Number, default:0},
    'blockedNodes' : [NodeSchema]
});

var MapModel = mongoose.model('Map', MapSchema);

User = mongoose.model('User', UserSchema);
////////////////////////////////////////////////////////////////////////////
// define application
var app = express();
app.use(express.static(__dirname + '/public'))
    .use(express.favicon())
    .use(express.logger('dev'))
    .use(express.bodyParser())
    .use(express.cookieParser('heysb'))
    .use(express.session())
    .use(mongooseAuth.middleware(app))
    .use(express.methodOverride())
    .use(stylus.middleware(__dirname + '/public'))
    ;

app.configure( function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// Routes
require('./routes')(app, MapModel);

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Express server listening on port " + port);
});
