define([
    'jquery',
    'Underscore',
    'backbone',
    'bizClient/toIntroNavigator',
    'text!views/client/messages/createMessage.html'
],
    function ($, _, Backbone, toIntroNavigator, html) {
        var View = Backbone.View.extend({

            events:{
                //'click .navItem':"onNavigateTo",
                'click .btnWriteMessage':"onBtnWriteMessage"
            },

            initialize:function () {
                this.toIntroNavigator = toIntroNavigator;
                this.toIntroNavigator.setRouteToNavigateTo('messages');
                this.toIntroNavigator.startCounting();

                this.$el.html(html);
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

            render:function () {

                return this;
            }
        });

        return View;
    }
);