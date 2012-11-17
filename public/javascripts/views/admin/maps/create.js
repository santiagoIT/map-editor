define([
    'jquery',
    'Underscore',
    'backbone',
    'require',
    'text!views/admin/maps/create.html',
    'models/mapModel',
    'collections/maps',
    'biz/imageUploader',
    'libs/jquery.iframe-transport/jquery.iframe-transport'
],
    function ($, _, Backbone, require, html, MapModel, maps, imageUploader) {

        var View = Backbone.View.extend({
            collection:maps,
            events:{
                'click #btnSaveMap':"saveMap",
                'click .navItem' : "onNavigateTo"
            },

            initialize:function () {
                this.$el.html(html);
            },

            render:function () {
            },

            saveMap:function () {
                var self = this;
                var persistMap = function (err, data, $form) {

                    if (err) {
                        alert('Failed to upload images!');
                        console.log(err);
                        return;
                    }

                    var map = new MapModel();

                    map.set('name', $form.find('#name').val());
                    for(var fieldName in data) {
                        map.set(fieldName, data[fieldName]);
                    }

                    map.save();

                    self.collection.add(map);

                    // go to maps view
                    require(['itworks.app'], function (app) {
                        app.getRouter().navigate('maps', {trigger:true});
                    });
                }
                imageUploader.uploadImages($('#frmNewMap'), persistMap);

                return false;
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return View;
    });