define([
    'jquery',
    'Underscore',
    'backbone',
    'require',
    'text!views/admin/locations/locationItem.html',
    'biz/imageManager',
    'libs/jquery.iframe-transport/jquery.iframe-transport'
],
    function ($, _, Backbone, require, html, imageManager) {

        var View = Backbone.View.extend({
            template : _.template(html),
            tagName:'tr',
            events:{
                'click .edit':"onEditModel",
                'click .delete' : "onConfirmDelete"
            },

            initialize:function (options) {
                this.model = options.model;
                this.maps = options.maps;
            },

            render:function (eventName) {

                if (!this.mapName){
                    this.findMap();
                }

                // We keep track of the rendered state of the view
                this._rendered = true;

                var data = {
                    s3Root: imageManager.getS3Root(),
                    model:this.model.toJSON(),
                    mapName : this.mapName
                };
                // trim description
                if (data.model.description.length > 60) {
                    data.model.description = data.model.description.substring(0, 60) + ' ...';
                }

                // reset select
                this.$el.html(this.template(data));

                return this;
            },

            findMap : function() {
                this.mapName = null;
                if (this.maps) {
                    var map = this.maps.get(this.model.get('mapId'));
                    if (map) {
                        this.mapName = map.get('name');
                    }
                }
                if (!this.mapName) {
                    this.mapName = '---';
                }
            },

            onEditModel:function (el) {
                var id = $(el.target).attr('data-id');
                require(['itworks.app'], function (app) {
                    app.getRouter().navigate('locations_edit/' + id, {trigger:true});
                });
                return false;
            },

            onConfirmDelete : function(el) {

                if (this.model){
                    var self = this;
                    var model = this.model;
                    require(['biz/deleteConfirm'], function(lib){
                        lib('Location: ' + self.model.get('name'), function(model){
                            model.destroy();
                        }, self.model);
                    });
                }
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return View;
    });