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
            'map_edit/:id':'map_edit',
            'maps':'maps',
            'maps_create':'maps_create',

            // locations
            'locations' : 'locations',
            'locations_edit/:id' : 'locations_edit',
            'createLocation' : 'locations_create',

            // tunnels
            'tunnels' : 'tunnels',
            'tunnels_create' : 'tunnels_create',
            'tunnels_edit/:id' : 'tunnels_edit',

            // testing
            'testGraphBuilder' : 'testGraphBuilder',

            // Default
            '*actions':'defaultAction'
        },

        showHome : function(){
            this.launchView('views/home');
        },

        maps : function(){
            this.launchView('views/maps/index');
        },

        maps_create : function(){
            this.launchView('views/maps/create');
        },

        map_edit:function (id) {
            this.launchView('views/maps/edit/edit', id);
        },

        locations : function(){
            this.launchView('views/locations/index');
        },

        locations_create : function(){
            this.launchView('views/locations/create');
        },

        locations_edit : function(id){
            this.launchView('views/locations/edit', id);
        },

        // tunnels
        tunnels : function(){
            this.launchView('views/tunnels/index');
        },

        tunnels_create : function(){
            this.launchView('views/tunnels/create');
        },

        tunnels_edit : function(id){
            this.launchView('views/tunnels/edit', id);
        },

        // tests
        testGraphBuilder : function(){
            this.launchView('views/test/testGraphBuilder');
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