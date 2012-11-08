define([
    'jquery',
    'Underscore',
    'backbone',
    'bizClient/toIntroNavigator',
    'text!views/client/navigator/links.html'
],
    function ($, _, Backbone, toIntroNavigator, html) {

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

                this.toIntroNavigator = toIntroNavigator;
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
                        var imageName = map.linkImageName;
                        if (!imageName){
                            return '/images/maps/missingLink.png';
                        }

                        return '/data/images/'+map.linkImageName;
                    }
                }));
            },

            showMap : function(el){

                this.toIntroNavigator.startCounting();

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