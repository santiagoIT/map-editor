define([
    'jquery',
    'Underscore',
    'backbone',
    'text!views/client/intro/index.html'
],
    function ($, _, Backbone, html) {
        var View = Backbone.View.extend({

            events:{
                'click .navItem':"onNavigateTo"
            },

            initialize:function () {
                this.$el.html(html);
            },

            render:function () {

            }
        });

        return View;
    }
);