define([
    'jquery',
    'Underscore',
    'backbone',
    'text!views/client/doctors/index.html',
    'views/client/menu/main'
],
    function ($, _, Backbone,  html, MainMenuView) {
        var View = Backbone.View.extend({

            initialize:function () {

                this.$el.html(html);
                this.setupChildViews();
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