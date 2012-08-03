define([
    'jquery',
    'Underscore',
    'backbone',
    'utils/viewManager'
], function ($, _, Backbone, viewManager) {

    var AppRouter = Backbone.Router.extend({
        routes:{
            // Define some URL routes
            '' : 'showHome',
            'map_edit/:mapid':'map_edit',
            'maps':'maps',
            'maps_create':'maps_create',

            // locations
            'locations' : 'locations',
            createLocation : 'createLocation',

            // Default
            '*actions':'defaultAction'
        },

        showHome : function(){
            require(['views/home'], function(View){
                viewManager.showView(new  View());
            });
        },

        maps : function(){
            require(['views/maps/maps'], function(View){
                viewManager.showView(new  View());
            });
        },

        maps_create : function(){
            require(['views/maps/create'], function(View){
                viewManager.showView(new  View());
            });
        },

        locations : function(){
            require(['views/locations/index'], function(View){
                viewManager.showView(new  View());
            });
        },

        createLocation : function(){
            require(['views/locations/create'], function(View){
                viewManager.showView(new  View());
            });
        },

        map_edit:function (mapid) {

            require(['views/maps/edit'], function(View){
                viewManager.showView(new  View(mapid));
            });
        },

        defaultAction:function (actions) {
            // We have no matching route, lets just log what the URL was
            console.log('No route:', actions);
        },

        initialize : function() {
            Backbone.history.start();
        }
    });

    return AppRouter;
});