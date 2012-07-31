module.exports = {
    index : function(req, res) {
        res.render('index', { title: 'Map Editor' });
    },

    // app.get('/about', ...
    about: function(req, res) {
        res.render('about.jade');
    },

    // app.get('/login', ...
    login: function(req, res) {
        res.render('login.jade');
    },

    // app.get('/logout'...)
    logout: function(req, res){
        req.logout();
        res.redirect('/');
    }
};