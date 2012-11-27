var passport = require('passport');

var
    home = require('./routes/home'),
    admin = require('./routes/admin'),
    test = require('./routes/test'),
    api = require('./routes/api'),
    MongoRest = require('mongo-rest'),
    restify = require('./libs/restify')
    ;

function ensureAuthenticated(req, res, next) {

    // no auth if running locally
    if (!process.env['heroku']){
        return next();
    }

    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

var dummyWrapper = function(req, res, next) {
    return next();
}

module.exports = function (app) {

    // home
    app.get('/', home.index);
    app.get('/about', home.about);
    app.get('/tests', home.specRunner);

    app.get('/login', home.login);
    app.post('/login', passport.authenticate('local',
        {
            successRedirect:'/admin',
            failureRedirect:'/login'
        })
    );
    app.get('/logout', home.logout);

    // admin
    app.get('/admin', ensureAuthenticated, admin.index);
    app.get('/admin/localSetup', ensureAuthenticated, admin.localSetup);
    app.post('/admin/localSetup', ensureAuthenticated, admin.localSetupPost);
    app.get('/admin/localSetupSuccess', ensureAuthenticated, admin.localSetupSuccess);

    // api - maps
    app.get('/api', ensureAuthenticated, api.api);

    app.post('/api/uploadmapimage', ensureAuthenticated, api.uploadImage);
    app.post('/api/uploadmapiconimage', ensureAuthenticated, api.uploadMapIconImage);

    // app models
    restify(app, dummyWrapper, 'maps', require('./models/map'));
    restify(app, dummyWrapper, 'locations', require('./models/location'));
    restify(app, dummyWrapper, 'tunnels', require('./models/tunnel'));
    restify(app, dummyWrapper, 'services', require('./models/service'));
    restify(app, dummyWrapper, 'doctors', require('./models/doctor'));

    // tests
    app.get('/test/1', test.test1);

    // mongo-rest
    var mongoRest = new MongoRest(app, {
        viewPath:'admin/resources/',
        collectionViewTemplate:'resources/{{pluralName}}',
        entityViewTemplate:'resources/{{singularName}}'
    });

    // resource based url's
    mongoRest.addResource('user', require('./models/user'));
}
