define([
    'jquery',
    'Underscore',
    'backbone',
    'utils/viewManager'
], function ($, _, Backbone, viewManager) {

    var AppRouter = Backbone.Router.extend({
        routes:{
            // kiosk
            '' : 'intro',
            'menu':'home',
            'kiosk' : 'kiosk',
            'services' : 'services',
            'doctors' : 'doctors',

            // Default
            '*actions':'defaultAction'
        },

        // home
        home : function() {
            this.launchView('views/client/home/main');
        },

        // home
        intro : function() {
            this.launchView('views/client/intro/index');
        },

        // client
        kiosk : function() {
            this.launchView('views/client/navigator/main');
        },

        // doctors
        doctors : function() {
            this.launchView('views/client/doctors/index');
        },

        // services
        services : function() {
            this.launchView('views/client/services/index');
        },

        defaultAction:function (actions) {
            // We have no matching route, lets just log what the URL was
            console.log('No route:', actions);
        },

        initialize : function() {
            Backbone.history.start();
        },

        launchView : function(view, id){
            require([view], function(View){
                viewManager.showView(new  View(id));
            });
        }
    });

    return AppRouter;
});