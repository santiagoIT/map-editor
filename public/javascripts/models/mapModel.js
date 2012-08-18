define([
    'Underscore',
    'backbone'
], function (_, Backbone) {
    var mapModel = Backbone.Model.extend({
        defaults:{
            // grid layout
            x:1,
            y:1,

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

        setGridSize:function (x, y) {
            this.set('x', x);
            this.set('y', y);
            return true;
        },
        toggleNode:function (x, y) {
            var nodes = this.get('blockedNodes');
            for (var index in nodes) {
                if (nodes[index].y === y && nodes[index].x === x) {
                    // remove it!
                    nodes.splice(index, 1);
                    this.set('blockedNodes', nodes);
                    this.trigger('change:blockedNodes');
                    return 1;
                }
            }
            nodes.push({y:y, x:x});
            this.set('blockedNodes', nodes);
            this.trigger('change:blockedNodes');
            return 0;
        },
        blockNode:function (x, y) {
            var nodes = this.get('blockedNodes');
            for (var index in nodes) {
                if (nodes[index].y === y && nodes[index].x === x) {
                    // already blocked
                    return;
                }
            }
            // block it
            nodes.push({y:y, x:x});
            this.set('blockedNodes', nodes);
            this.trigger('change:blockedNodes');
        },
        clearNode:function (x, y) {
            var nodes = this.get('blockedNodes');
            for (var index in nodes) {
                if (nodes[index].y === y && nodes[index].x === x) {
                    // remove it!
                    nodes.splice(index, 1);
                    this.set('blockedNodes', nodes);
                    this.trigger('change:blockedNodes');
                    return;
                }
            }
        },

        blockAllNodes : function () {
            var columnQty = this.get('x');
            var rowQty = this.get('y');
            var nodes = [];
            for (var i = 0; i < rowQty; i++) {
                for (var j = 0; j < columnQty; j++) {
                    nodes.push({y:i, x:j})
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