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
                $('.headerMenuItem').removeClass('active');

                this.$el.html(html);
                // get current hash tag
                if(window.location.hash) {
                    switch(window.location.hash){
                        case '#kiosk':
                            $('#mnuItemMaps').addClass('active');
                            break;
                    }
                }
                return this;
            }
        });

        return View;
    }
);