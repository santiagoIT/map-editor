define([
    'biz/graphBuilder',
    'collections/tunnels',
    'models/tunnelModel'
    ], function(gb, tunnels, TunnelModel){
    describe("Graph Builder test", function() {

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



        var handcrafted = [
            {
                mapId:1,
                links:[
                    {
                        map:{
                            mapId:2,
                            links:[
                                {
                                    map : {
                                        mapId: 4,
                                        links : [
                                            {
                                                map : {
                                                    mapId : 5,
                                                    links :[]
                                                },
                                                tunnelId : '4_5'
                                            },
                                            {
                                                map :{
                                                    mapId : 6,
                                                    links :[]
                                                },
                                                tunnelId: '4_6'
                                            }
                                        ]
                                    },
                                    tunnelId : '2_4'
                                }
                            ]
                        },
                        tunnelId:'1_2'
                    },
                    {
                        map:{
                            mapId:3,
                            links :[]
                        },
                        tunnelId:'1_3'
                    }
                ]
            }
        ];

        it("should build a matching graph", function(){
            var graph = gb.buildMapGraph(tunnels, 1);
            //gb.printMapGraph(graph);
            expect(graph).toEqual(handcrafted);
        });
    });

});
