define([
    'jquery',
    'Underscore',
    'backbone',
    'require',
    'text!views/maps/index.html',
    'models/mapModel',
    'collections/maps',
    'biz/imageManager',
    'libs/jquery.iframe-transport/jquery.iframe-transport'
],
    function ($, _, Backbone, require, html, MapModel, maps, imageManager) {

        var MapsView = Backbone.View.extend({
            collection:maps,
            template : _.template(html),
            events:{
                'click .navItem' : "onNavigateTo",
                'click .edit':"onEditMap",
                'click .delete' : "onConfirmDelete"
            },

            initialize:function () {

                this.$el.html(html);

                // bind events
                this.bindTo(this.collection, 'all', this.render);

                this.bindTo(this)

                // fetch data
                this.collection.fetch();
            },

            render:function () {
                // reset select
                this.$el.html(this.template({s3Root: imageManager.getS3Root(), maps:this.collection.toJSON()}));
            },

            onEditMap:function (el) {
                var id = $(el.target).attr('data-id');
                require(['itworks.app'], function (app) {
                    app.Router.navigate('map_edit/' + id, {trigger:true});
                });
                return false;
            },

            onConfirmDelete : function(el) {
                var idToDelete = $(el.target).attr('data-id');
                if (idToDelete){
                    var self = this;
                    var model = this.collection.get(idToDelete);
                    if (model) {
                        require(['biz/deleteConfirm'], function(lib){
                            lib('Map: ' + model.get('name'), function(model){
                                model.destroy({success:function(){
                                    self.collection.remove(model);
                                }});
                            }, model);
                        });
                    }
                }
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return MapsView;
    });