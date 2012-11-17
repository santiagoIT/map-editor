define([
    'jquery',
    'Underscore',
    'backbone',
    'require',
    'text!views/admin/home.html'
], function ($, _, Backbone, require, html) {
    var View = Backbone.View.extend({
        events:{
            'click .navItem':"onNavigateTo"
        },
        render:function () {
            this.$el.html(html);
        }
    });
    // Our module now returns an instantiated view
    // Sometimes you might return an un-instantiated view e.g. return projectListView
    return View;
});