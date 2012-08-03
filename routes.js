var passport = require('passport');

var
    home = require('./routes/home')
    , test = require('./routes/test')
    , api = require('./routes/api')
    , MongoRest = require('mongo-rest')
    ;

function ensureAuthenticated(req, res, next) {
    // TODO: remove once in production
    return next();
    // END TODO

    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = function (app) {

    // home
    app.get('/', ensureAuthenticated, home.index);
    app.get('/about', home.about);

    app.get('/login', home.login);
    app.post('/login', passport.authenticate('local',
        {
            successRedirect: '/',
            failureRedirect: '/login'
        })
    );
    app.get('/logout', home.logout);

    // api - maps
    app.get('/api', ensureAuthenticated, api.api);
    app.get('/api/maps', ensureAuthenticated, api.getMaps);
    app.post('/api/maps', ensureAuthenticated, api.postMap);
    app.get('/api/maps/:id', ensureAuthenticated, api.getMapById);
    app.put('/api/maps/:id', ensureAuthenticated, api.updateMap);
    app.delete('/api/maps/:id', ensureAuthenticated, api.deleteMap);
    app.post('/api/uploadmapimage', ensureAuthenticated, api.uploadImage);

    // api - locations
    app.get('/api/locations', ensureAuthenticated, api.locations);
    app.post('/api/locations', ensureAuthenticated, api.createLocation);
    app.delete('/api/locations/:id', ensureAuthenticated, api.deleteLocation);

    // tests
    app.get('/test/1', test.test1);

    // mongo-rest
    var mongoRest = new MongoRest(app, {
        viewPath: 'admin/resources/',
        collectionViewTemplate :  'resources/{{pluralName}}',
        entityViewTemplate : 'resources/{{singularName}}'
    });

    // resource based url's
    mongoRest.addResource('user', require('./models/user'));
}
