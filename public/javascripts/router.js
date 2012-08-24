define([
    'jquery',
    'Underscore',
    'backbone',
    'utils/viewManager'
], function ($, _, Backbone, viewManager) {

    var AppRouter = Backbone.Router.extend({
        routes:{
            // kiosk
            '' : 'kiosk',

            // Default
            '*actions':'defaultAction'
        },

        // client
        kiosk : function() {
            console.log('KIOSK view');
            this.launchView('views/client/navigator/main');
        },

        defaultAction:function (actions) {
            // We have no matching route, lets just log what the URL was
            console.log('No route:', actions);
        },

        initialize : function() {
            Backbone.history.start();
            console.log('router initialized');
        },

        launchView : function(view, id){
            require([view], function(View){
                viewManager.showView(new  View(id));
            });
        }
    });

    return AppRouter;
});