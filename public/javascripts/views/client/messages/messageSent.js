define([
    'jquery',
    'Underscore',
    'backbone',
    'bizClient/toIntroNavigator',
    'text!views/client/messages/messageSent.html'
],
    function ($, _, Backbone, toIntroNavigator, html) {
        var View = Backbone.View.extend({

            events:{
                'click .navItem':"onNavigateTo"
            },

            initialize:function () {
                this.$el.html(html);
                toIntroNavigator.addHomeRoute('#messages');
            },

            render:function () {
                return this;
            }
        });

        return View;
    }
);