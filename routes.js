var passport = require('passport');

var
    home = require('./routes/home')
    , test = require('./routes/test')
    , api = require('./routes/api')
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

    // api
    app.get('/api', ensureAuthenticated, api.api);
    app.get('/api/maps', ensureAuthenticated, api.getMaps);
    app.post('/api/maps', ensureAuthenticated, api.postMap);
    app.get('/api/maps/:id', ensureAuthenticated, api.getMapById);
    app.put('/api/maps/:id', ensureAuthenticated, api.updateMap);
    app.delete('/api/maps/:id', ensureAuthenticated, api.deleteMap);
    app.post('/api/uploadmapimage', ensureAuthenticated, api.uploadImage);

    // tests
    app.get('/test/1', test.test1);
}
