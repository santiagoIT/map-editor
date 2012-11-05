define([
    'jquery',
    'Underscore',
    'backbone',
    'text!views/client/navigator/links.html',
    'biz/imageManager'
],
    function ($, _, Backbone, html, imageManager) {

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

                this.$el.html(this.template({
                    links:links,
                    maps:this.maps.toJSON(),
                    journeyActive:journey ? true : false,
                    getLinkIconUrl:function(map) {

                        return imageManager.getS3Url(map.linkImageName);
                    }
                }));
            },

            showMap : function(el){

                var $btn = $(el.target).parent();
                if ($btn.hasClass('disabled')){
                    return false;
                }
                var mapId = $btn.attr('data-mapid');
                if (mapId) {
                    this.model.showMap(mapId);
                }
                return false;
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return View;
    });