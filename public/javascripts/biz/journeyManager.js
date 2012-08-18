define([
    'jquery',
    'Underscore',
    'backbone'
],
    function ($, _, Backbone) {

        var activateHelper = function(model) {

        };

        var fireTransition = function (model) {

            var journey = model.get('journey');
            var fromId = model.get('currentMapId');
            var map = _.first(journey);
            var toId = map.get('_id');

            console.log('Must travel from: ' + fromId + ' to: ' + toId);
        };

        var exports = {
            activate : function(model) {
                // we must have a journey
                var journey = model.get('journey');
                if (!journey){
                    return;
                }

                fireTransition(model);

            }
        };

        _.extend(exports, Backbone.Events);

        return exports;
    }
);