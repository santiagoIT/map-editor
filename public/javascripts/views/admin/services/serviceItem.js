define([
    'jquery',
    'Underscore',
    'backbone',
    'require',
    'text!views/admin/services/serviceItem.html',
    'biz/imageManager',
    'libs/jquery.iframe-transport/jquery.iframe-transport'
],
    function ($, _, Backbone, require, html, imageManager) {

        var View = Backbone.View.extend({
            template : _.template(html),
            tagName:'tr',
            events:{
                'click .edit':"onEditModel",
                'click .delete' : "onConfirmDelete"
            },

            initialize:function (options) {
                this.model = options.model;
            },

            render:function (eventName) {

                // We keep track of the rendered state of the view
                this._rendered = true;

                // reset select
                this.$el.html(this.template({s3Root: imageManager.getS3Root(), model:this.model.toJSON()}));

                return this;
            },

            onEditModel:function (el) {
                var id = $(el.target).attr('data-id');
                require(['itworks.app'], function (app) {
                    app.getRouter().navigate('services_edit/' + id, {trigger:true});
                });
                return false;
            },

            onConfirmDelete : function(el) {

                if (this.model){
                    var self = this;
                    var model = this.model;
                    require(['biz/deleteConfirm'], function(lib){
                        lib('Service: ' + self.model.get('title'), function(model){
                            model.destroy();
                        }, self.model);
                    });
                }
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return View;
    });