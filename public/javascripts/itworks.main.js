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

require(['jquery', 'Underscore', 'backbone', 'itworks.app', 'bootstrap',  'domReady!'], function($, _, Backbone, app) {

    // extend backbone views
    Backbone.View.prototype.onNavigateTo = function (el) {
        console.log('Backbone.View.prototype.onNavigateTon was CALLLED!!!!')
        var route = $(el.target).attr('data-navitem');
        require(['itworks.app'], function (app) {
            app.Router.navigate(route, {trigger:true});
        });
        return false;
    };

});
