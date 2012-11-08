define([
    'jquery',
    'Underscore',
    'backbone',
    'bizClient/toIntroNavigator',
    'text!views/client/doctors/index.html',
    'views/client/menu/main'
],
    function ($, _, Backbone,  toIntroNavigator, html, MainMenuView) {
        var View = Backbone.View.extend({

            initialize:function () {

                this.$el.html(html);
                this.setupChildViews();

                this.toIntroNavigator = toIntroNavigator;
            },

            setupChildViews: function(){

                // header menu
                var mainMenuView = new MainMenuView();
                mainMenuView.setElement(this.$el.find('#menuHeader')[0]);
                this.addChildView(mainMenuView);
            },

            render:function () {
                return this;
            }
        });

        return View;
    });