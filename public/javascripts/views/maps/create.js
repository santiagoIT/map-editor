define([
    'jquery',
    'Underscore',
    'backbone',
    'require',
    'text!views/maps/create.html',
    'models/mapModel',
    'collections/maps',
    'libs/jquery.iframe-transport/jquery.iframe-transport'
],
    function ($, _, Backbone, require, html, MapModel, maps) {

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
                var persistMap = function (data, $form) {

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

                this.uploadImage($('#frmNewMap'), persistMap);

                return false;
            },

            uploadImage:function ($form, callback) {

                $.ajax('api/uploadmapimage', {
                    type:"POST",
                    data:$("input:text", $form).serializeArray(),
                    files:$("input:file", $form),
                    dataType: 'json',
                    iframe:true,
                    processData:false
                }).done(function (data) {
                        console.log('UPLOAD IMAGE RESPONSE');
                        console.log(data);

                        callback(data, $form);
                    });
                // TODO handle failure
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return View;
    });