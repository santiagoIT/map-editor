define([
    'Underscore'
], function (_) {

    // private stuff
    var getConnectionsFor = function (tunnels, mapId, used) {
        var outgoing = [];
        for (var i = 0; i < tunnels.length; i++) {
            var tunnel = tunnels.at(i);
            var id1 = tunnel.get('mapId1');
            var id2 = tunnel.get('mapId2');
            if (id1 == mapId) {
                // in use?
                if (_.indexOf(used, id2) == -1) {
                    outgoing.push({mapId:id2, tunnelId:tunnel.get('_id')});
                    // mark as used
                    used.push(id2);
                }
            }
            else if (id2 == mapId) {
                // in use?
                if (_.indexOf(used, id1) == -1) {
                    outgoing.push({mapId:id1, tunnelId:tunnel.get('_id')});
                    // mark as used
                    used.push(id1);
                }
            }
        }

        return outgoing;
    };

    var buildGraphHelper = function (parentNode, tunnels, mapId, used) {

        var
            outgoing,
            node;

        // mark as used
        used.push(mapId);

        outgoing = getConnectionsFor(tunnels, mapId, used);

        _.each(outgoing, function (connection) {

            // build root node
            node = createNode(connection.mapId);

            parentNode.links.push({
                map:node,
                tunnelId:connection.tunnelId
            });

            // add to graph
            buildGraphHelper(node, tunnels, connection.mapId, used);
        });
    };

    var createNode = function (mapId) {
        return {
            mapId:mapId,
            links:[]
        };
    };

    printGraphHelper = function (node) {
        console.log('**** FROM ' + node.mapId + '****');


        // look at links
        var links = node.links;
        for (var key in links) {
            var entry = links[key];
            console.log('I can go to ' + entry.map.mapId);
        }

        // go recursive
        for (var key in links) {
            var entry = links[key];
            printGraphHelper(entry.map);
        }
    };

    return {

        buildMapGraph:function (tunnels, mapId) {

            var
                graph = [],
                used = [],
                rootNode;

            // build root node
            rootNode = createNode(mapId);
            graph.push(rootNode);

            buildGraphHelper(rootNode, tunnels, mapId, used);

            return graph;
        },

        printMapGraph:function (graph) {

            for (var key in graph) {
                var entry = graph[key];
                printGraphHelper(entry);
            }
        }
        /*
         // we need to find out all the maps involved and the transitions/tunnels involved
         initialize:function () {

         //
         var used = [];
         searched.push(location.mapId);

         var stages = [];


         var current = {
         mapId : location.mapId,
         node : location.node
         };
         // loop until we reach target map
         while (true) {
         // push first map
         _stages.push({
         mapId:location.mapId,
         sourceNode:location.node
         });

         // just need to use one map?
         if (location.mapId === destination.mapId) {
         var stage = _.first(_stages);
         stage.targetNode = destination.node;
         return;
         }
         }
         } */
    };
});

