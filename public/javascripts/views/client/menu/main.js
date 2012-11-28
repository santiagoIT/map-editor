define([
    'jquery',
    'Underscore',
    'backbone',
    'bizClient/toIntroNavigator',
    'text!views/client/menu/main.html'
],
    function ($, _, Backbone, toIntroNavigator, html) {
        var View = Backbone.View.extend({

            events:{
                'click .navItem':"onNavigateTo"
            },

            initialize:function () {
                this.toIntroNavigator = toIntroNavigator;
                    this.toIntroNavigator.startCounting();
            },

            render:function () {
                $('.headerMenuItem').removeClass('active');

                this.$el.html(html);
                // get current hash tag
                if(window.location.hash) {
                    var hashRoot = window.location.hash.split('/')[0];

                    switch(hashRoot){
                        case '#kiosk':
                            this.$el.find('#mnuItemMaps').addClass('active');
                            break;
                        case '#doctors':
                            this.$el.find('#mnuItemDoctors').addClass('active');
                            break;
                        case '#services':
                            this.$el.find('#mnuItemServices').addClass('active');
                            break;
                        default:
                            alert('Unkown hash: ' + window.location.hash);
                    }
                }
                return this;
            }
        });

        return View;
    }
);