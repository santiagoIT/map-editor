define([
    'jquery',
    'Underscore',
    'backbone',
    'require',
    'text!views/home.html'
], function ($, _, Backbone, require, html) {
    var HomeView = Backbone.View.extend({
        el:$('#itworks-app'),
        events:{
            'click .navItem':"onNavigateTo"
        },
        render:function () {
            this.$el.html(html);
        }
    });
    // Our module now returns an instantiated view
    // Sometimes you might return an un-instantiated view e.g. return projectListView
    return HomeView;
});