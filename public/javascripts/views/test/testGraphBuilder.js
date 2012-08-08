define([
    'jquery',
    'Underscore',
    'backbone',
    'text!views/test/testGraphBuilder.html',
    'collections/tunnels',
    'models/tunnelModel',
    'biz/graphBuilder'
],
    function ($, _, Backbone, html, tunnels, TunnelModel, calc) {

        var View = Backbone.View.extend({
            events:{
                'click .testRunner':"testRunner"
            },

            initialize:function () {

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

                var graph = calc.buildMapGraph(tunnels, 1);
                calc.printMapGraph(graph);
            },

            render:function () {
                this.$el.html(html);

            },

            testRunner : function(){

                return false;
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return View;
    });