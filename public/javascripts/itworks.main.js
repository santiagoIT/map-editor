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
        Underscore: 'libs/underscore/underscore',
        backbone: 'libs/backbone/backbone',
        pathfinder : 'libs/pathfinding/pathfinding'
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
    'router',
    'config',
    'bootstrap',
    'domReady!',
    'utils/extensions/view'
], function($, _, Backbone, app, imageManager, Router, config) {

    var
        router = new Router();
    app.setRouter(router);
  // clear loading
    $('#itworks-app').empty();

    // prevent right click menu from appearing
    if (!config.enableRightClick) {
        window.oncontextmenu = function(event) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        };
    }
});
