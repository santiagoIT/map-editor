define([
    'jquery',
    'Underscore',
    'backbone',
    'require',
    'text!views/itworks.home.html'
], function($, _, Backbone, require, html){
    var HomeView = Backbone.View.extend({
        el: $('#itworks-app'),
        events : {
            'click #btnShowEditor' : "onShowEditor",
            'click #btnMaps' : "onMaps"
        },
        render: function() {
            this.$el.html(html);
        },
        onShowEditor : function(){
            console.log('onShowEditor');
            require(['itworks.app'], function(app){
                app.Router.navigate('node-editor', {trigger:true});
            });
        },
        onMaps : function(){
            console.log('onMaps');
            require(['itworks.app'], function(app){
                app.Router.navigate('maps', {trigger:true});
            });
        }
    });
    // Our module now returns an instantiated view
    // Sometimes you might return an un-instantiated view e.g. return projectListView
    return HomeView;
});