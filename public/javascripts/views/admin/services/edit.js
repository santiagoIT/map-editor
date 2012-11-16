define([
    'jquery',
    'Underscore',
    'backbone',
    'require',
    'text!views/admin/services/edit.html',
    'models/serviceModel',
    'biz/imageManager',
    'libs/jquery.iframe-transport/jquery.iframe-transport',
    'libs/jquery-plugins/jquery-to-json',
    'bootstrap_wysihtml5'
],
    function ($, _, Backbone, require, html, ServiceModel, imageManager) {

        var View = Backbone.View.extend({
            template:_.template(html),
            events:{
                'click #btnSave':"saveModel",
                'click .navItem' : "onNavigateTo"
            },

            initialize:function (id) {
                var self = this;
                this.model = new ServiceModel({_id:id});
                this.model.fetch({success:function(model, response){
                    self.render();
                }});
            },

            render:function () {
                var options = {
                    model:this.model.toJSON()
                };

                var imageUrl = this.model.get('imageUrl');
                if (imageUrl){
                    options.imageUrl = imageManager.getS3Url(imageUrl);
                }

                this.$el.html(this.template(options));
                this.$el.find('textarea[name="description"]').wysihtml5();
                return this;
            },

            saveModel:function () {

                var data = $('#frmModel').toJSON();
                this.model.set(data);

                this.model.save(null, {
                    success:function(){
                        require(['itworks.app'], function (app) {
                            app.getRouter().navigate('services', {trigger:true});
                        });
                    }
                });

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