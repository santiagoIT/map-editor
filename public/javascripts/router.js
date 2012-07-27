define([
    'jquery',
    'Underscore',
    'backbone',
    'views/mapEditor',
    'views/home',
    'views/maps'
], function ($, _, Backbone, NodeEditorView, HomeView, MapView) {

    var AppRouter = Backbone.Router.extend({
        routes:{
            // Define some URL routes
            '' : 'showHome',
            'node-editor/:mapid':'showNodeEditor',
            'maps':'showMaps',

            // Default
            '*actions':'defaultAction'
        },

        showHome : function(){
            console.log('show home');
            var hmView = new HomeView();
            hmView.render();
        },

        showMaps : function(){
            console.log('show home');
            var mapView = new MapView();
            //mapView.initialize();
        },

        showNodeEditor:function (mapid) {
            var view = new NodeEditorView(mapid);
            view.render();
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