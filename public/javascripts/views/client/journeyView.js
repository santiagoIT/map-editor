define([
    'jquery',
    'Underscore',
    'backbone',
    'pathfinder',
    'collections/locations',
    'models/journeyModel'
],
    function ($, _, Backbone, PF, locations, JourneyModel) {
        var View = Backbone.View.extend({

            initialize:function () {
                this.model = new JourneyModel();
                this.bindTo(this.model, 'change:navigating', this.navigationChanged);

                // read kiosk location (mapId, node) from local storage

            },

            render:function () {
            },

            navigationChanged : function(model){
                var inProgress = model.get('navigating');
                // disable/enable buttons
                var $btn = this.$('.doNavigate');
                if (!inProgress){
                    $btn.removeAttr('disabled');
                }
                else{
                    if (!$btn.attr('disabled')){
                        $btn.attr('disabled', true);
                    }
                }
            }
        });

        return View;
    });