define([
    'jquery',
    'Underscore',
    'backbone'
],
    function ($, _, Backbone) {

        var fireTransition = function (model, journey, journeyNode) {

            var
                currentId = model.get('currentMapId'),
                entry = journey[journeyNode],
                fromId = entry.mapId;

            console.log('Must travel from: ' + currentId + ' to: ' + fromId);
            console.log(entry);

            if (fromId != currentId){
                // transition
                var self = this;
                model.transitionTo(fromId, function(){
                    model.pathFind(entry.from, entry.to);
                });
            }
            else{
                model.pathFind(entry.from, entry.to);
            }
        };

        var exports = {
            continueJourney : function(model) {
                var
                    journey = model.get('journey'),
                    journeyNode = model.get('currentJourneyNode');
                // we must have a journey
                if (!journey){
                    return;
                }

                fireTransition(model, journey, journeyNode);
            }
        };

        _.extend(exports, Backbone.Events);

        return exports;
    }
);