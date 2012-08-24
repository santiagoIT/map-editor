/**
 * Created with JetBrains WebStorm.
 * User: santiago
 * Date: 7/17/12
 * Time: 1:21 PM
 * To change this template use File | Settings | File Templates.
 */

require.config({
    paths: {
        bootstrap: 'bootstrap.min',
        Underscore: 'libs/underscore/underscore',
        backbone: 'libs/backbone/backbone',
        doT : 'libs/doT/doT.min',
        pathfinder : 'libs/pathfinder/pathfinding'
    },
    shim: {
        'backbone' : ['Underscore']
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
