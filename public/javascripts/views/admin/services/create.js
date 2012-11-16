define([
    'jquery',
    'Underscore',
    'backbone',
    'require',
    'text!views/admin/services/create.html',
    'models/serviceModel',
    'collections/services',
    'libs/jquery.iframe-transport/jquery.iframe-transport',
    'bootstrap_wysihtml5'
],
    function ($, _, Backbone, require, html, ServiceModel, services) {

        var View = Backbone.View.extend({
            collection:services,
            events:{
                'click #btnSave':"saveModel",
                'click .navItem' : "onNavigateTo"
            },

            initialize:function () {
                this.$el.html(html);
                this.$el.find('textarea[name="description"]').wysihtml5();
            },

            render:function () {

                return this;
            },

            saveModel:function () {
                var self = this;
                var persistModel = function (data, $form) {

                    var service = new ServiceModel();

                    service.set('title', $form.find('#title').val());
                    service.set('description', $form.find('textarea[name="description"]').val());
                    for(var fieldName in data) {
                        service.set(fieldName, data[fieldName]);
                    }
                    service.save();

                    self.collection.add(service);

                    // go to maps view
                    require(['itworks.app'], function (app) {
                        app.getRouter().navigate('services', {trigger:true});
                    });
                }

                this.uploadImage($('#frmNewModel'), persistModel);

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
                        callback(data, $form);
                    });
                // TODO handle failure
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return View;
    });