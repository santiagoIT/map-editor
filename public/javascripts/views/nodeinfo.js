define([
    'jquery',
    'Underscore',
    'backbone'
],
    function ($, _, Backbone) {

        var NodeInfoView = Backbone.View.extend({
            tagName:'div',
            node:null,


            initialize:function () {
            },

            render:function () {
                if (this.node) {
                    this.$el.html('[' + this.node.column + ',' + this.node.row + ']')
                }
                else {
                    this.$el.html('-');
                }

                return this;
            },

            showNode : function(model, node) {

                this.node = node;
                this.render();
            }
        });

// Our module now returns an instantiated view
// Sometimes you might return an un-instantiated view e.g. return projectListView
        return NodeInfoView;
    });