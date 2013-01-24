define([
    'jquery',
    'Underscore',
    'backbone',
    'bizClient/toIntroNavigator',
    'text!views/client/messages/writeMessage.html'
],
    function ($, _, Backbone, toIntroNavigator, html) {
        var View = Backbone.View.extend({

            events:{
                //'click .navItem':"onNavigateTo",
                'click .btnSubmitMessage':"onBtnSubmitMessage"
            },

            initialize:function () {
                this.toIntroNavigator = toIntroNavigator;
                this.toIntroNavigator.setRouteToNavigateTo('messages');
                this.toIntroNavigator.startCounting();

                this.roomNumber = this.options[0];
                this.delivery = this.options[1];

                this.$el.html(html);

                console.log('roomNumber', this.options[0], 'delivery', this.options[1]);
            },

                onBtnSubmitMessage :  function(el){

                // serialize data
                var
                    message = this.$el.find('#message').val();

                // validate data
                if (!message){
                    this.$el.find('.text-error').text('Mensaje esta vacio!');
                    return false;
                }

                // clear error
                this.$el.find('.text-error').text('');

                // all OK!
                // launch writeMessagePage
                this.onNavigateTo(el);
            },

            render:function () {

                return this;
            }
        });

        return View;
    }
);