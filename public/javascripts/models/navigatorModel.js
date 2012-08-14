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
            currentMapId : null,

            // map ID kiosk is set to show
            kioskInfo : null,

            // links that originate from current map
            graph : null
        },

        initialize : function(){

            // tunnels available?
            if (tunnels.length < 1){
                var self = this;
                tunnels.fetch({
                    success:function() {
                        self.initHelper();
                    }
                });
            }
            else{
                this.initHelper();
            }
        },

        initHelper : function(){
            // load kiosk data
            this.setupKioskData();
            // show kiosk Map
            this.showMap(this.kioskInfo.mapId);
        },

        // just show map
        showMap : function(id) {
            this.set('currentMapId', id);
            // setup links
            var graph = graphBuilder.buildMapGraph(tunnels, id);
            this.set('graph', graph);
        },

        // fire-up path finding
        navigateTo : function(locationId) {
            var
                location = new LocationModel({_id:locationId}),
                self = this;
            location.fetch(function(){
                // setup journey
                self.journey = journeyBuilder.composeJourney(self.kioskInfo, {mapId:location.mapId, node:location.node}, tunnels);
                // debug it
                console.log('JOURNEY CALCULATED!!!!');
                console.log(self.journey);
            });

        },

        setupKioskData : function(){
            this.kioskInfo = kioskHelper.getKioskLocation();
        }


    });
    // You usually don't return a model instantiated
    return Model;
});