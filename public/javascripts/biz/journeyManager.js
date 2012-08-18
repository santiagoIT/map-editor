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
            var currentId = model.get('currentMapId');
            var entry = _.first(journey);
            var fromId = entry.mapId;

            console.log('Must travel from: ' + currentId + ' to: ' + fromId);
            console.log(entry);

            if (fromId != currentId){
                // transition
                var self = this;
                model.transitionTo(fromId, function(){
                    model.pathFind(entry.from, entry.to);
                });
            }
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