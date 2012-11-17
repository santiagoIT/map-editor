define([
    'jquery',
    'Underscore',
    'backbone',
    'require',
    'text!views/admin/locations/index.html',
    'collections/locations',
    'collections/maps'
],
    function ($, _, Backbone, require, html, locations, maps) {

        var View = Backbone.View.extend({
            collection:locations,
            events:{
                'click .navItem':"onNavigateTo",
                'click .delete' : "deleteLocation",
                'click .edit' : "editLocation"
            },

            initialize:function () {

                // load maps synchronously
                maps.fetch({async:false});

                this.bindTo(this.collection, 'all', this.render);
                this.collection.fetch({ cache: false });
            },

            render:function () {

                this.$el.html(_.template(html,{locations:this.collection.toJSON(), maps:maps.toJSON()}));
            },

            deleteLocation : function(el){

                var id = $(el.target).attr('data-id');
                var model = locations.get(id);

                require(['biz/deleteConfirm'], function (lib) {
                    lib('Location: ' + model.get('name'), function (model) {
                        model.destroy();
                    }, model);
                });
                return false;
            },

            editLocation:function(el){
                var id = $(el.target).attr('data-id');
                require(['itworks.app'], function (app) {
                    app.getRouter().navigate('locations_edit/'+id, {trigger:true});
                });
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return View;
    });