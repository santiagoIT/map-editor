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
            'kiosk/:id' : 'kiosk',
            'services' : 'services',
            'doctors' : 'doctors',

            // messages
            'messages' : 'messages',
            'createMessage' : 'createMessage',
            'writeMessage' : 'writeMessage',
            'messageSent' : 'messageSent',

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
        kiosk : function(id) {
            this.launchView('views/client/navigator/main', id);
        },

        // doctors
        doctors : function() {
            this.launchView('views/client/doctors/index');
        },

        // services
        services : function() {
            this.launchView('views/client/services/index');
        },

        // messages
        messages : function() {
            this.launchView('views/client/messages/index');
        },
        createMessage : function() {
            this.launchView('views/client/messages/createMessage');
        },
        writeMessage : function() {
            this.launchView('views/client/messages/writeMessage');
        },
        messageSent : function() {
            this.launchView('views/client/messages/messageSent');
        },

        defaultAction:function (actions) {
            // We have no matching route, lets just log what the URL was
            console.log('No route:', actions);
        },

        initialize : function() {
            Backbone.history.start();
        },

        launchView : function(view){

            var args = Array.prototype.slice.call(arguments);
            var options = {};
            if (args.length > 1) {
                args = args.slice(1);
                // keep compatibility with existing views
                if (args.length == 1) {
                    options = args[0];
                }
                else {
                    _.each(args, function(value, key, list){
                        options[key] = value;
                    });
                }
            }

            require([view], function(View){
                viewManager.showView(new  View(options));
            });
        }
    });

    return AppRouter;
});