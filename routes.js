var passport = require('passport');

var
    home = require('./routes/home')
    , test = require('./routes/test');

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = function (app, MapModel) {

    var api = require('./routes/api')(MapModel);

    // home
    app.get('/', home.index);
    app.get('/about', home.about);

    app.get('/login', home.login);
    app.post('/login', passport.authenticate('local',
        {
            successRedirect: '/account',
            failureRedirect: '/login'
        })
    );
    app.get('/account', ensureAuthenticated, home.getAccount);
    app.get('/logout', home.logout);

    // api
    app.get('/api', api.api);
    app.get('/api/maps', api.getMaps);
    app.post('/api/maps', api.postMap);
    app.get('/api/maps/:id', api.getMapById);
    app.put('/api/maps/:id', api.updateMap);
    app.delete('/api/maps/:id', api.deleteMap);
    app.post('/api/uploadmapimage', api.uploadImage);

    // tests
    app.get('/test/1', test.test1);
}
