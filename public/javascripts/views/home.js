define([
    'jquery',
    'Underscore',
    'backbone',
    'require',
    'text!views/itworks.home.html'
], function($, _, Backbone, require, html){
    var homeView = Backbone.View.extend({
        el: $('#itworks-app'),
        events : {
            'click #btnShowEditor' : "onShowEditor"
        },
        render: function() {
            this.$el.html(html);
        },
        onShowEditor : function(){
            console.log('onShowEditor');
            require(['itworks.app'], function(app){
                app.Router.navigate('node-editor', {trigger:true});
            });

        }
    });
    // Our module now returns an instantiated view
    // Sometimes you might return an un-instantiated view e.g. return projectListView
    return new homeView;
});