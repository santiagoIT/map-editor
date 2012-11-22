define([
    'jquery',
    'Underscore',
    'backbone',
    'text!views/client/common/indexBar.html'
],
    function ($, _, Backbone, html) {

        var View = Backbone.View.extend({
            events:{
                'click .indexChar' : "onIndexCharChanged"
            },

            initialize:function () {
            },

            render:function () {
                this.$el.html(html);
                return this;
            },

            onIndexCharChanged : function(event) {
                var $char = $(event.target);
                this.trigger('searchIndexChanged', $char.text());
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return View;
    });