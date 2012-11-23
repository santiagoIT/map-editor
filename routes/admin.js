var
    s3AssetDownloader = require('../libs/s3AssetDownloader');

module.exports = {
    index : function(req, res) {
        res.render('admin', { title: 'Map Editor' });
    },

    localSetup : function(req, res) {
        res.render('admin/localSetup', { title: 'Local Server Setup' });
    },

    localSetupPost : function(req, res, next) {

        s3AssetDownloader.downloadAssets(function(err){
            // TODO: handle error
            res.redirect('/admin/localSetupSuccess');
        });
    },

    localSetupSuccess : function(req, res) {
        res.render('admin/localSetupSuccess', { title: 'Local Server Setup' });
    }
};