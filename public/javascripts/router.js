define([
    'jquery',
    'Underscore',
    'backbone',
    'views/node-editor',
    'views/home'
], function ($, _, Backbone, NodeEditorView, homeView) {

    var AppRouter = Backbone.Router.extend({
        routes:{
            // Define some URL routes
            '' : 'showHome',
            'node-editor':'showNodeEditor',

            // Default
            '*actions':'defaultAction'
        },

        showHome : function(){
            console.log('show home');
            homeView.render();
        },

        showNodeEditor:function () {
            var view = new NodeEditorView();
            console.log('showNodeEditor');
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