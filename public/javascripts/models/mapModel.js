define([
    'Underscore',
    'backbone'
], function (_, Backbone) {
    var mapModel = Backbone.Model.extend({
        defaults:{
            // grid layout
            columns:1,
            rows:1,

            // map info
            imageName:'map1.jpg',

            // margins
            top:0,
            left:0,
            bottom:0,
            right:0,

            // blocked nodes
            blockedNodes:[]
        },
        urlRoot:'api/maps',
        idAttribute: "_id",

        setGridSize:function (columns, rows) {
            this.set('columns', columns);
            this.set('rows', rows);
            return true;
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

        blockAllNodes : function () {
            var columnQty = this.get('columns');
            var rowQty = this.get('rows');
            var nodes = [];
            for (var i = 0; i < rowQty; i++) {
                for (var j = 0; j < columnQty; j++) {
                    nodes.push({row:i, column:j})
                }
            }
            this.set('blockedNodes', nodes);
            this.trigger('change:blockedNodes');
        },

        clearAllNodes : function () {
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
            return true;
        }
    });
    // You usually don't return a model instantiated
    return mapModel;
});