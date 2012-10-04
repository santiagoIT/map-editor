define([
    'jquery',
    'Underscore',
    'backbone',
    'text!views/client/home/main.html'
],
    function ($, _, Backbone, html) {
        var View = Backbone.View.extend({

            events:{
                //'click .btnMapa': 'goToLocation'
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