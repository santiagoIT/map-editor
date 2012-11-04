define([
    'jquery',
    'Underscore',
    'backbone',
    'text!views/client/menu/main.html'
],
    function ($, _, Backbone, html) {
        var View = Backbone.View.extend({

            events:{
                'click .navItem':"onNavigateTo"
            },

            initialize:function () {
            },

            render:function () {
                this.$el.html(html);
            }
        });

        return View;
    }
);