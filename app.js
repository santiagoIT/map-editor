/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , mongoose = require('mongoose')
    , stylus = require('stylus')
    ;

var API = require('./routes/api');

// mongodb
mongoose.connect(process.env.MONGODB_CONNSTR);

console.log(process.env.MONGODB_CONNSTR);

////////////////////////////////////////////////////////////////////////////
// define application
var app = express();
app.use(express.static(__dirname + '/public'))
    .use(express.favicon())
    .use(express.logger('dev'))
    .use(express.bodyParser())
    .use(express.cookieParser('heysb'))
    .use(express.session())
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
require('./routes')(app);

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Express server listening on port " + port);
});
