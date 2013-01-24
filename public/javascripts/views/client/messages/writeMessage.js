define([
    'jquery',
    'Underscore',
    'backbone',
    'bizClient/toIntroNavigator',
    'views/client/keyboard/main',
    'text!views/client/messages/writeMessage.html'
],
    function ($, _, Backbone, toIntroNavigator, KeyboardView, html) {
        var View = Backbone.View.extend({

            events:{
                //'click .navItem':"onNavigateTo",
                'click .btnSubmitMessage':"onBtnSubmitMessage",
                'focus textarea' : 'showKeyboard'
            },

            initialize:function () {
                this.toIntroNavigator = toIntroNavigator;
                this.toIntroNavigator.setRouteToNavigateTo('messages');
                this.toIntroNavigator.startCounting();

                this.roomNumber = this.options[0];
                this.delivery = this.options[1];

                this.$el.html(html);

                // keyboard view
                this.keyboardView = new KeyboardView();
                var $keyboard = this.$el.find('.keyboard');
                $keyboard.append(this.keyboardView.el);
                this.addChildView(this.keyboardView);
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

            showKeyboard:function(event) {
                this.keyboardView.$el.parent().show();

                var $element = $(event.target);
                this.keyboardView.setFocusedElement($element);
            },


            render:function () {

                return this;
            }
        });

        return View;
    }
);