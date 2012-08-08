define([
    'Underscore',
    'biz/journeyBuilder',
    'collections/tunnels',
    'models/tunnelModel'
], function(_, jBuilder, tunnels, TunnelModel){
    describe("Journey Builder Spec", function() {

        beforeEach(function(){
            tunnels.reset();

            var tunnel = new TunnelModel();
            tunnel.set('_id', '1_2');
            tunnel.set('mapId1', 1);
            tunnel.set('mapId2', 2);
            tunnels.add(tunnel);

            tunnel = new TunnelModel();
            tunnel.set('_id', '2_4');
            tunnel.set('mapId1', 2);
            tunnel.set('mapId2', 4);
            tunnels.add(tunnel);

            tunnel = new TunnelModel();
            tunnel.set('_id', '1_3');
            tunnel.set('mapId1', 3);
            tunnel.set('mapId2', 1);
            tunnels.add(tunnel);

            tunnel = new TunnelModel();
            tunnel.set('_id', '4_5');
            tunnel.set('mapId1', 5);
            tunnel.set('mapId2', 4);
            tunnels.add(tunnel);

            tunnel = new TunnelModel();
            tunnel.set('_id', '4_6');
            tunnel.set('mapId1', 4);
            tunnel.set('mapId2', 6);
            tunnels.add(tunnel);
        });

        it("should find a journey", function(){

            var path = jBuilder.composeJourney({mapId:1}, {mapId:6}, tunnels);
            expect(path).not.toBe(null);
            // simple trail
            var simpleTrail = _.map(path, function(e){
                return e.mapId;
            })
            var expected = [1,2,4,6];
            expect(simpleTrail).toMatch(expected);
        });
    });

});
