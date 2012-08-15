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

            initialize:function (model, maps) {

                this.model = model;
                this.maps = maps;

                // subscribe to changes
                this.bindTo(this.model, 'change:graph', this.render);
                this.bindTo(this.maps, 'all', this.render);
            },

            render:function () {
                var links = [];
                var graph = this.model.get('graph');
                if (graph != null){
                    links = graph[0].links;
                }

                this.$el.html(this.template({
                    links:links,
                    maps:this.maps.toJSON()
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