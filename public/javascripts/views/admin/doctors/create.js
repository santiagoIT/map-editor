define([
    'jquery',
    'Underscore',
    'backbone',
    'require',
    'text!views/admin/doctors/create.html',
    'models/doctorModel',
    'collections/doctors',
    'biz/imageUploader',
    'libs/jquery.iframe-transport/jquery.iframe-transport',
    'libs/jquery-plugins/jquery-to-json'
],
    function ($, _, Backbone, require, html, TheModel, services, imageUploader) {

        var View = Backbone.View.extend({
            collection:services,
            events:{
                'click #btnSave':"saveModel",
                'click .navItem':"onNavigateTo"
            },

            initialize:function () {

            },

            render:function () {
                this.$el.html(html);
                return this;
            },

            saveModel:function () {
                var
                    $form = $('#frmModel'),
                    self = this;

                var persistModel = function (err, data, $form) {
                    if (err) {
                        alert('Failed to upload images!');
                        console.log(err);
                        return;
                    }

                    var
                        data2 = $form.toJSON(),
                        newEntry = new TheModel();
                    newEntry.set(data);
                    newEntry.set(data2);

                    newEntry.save([],
                        {
                            success:function (model, response, options) {

                                self.collection.add(newEntry);
                                // go to maps view
                                require(['itworks.app'], function (app) {
                                    app.getRouter().navigate('doctors', {trigger:true});
                                });
                            },
                            error:function(model, xhr, options){
                            }
                        });
                }

                imageUploader.uploadImages($form, persistModel);

                return false;
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return View;
    });