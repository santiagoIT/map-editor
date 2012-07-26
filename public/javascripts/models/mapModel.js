define([
    'Underscore',
    'backbone'
], function (_, Backbone) {
    var mapModel = Backbone.Model.extend({
        defaults:{
            // grid layout
            columnCount:10,
            rowCount:10,

            // map info
            imageName:'map1.jpg',
            imageWidth:100,
            imageHeight:100,

            // margins
            top:32,
            left:10,
            bottom:35,
            right:100,

            // marker location
            markerNode:{
                row:0,
                column:0
            },

            // paths
            blockedNodes:[],
            targetNode:null
        },
        urlRoot:'api/maps',

        setGridSize:function (columnCount, rowCount) {
            this.set('columnCount', columnCount);
            this.set('rowCount', rowCount);
            this.trigger('gridLayoutChanged');
            return true;
        },
        setMarkerLocation:function (row, column) {
            this.set('markerNode', {row:row, column:column});
            this.trigger('DataChanged');
        },
        toggleNode:function (row, column) {
            var nodes = this.get('blockedNodes');
            for (var index in nodes) {
                if (nodes[index].row === row && nodes[index].column === column) {
                    // remove it!
                    nodes.splice(index, 1);
                    this.set('blockedNodes', nodes);
                    this.trigger('change:blockedNodes');
                    return 1;
                }
            }
            nodes.push({row:row, column:column});
            this.set('blockedNodes', nodes);
            this.trigger('change:blockedNodes');
            return 0;
        },
        blockNode:function (row, column) {
            var nodes = this.get('blockedNodes');
            for (var index in nodes) {
                if (nodes[index].row === row && nodes[index].column === column) {
                    // already blocked
                    return;
                }
            }
            // block it
            nodes.push({row:row, column:column});
            this.set('blockedNodes', nodes);
            this.trigger('change:blockedNodes');
        },
        clearNode:function (row, column) {
            var nodes = this.get('blockedNodes');
            for (var index in nodes) {
                if (nodes[index].row === row && nodes[index].column === column) {
                    // remove it!
                    nodes.splice(index, 1);
                    this.set('blockedNodes', nodes);
                    this.trigger('change:blockedNodes');
                    return;
                }
            }
        },

        blockAll:function () {
            var columnQty = this.get('columnCount');
            var rowQty = this.get('rowCount');
            var nodes = [];
            for (var i = 0; i < rowQty; i++) {
                for (var j = 0; j < columnQty; j++) {
                    nodes.push({row:i, column:j})
                }
            }
            this.set('blockedNodes', nodes);
            this.trigger('change:blockedNodes');
        },

        clearAll:function () {
            this.set('blockedNodes', []);
            this.trigger('change:blockedNodes');
        },

        getMargins:function () {
            return {
                top:this.get('top'),
                left:this.get('left'),
                bottom:this.get('bottom'),
                right:this.get('right')
            }
        },

        setMargins:function (top, left, bottom, right) {
            this.set('top', top);
            this.set('left', left);
            this.set('bottom', bottom);
            this.set('right', right);
            this.trigger('gridLayoutChanged');
            return true;
        }
    });
    // You usually don't return a model instantiated
    return mapModel;
});