define([
    'jquery',
    'Underscore',
    'backbone',
    'bizClient/toIntroNavigator',
    'views/client/keyboard/main',
    'text!views/client/messages/createMessage.html'
],
    function ($, _, Backbone, toIntroNavigator, KeyboardView, html) {
        var View = Backbone.View.extend({

            events:{
                //'click .navItem':"onNavigateTo",
                'click .btnWriteMessage':"onBtnWriteMessage",
                'focus input' : 'showKeyboard'
            },

            initialize:function () {
                this.toIntroNavigator = toIntroNavigator;
                this.toIntroNavigator.setRouteToNavigateTo('messages');
                this.toIntroNavigator.startCounting();

                this.$el.html(html);

                // keyboard view
                this.keyboardView = new KeyboardView();
                var $keyboard = this.$el.find('.keyboard');
                $keyboard.append(this.keyboardView.el);
                this.addChildView(this.keyboardView);
            },

            onBtnWriteMessage :  function(el){

              // serialize data
              var
                  roomNumber = this.$el.find('#roomNumber').val(),
                  deliveryMode = this.$el.find('#deliveryMode').val();

                // validate data
                roomNumber = parseInt(roomNumber);
                if (isNaN(roomNumber)){
                    this.$el.find('.text-error').text('Numero de habitacion no valido!');
                    return false;
                }

                // clear error
                this.$el.find('.text-error').text('');

                // all OK!
                // launch writeMessagePage
                var route = $(el.target).attr('data-navitem');
                route += '/'+roomNumber + '/'+deliveryMode;
                $(el.target).attr('data-navitem', route);

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