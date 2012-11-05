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
                this.bindTo(this.model, 'change:graph change:journey', this.render);
                this.bindTo(this.maps, 'all', this.render);
            },

            render:function () {
                var
                    links = [],
                    graph = this.model.get('graph'),
                   journey = this.model.get('journey');
                if (graph == null || this.maps.length == 0){
                    this.$el.html('');
                    return;
                }
                links = graph[0].links;

                console.log('*** THE LINKS ***');
                console.log(links);

                this.$el.html(this.template({
                    links:links,
                    maps:this.maps.toJSON(),
                    journeyActive:journey ? true : false
                }));
            },

            showMap : function(el){
                var $btn = $(el.target);
                if ($btn.hasClass('disabled')){
                    return;
                }
                var mapId = $btn.attr('data-mapid');
                this.model.showMap(mapId);
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return View;
    });