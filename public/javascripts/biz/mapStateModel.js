define([
    'Underscore',
    'backbone'
], function (_, Backbone) {
    var MapStateModel = Backbone.Model.extend({
        defaults:{
            editorMode :  'toggleNode',
            // marker location
            markerNode:{
                row:0,
                column:0
            },

            // paths
            targetNode:null
        }
    });
    // You usually don't return a model instantiated
    return MapStateModel;
});