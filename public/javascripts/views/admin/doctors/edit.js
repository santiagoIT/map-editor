define([
    'jquery',
    'Underscore',
    'backbone',
    'require',
    'text!views/admin/doctors/edit.html',
    'models/doctorModel',
    'biz/imageManager',
    'views/utils/changeImage',
    'libs/jquery.iframe-transport/jquery.iframe-transport',
    'libs/jquery-plugins/jquery-to-json'
],
    function ($, _, Backbone, require, html, TheModel, imageManager, imageChanger) {

        var View = Backbone.View.extend({
            template:_.template(html),
            events:{
                'click #btnSave':"saveModel",
                'click .navItem' : "onNavigateTo",
                'click .btnChangeImage' : "onChangeImage"
            },

            initialize:function (id) {
                var self = this;
                this.model = new TheModel({_id:id});
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
                    self.$el.find('#imgDoctor').attr('src', imageManager.getS3Url(self.model.get('imageUrl')));
                }

                imageChanger(folder, name, callback);
            },

            saveModel:function () {

                var data = $('#frmModel').toJSON();
                this.model.set(data);

                this.model.save(null, {
                    success:function(){
                        require(['itworks.app'], function (app) {
                            app.getRouter().navigate('doctors', {trigger:true});
                        });
                    }
                });

                return false;
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return View;
    });