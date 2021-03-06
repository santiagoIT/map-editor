define([
    'jquery',
    'Underscore',
    'backbone',
    'require',
    'text!views/admin/tunnels/index.html',
    'collections/tunnels',
    'collections/maps'
],
    function ($, _, Backbone, require, html, tunnels, maps) {

        var View = Backbone.View.extend({
            events:{
                'click .navItem':"onNavigateTo",
                'click .delete' : "deleteItem",
                'click .edit' : "editItem"
            },

            initialize:function () {
                // load maps synchronously
                maps.fetch({async:false});

                this.bindTo(tunnels, 'reset', this.render);
                tunnels.fetch({ cache: false });
            },

            render:function () {
                this.$el.html(_.template(html,{items:tunnels.toJSON(), maps:maps.toJSON()}));
            },

            deleteItem : function(el){
                var id = $(el.target).attr('data-id');
                var model = tunnels.get(id);

                require(['biz/deleteConfirm'], function (lib) {
                    lib('Tunnel: ' + model.get('name'), function (model) {
                        model.destroy();
                    }, model);
                });
                return false;
            },

            editItem:function(el){
                var id = $(el.target).attr('data-id');
                require(['itworks.app'], function (app) {
                    app.getRouter().navigate('tunnels_edit/'+id, {trigger:true});
                });
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return View;
    });