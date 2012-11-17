define([
    'jquery',
    'Underscore',
    'backbone',
    'collections/locations',
    'text!views/admin/maps/edit/locations.html',
    'views/admin/maps/edit/location',
    'biz/mapStateSingleton'
], function ($, _, Backbone, locations, html, LocationView, mapState) {
    var View = Backbone.View.extend({
        events:{
            'click .createLocation' : "createLocation"
        },

        initialize:function (mapId) {
            this.mapId = mapId;
            this.bindTo(locations, 'all', this.render);
            this.$el.html(html);
        },

        render:function () {
            var $container = this.$('.content');
            $container.empty();
            var self = this;
            locations.each(function (location) {
                if (location.get('mapId') === self.mapId) {
                    var view = new LocationView(location, self.mapId);
                    self.addChildView(view);
                    $container.append(view.el);
                }
            });
        },

        createLocation : function(){
            var self = this;
            var node = mapState.get('selectedNode') || {x:0, y:0};
            // load location creator
            require(['views/maps/edit/modals/locationCreate/module', 'models/locationModel'], function(module, LocationModel) {

                module(self.model, node, function($form){
                    var location = new LocationModel();
                    location.set('name', $form.find('input[name="name"]').val());
                    location.set('description', $form.find('input[name="description"]').val());
                    location.set('mapId', self.mapId);
                    node.x = $form.find('input[name="x"]').val();
                    node.y = $form.find('input[name="y"]').val();
                    location.set('node', node);
                    location.save(null, {
                        success:function(model, response){
                            locations.add(location);
                        },
                        error : function(err){
                            // TODO:
                            throw(err);
                        }
                    });
                });
            });
            return false;
        }
    });
    // Our module now returns an instantiated view
    // Sometimes you might return an un-instantiated view e.g. return projectListView
    return View;
});