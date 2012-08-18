define([
    'jquery',
    'Underscore',
    'backbone',
    'biz/mapStateSingleton'
],
    function ($, _, Backbone, mapState) {

        var NodeInfoView = Backbone.View.extend({

            initialize:function () {
                this.bindTo(mapState, 'change:markerNode change:targetNode change:selectedNode', this.render);
            },

            render:function () {
                var node = mapState.get('selectedNode');
                if (node) {
                    this.$el.html('[' + node.x + ',' + node.y + ']')
                }
                else {
                    this.$el.html('[-]');
                }

                return this;
            }
        });

// Our module now returns an instantiated view
// Sometimes you might return an un-instantiated view e.g. return projectListView
        return NodeInfoView;
    });