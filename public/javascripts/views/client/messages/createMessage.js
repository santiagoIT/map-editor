define([
    'jquery',
    'Underscore',
    'backbone',
    'bizClient/toIntroNavigator',
    'biz/kioskHelper',
    'views/client/keyboard/main',
    'text!views/client/messages/createMessage.html'
],
    function ($, _, Backbone, toIntroNavigator, kioskHelper, KeyboardView, html) {
        var View = Backbone.View.extend({

            events:{
                'click .navItem':"onNavigateTo",
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

                // config keyboard
                var self = this;
                this.keyboardView.setDoneBehaviour(null, function() {

                    var el = {
                        target: self.$el.find('.btnWriteMessage')[0]
                    }
                    self.onBtnWriteMessage(el);
                });
            },

            onBtnWriteMessage :  function(el){

              // serialize data
              var msgInfo = {
                  room : parseInt(this.$el.find('#roomNumber').val()),
                  sender: this.$el.find('#name').val(),
                  email : this.$el.find('#email').val()
                }

                // validate data
                if (isNaN(msgInfo.room)){
                    this.$el.find('.text-error').text('Numero de habitacion no valido!');
                    return false;
                }

                if (!msgInfo.sender){
                    this.$el.find('.text-error').text('Ingrese su nombre porfavor!');
                    return false;
                }

                if (!msgInfo.email){
                    this.$el.find('.text-error').text('Ingrese su direccion de correo electronico!');
                    return false;
                }
                if (!this.validateEmail(msgInfo.email)) {
                    this.$el.find('.text-error').text('Direccion de correo electronico no valida!');
                    return false;
                }

                // clear error
                this.$el.find('.text-error').text('');

                // store in local storage
                kioskHelper.saveValueToLocalStorage("messageInfo", JSON.stringify(msgInfo));

                // all OK!
                // launch writeMessagePage
                var route = $(el.target).attr('data-navitem');
                $(el.target).attr('data-navitem', route);
                this.onNavigateTo(el);
            },

            validateEmail: function(email) {
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
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