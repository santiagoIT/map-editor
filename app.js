/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , stylus = require('stylus')
    , passport = require('passport')
    , herokuShim = require('./herokuShim')
    , appInitializer = require('./libs/appInitializer')
    ;

// mock heroku environment if we are running locally
herokuShim.setupEnvironment(__dirname + '/.env');

// set root folder name
process.env.mapEditorRoot = __dirname;
console.log('process.env.mapEditorRoot: ' + process.env.mapEditorRoot);

// mongodb
var DB = require('./datastore');
DB.startup(process.env.MONGODB_CONNSTR);

////////////////////////////////////////////////////////////////////////////
// define application
var app = express();
app.use(express.static(__dirname + '/public'))
    .use(express.favicon())
    .use(express.logger('dev'))
    .use(express.bodyParser())
    .use(express.methodOverride())
    .use(stylus.middleware(__dirname + '/public'))
    .use(express.cookieParser())
    .use(express.session({
        secret: 'heysb'
        }, function() {
        app.use(app.router);
    }))
    .use(passport.initialize())
    .use(passport.session())
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
require('./routes')(app);

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

// create submodule symlinks
appInitializer(__dirname);


var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Express server listening on port " + port);
});
