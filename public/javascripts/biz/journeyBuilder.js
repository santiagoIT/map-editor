define([
    'Underscore',
    './graphBuilder'
], function (_, graphBuilder) {


    var checkTrail = function (targetId, trail, toFollow) {

        var entry = _.last(trail);
        // found it?
        if (targetId == entry.map.mapId) {
            return true;
        }

        // what to check next!
        _.each(entry.map.links, function (e) {
            var clone = _.clone(trail);
            clone.push(e);
            toFollow.push(clone);
        });

    };

    var stepSearch = function (targetId, trails) {

        var newTrails = [];
        for (var key in trails) {
            if (checkTrail(targetId, trails[key], newTrails)) {
                return trails[key];
            }
        }

        // nothing found, so recurse one level deeper
        var result = stepSearch(targetId, newTrails);
        if (result){
            return result;
        }
    };

    return {
        composeJourney:function (location, destination, tunnels) {

            var results = [],
                graph,
                trail,
                trails =[];
            // source and target on the same map?
            if (location.mapId == destination.mapId) {
                results.push({
                    mapId:location.mapId,
                    from:location.node,
                    to:destination.node
                });
                return results;
            }

            // create graph
            graph = graphBuilder.buildMapGraph(tunnels, location.mapId);
            // now build starting routes
            _.each(graph[0].links, function (e) {
                var ar = [];
                ar.push(e);
                trails.push(ar);
            })
            trail = stepSearch(destination.mapId, trails);
            if (null === trail) {
                return null;
            }

            // compose results
            var nextMapId = location.mapId;
            var nextSourceNode = location.node;
            for (var i in trail){
                var node = trail[i];
                // find tunnel
                var tunnel = tunnels.get(node.tunnelId);

                // define target node
                var targetNode;
                var followingNode;
                if (tunnel.get('mapId1')===nextMapId){
                    targetNode = tunnel.get('node1');
                    followingNode = tunnel.get('node2');
                }
                else{
                    targetNode = tunnel.get('node2');
                    followingNode = tunnel.get('node1');
                }

                results.push({
                    mapId:nextMapId,
                    from:nextSourceNode,
                    to:targetNode
                });

                // prepare for next map
                nextMapId = node.map.mapId;
                nextSourceNode = followingNode;
            }

            // add last node
            results.push({
                mapId:destination.mapId,
                from:nextSourceNode,
                to:destination.node
            });

            return results;
        }
    };
});