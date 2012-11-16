/**
 * Created with JetBrains WebStorm.
 * User: santiago
 * Date: 7/17/12
 * Time: 1:21 PM
 * To change this template use File | Settings | File Templates.
 */

require.config({
    paths: {
        bootstrap: 'bootstrap/bootstrap.min',
        bootstrap_wysihtml5: 'bootstrap-wysihtml5/dist/bootstrap-wysihtml5-0.0.2',
        Underscore: 'libs/underscore/underscore',
        backbone: 'libs/backbone/backbone',
        pathfinder : 'libs/pathfinding/pathfinding'
    },
    shim: {
        'backbone' : ['Underscore'],
        'bootstrap_wysihtml5' : ['bootstrap', 'bootstrap-wysihtml5/lib/js/wysihtml5-0.3.0']
    }
});

require([
    'jquery',
    'Underscore',
    'backbone',
    'itworks.app',
    'biz/imageManager',
    'admin.router',
    'bootstrap',
    'domReady!',
    'utils/extensions/view'
], function($, _, Backbone, app, imageManager, Router) {

    app.setRouter(new Router());
    // clear loading
    $('#itworks-app').empty();
});
