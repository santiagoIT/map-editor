define([
    'Underscore',
    'backbone',
    'collections/tunnels',
    'models/locationModel',
    'biz/kioskHelper',
    'biz/graphBuilder',
    'biz/journeyBuilder'
], function (_, Backbone, tunnels, LocationModel, kioskHelper, graphBuilder, journeyBuilder) {
    var Model = Backbone.Model.extend({
        defaults:{
            // true when navigating. Will influence UI
            currentMapId:null,

            // map ID kiosk is set to show
            kioskInfo:null,

            // links that originate from current map
            graph:null,

            // current journey node
            currentJourneyNode:0
        },

        initialize:function () {

            // tunnels available?
            if (tunnels.length < 1) {
                var self = this;
                tunnels.fetch({
                    success:function () {
                        self.initHelper();
                    }
                });
            }
            else {
                this.initHelper();
            }
        },

        initHelper:function () {
            // load kiosk data
            this.setupKioskData();
            // show kiosk Map
            this.showMap(this.get('kioskInfo').mapId);
        },

        // just show map
        showMap:function (id) {
            this.set('currentMapId', id);
            // setup links
            var graph = graphBuilder.buildMapGraph(tunnels, id);
            this.set('graph', graph);
        },

        // fire-up path finding
        navigateTo:function (location) {
            if (!location) {
                return;
            }
            this.set('currentJourneyNode', 0);

            // setup journey
            var journey = journeyBuilder.composeJourney(this.get('kioskInfo'), {mapId:location.get('mapId'), node:location.get('node')}, tunnels);
            if (!journey) {
                return;
            }
            this.set('journey', journey);
        },

        setupKioskData:function () {
            this.set('kioskInfo', kioskHelper.getKioskLocation());
        },

        showKioskLocation : function(){
            var kioskInfo = this.get('kioskInfo');
            if (kioskInfo && kioskInfo.mapId){
                this.set('currentMapId', kioskInfo.mapId);
            }
        },

        transitionTo : function(mapId, callback){
            this.set('transitionTo', {mapId: mapId, callback:callback});
        },

        pathFind : function(from, to){
            this.set('pathFrom', from);
            this.set('pathTo', to);
            this.trigger('change:pathFind');
        },

        destinationNodeReached: function(info){
            this.set('destination-node', info);
            this.set('journey', null);
            this.trigger('destinationNodeReached');
        },

        journeyStepComplete : function(){
            var currentNode = this.get('currentJourneyNode');
            this.set('currentJourneyNode', currentNode+1);
            this.trigger('change:journey');
        }
    });
    // You usually don't return a model instantiated
    return Model;
});