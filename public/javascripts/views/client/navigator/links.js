define([
    'jquery',
    'Underscore',
    'backbone',
    'text!views/client/navigator/links.html'
],
    function ($, _, Backbone, html) {

        var View = Backbone.View.extend({
            template :_.template(html),
            events:{
                'click .showMap' : 'showMap'
            },

            initialize:function (model) {

                this.model = model;

                // subscribe to changes
                this.bindTo(this.model, 'change:graph', this.render);
            },

            render:function () {
                var links = [];
                var graph = this.model.get('graph');
                if (graph != null){
                    links = graph[0].links;
                }

                this.$el.html(this.template({
                    links:links
                }));
            },

            showMap : function(el){
                var mapId = $(el.target).attr('data-mapid');
                this.model.showMap(mapId);
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return View;
    });