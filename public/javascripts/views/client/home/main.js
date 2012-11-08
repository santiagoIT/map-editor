define([
    'jquery',
    'Underscore',
    'backbone',
    'bizClient/toIntroNavigator',
    'text!views/client/home/main.html'
],
    function ($, _, Backbone, toIntroNavigator, html) {
        var View = Backbone.View.extend({

            events:{
                'click .navItem':"onNavigateTo"
            },

            initialize:function () {
                this.$el.html(html);
                toIntroNavigator.startCounting();
            },

            render:function () {

            }
        });

        return View;
    }
);