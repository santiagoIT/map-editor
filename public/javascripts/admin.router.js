define([
    'jquery',
    'Underscore',
    'backbone',
    'utils/viewManager'
], function ($, _, Backbone, viewManager) {

    var AppRouter = Backbone.Router.extend({
        routes:{

            // Define some URL routes
            '' : 'admin',
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

            // services
            'services' : 'services',
            'services_edit/:id' : 'services_edit',
            'services_create' : 'services_create',

            // doctors
            'doctors' : 'doctors',
            'doctors_edit/:id' : 'doctors_edit',
            'doctors_create' : 'doctors_create',

            // Default
            '*actions':'defaultAction'
        },

        admin : function(){
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

        // locations
        locations : function(){
            this.launchView('views/locations/index');
        },

        locations_create : function(){
            this.launchView('views/locations/create');
        },

        locations_edit : function(id){
            this.launchView('views/locations/edit', id);
        },

        // services
        services : function(){
            this.launchView('views/admin/services/index');
        },

        services_create : function(){
            this.launchView('views/admin/services/create');
        },

        services_edit : function(id){
            this.launchView('views/admin/services/edit', id);
        },

        // doctors
        doctors : function(){
            this.launchView('views/admin/doctors/index');
        },

        doctors_create : function(){
            this.launchView('views/admin/doctors/create');
        },

        doctors_edit : function(id){
            this.launchView('views/admin/doctors/edit', id);
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