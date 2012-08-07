define([
    'jquery',
    'Underscore',
    'backbone',
    'require',
    'text!views/tunnels/index.html',
    'collections/tunnels',
    'collections/maps'
],
    function ($, _, Backbone, require, html, tunnels, maps) {

        var View = Backbone.View.extend({
            idToDelete : null,
            events:{
                'click .navItem':"onNavigateTo",
                'click .delete' : "deleteItem",
                'click .edit' : "editItem"
            },

            initialize:function () {

                this.bindTo(tunnels, 'all', this.render);
                tunnels.fetch();

                this.bindTo(maps, 'all', this.render);
                maps.fetch();
            },

            render:function () {

                this.$el.html(_.template(html,{items:tunnels.toJSON(), maps:maps.toJSON()}));
            },

            deleteItem : function(el){
                var id = $(el.target).attr('data-id');
                var model = tunnels.get(id);

                require(['biz/deleteConfirm'], function (lib) {
                    lib('Tunnel: ' + model.get('name'), function (model) {
                        model.destroy({success:function () {
                            // self.collection.remove(model);
                        }});
                    }, model);
                });
                return false;
            },

            editItem:function(el){
                var id = $(el.target).attr('data-id');
                require(['itworks.app'], function (app) {
                    app.Router.navigate('tunnels_edit/'+id, {trigger:true});
                });
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return View;
    });