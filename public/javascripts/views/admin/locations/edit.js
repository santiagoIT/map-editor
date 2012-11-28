define([
    'jquery',
    'Underscore',
    'backbone',
    'require',
    'text!views/admin/locations/edit.html',
    'models/locationModel',
    'collections/maps',
    'biz/imageManager',
    'views/utils/changeImage',
    'libs/jquery.iframe-transport/jquery.iframe-transport',
    'libs/jquery-plugins/jquery-to-json',
    'bootstrap_wysihtml5'
],
    function ($, _, Backbone, require, html, Model, maps, imageManager, imageChanger) {

        var View = Backbone.View.extend({
            events:{
                'click .navItem':"onNavigateTo",
                'click #btnSubmit':"onSubmit",
                'click .btnChangeImage' : "onChangeImage"
            },
            template :_.template(html),

            initialize:function (id) {
                // load maps synchronously
                maps.fetch({async:false});

                this.model = new Model({_id:id});
                this.bindTo(this.model, 'all', this.render);
                this.model.fetch();
            },

            render:function () {

                var options = {
                    model:this.model.toJSON(),
                    maps:maps.toJSON(),
                    checked : this.model.includeInSearch ? 'on' : 'off'
                };

                var imageUrl = this.model.get('imageUrl');
                if (imageUrl){
                    options.imageUrl = imageManager.getS3Url(imageUrl);
                }

                this.$el.html(this.template(options));
                this.$el.find('textarea[name="description"]').wysihtml5();
                return this;
            },

            onSubmit : function (el) {
                var self = this;
                var data = $(el.target).closest('form').toJSON();
                if (data.includeInSearch){
                    data.includeInSearch = true;
                }
                else {
                    data.includeInSearch = false;
                }
                el.preventDefault();

                this.model.set(data);
                this.model.save(null, {
                    success:function(arg1){
                        require(['itworks.app'], function (app) {
                            app.getRouter().navigate('locations', {trigger:true});
                        });
                    }
                });

                return false;
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
                    self.$el.find('#imgLocation').attr('src', imageManager.getS3Url(self.model.get('imageUrl')));
                }

                imageChanger(folder, name, callback);
            },

            navigateToHelper : function(route) {
                require(['itworks.app'], function (app) {
                    app.getRouter().navigate(route, {trigger:true});
                });
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return View;
    });