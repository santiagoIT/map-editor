define([
    'jquery',
    'Underscore',
    'backbone',
    'bizClient/toIntroNavigator',
    'biz/kioskHelper',
    'views/client/keyboard/main',
    'text!views/client/messages/writeMessage.html'
],
    function ($, _, Backbone, toIntroNavigator, kioskHelper, KeyboardView, html) {
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

                // set focus to message box
                this.$el.find('#message').focus();
                this.keyboardView.$el.parent().show();

                var $element = $(event.target);
                this.keyboardView.setFocusedElement(this.$el.find('#message'));

                // configure keyboard behaviour
                var self = this;
                this.keyboardView.setDoneBehaviour('ENVIAR', function() {

                    var el = {
                        target: self.$el.find('.btnSubmitMessage')[0]
                    }
                    self.onBtnSubmitMessage(el);
                });
            },

            onBtnSubmitMessage :  function(el){

                // get from local storage
                var msgInfo = JSON.parse(kioskHelper.getValueFromLocalStorage("messageInfo"));
                if (!msgInfo) {
                    return;
                }

                // serialize data
                msgInfo.message = this.$el.find('#message').val();

                // validate data
                if (!msgInfo.message){
                    this.$el.find('.text-error').text('Mensaje esta vacio!');
                    return false;
                }

                if (msgInfo.message.length > 140) {
                    this.$el.find('.text-error').text('Mensaje muy largo. Estas usando: ' + msgInfo.message.length + ' caracteres!');
                    return false;
                }

                // clear error
                this.$el.find('.text-error').text('');

                // TODO: submit message


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