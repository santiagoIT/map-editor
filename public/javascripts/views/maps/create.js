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
            s3Root : 'https://s3.amazonaws.com/itworks.ec/mapeditor/images/',

            initialize:function () {
                this.$el.html(html);
            },

            render:function () {
            },

            saveMap:function () {
                var self = this;
                var persistMap = function (imageName, $form) {

                    var map = new MapModel();

                    map.set('name', $form.find('#name').val());
                    map.set('imageName', imageName);

                    map.save();

                    self.collection.add(map);
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
                        callback(data.imagename, $form);
                    });
                // TODO handle failure
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return View;
    });