define([
    'jquery',
    'Underscore',
    'backbone',
    'require',
    'text!views/admin/services/create.html',
    'models/serviceModel',
    'collections/services',
    'biz/imageUploader',
    'libs/jquery.iframe-transport/jquery.iframe-transport',
    'bootstrap_wysihtml5'
],
    function ($, _, Backbone, require, html, ServiceModel, services, imageUploader) {

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
                var persistModel = function (err, data, $form) {

                    if (err) {
                        alert('Failed to upload images!');
                        console.log(err);
                        return;
                    }

                    var service = new ServiceModel();
                    service.set(data);
                    service.set($form.toJSON());
                    service.save();
                    self.collection.add(service);

                    // go to maps view
                    require(['itworks.app'], function (app) {
                        app.getRouter().navigate('services', {trigger:true});
                    });
                }

                imageUploader.uploadImages($('#frmNewModel'), persistModel);

                return false;
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return View;
    });