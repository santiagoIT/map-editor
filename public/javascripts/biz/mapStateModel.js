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
            targetNode:null,
            selectedNode: null,

            // editor - config
            showGrid : true,
            showHotSpots : true,
            showBlockedTiles : true
        },

        initialize : function(){
            console.log('JUST LOGGING... MapStateModel created!!!');
        },

        reset : function (){

        }
    });
    // You usually don't return a model instantiated
    return MapStateModel;
});