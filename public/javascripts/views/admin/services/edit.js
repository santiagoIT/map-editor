define([
    'jquery',
    'Underscore',
    'backbone',
    'require',
    'text!views/admin/services/edit.html',
    'models/serviceModel',
    'biz/imageManager',
    'views/utils/changeImage',
    'libs/jquery.iframe-transport/jquery.iframe-transport',
    'libs/jquery-plugins/jquery-to-json',
    'bootstrap_wysihtml5'
],
    function ($, _, Backbone, require, html, ServiceModel, imageManager, imageChanger) {

        var View = Backbone.View.extend({
            template:_.template(html),
            events:{
                'click #btnSave':"saveModel",
                'click .navItem' : "onNavigateTo",
                'click .btnChangeImage' : "onChangeImage"
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

            onChangeImage : function(el) {
                var
                    $el = $(el.target),
                    self = this,
                    folder = $el.attr('data-folder'),
                    name = $el.attr('data-name');

                var callback = function (err, data, $form) {
                    if (err) {
                        alert('Failed to change image!');
                        console.log(err);
                        return;
                    }

                    self.model.set(data);
                    self.model.save();
                    self.$el.find('#imgService').attr('src', imageManager.getS3Url(self.model.get('imageUrl')));
                }

                imageChanger(folder, name, callback);
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