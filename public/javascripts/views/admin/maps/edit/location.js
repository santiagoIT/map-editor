define([
    'jquery',
    'Underscore',
    'backbone',
    'text!views/admin/maps/edit/location.html',
    'biz/mapStateSingleton'
], function ($, _, Backbone, html, mapState) {
    var View = Backbone.View.extend({
        events:{
            'click .showLocation':"showLocation",
            'click .removeLocation':"removeLocation",
            'click .goToLocation':"goToLocation",
            'click .setLocation':"setLocation",
            'click .editLocation' : "editLocation"
        },
        template:_.template(html),
        tagName: 'tr',

        initialize:function (model, mapId) {
            this.model = model;
            this.mapId = mapId;
            this.bindTo(this.model, 'change:all', this.render);
        },

        render:function () {
            this.$el.html(this.template({
                item:this.model.toJSON(),
                mapId:this.mapId
            }));
            return this;
        },

        showLocation:function (el) {
            var node = this.model.get('node');
            mapState.set('selectedNode', node);
            return false;
        },

        setLocation:function () {
            var node = mapState.get('selectedNode');
            if (node) {
                this.model.set('node', node);
                this.model.save();
            }
            return false;
        },

        goToLocation:function () {
            mapState.set('targetNode', this.model.get('node'));
            return false;
        },

        removeLocation:function (el) {
            var self = this;
            require(['biz/deleteConfirm'], function (lib) {
                lib('Location: ' + self.model.get('name'), function (model) {
                    model.destroy({success:function () {
                        // self.collection.remove(model);
                    }});
                }, self.model);
            });
            return false;
        },

        editLocation : function(el){
            var id = this.model.id;
            require(['itworks.app'], function (app) {
                app.getRouter().navigate('locations_edit/'+id, {trigger:true});
            });
        }
    });
    // Our module now returns an instantiated view
    // Sometimes you might return an un-instantiated view e.g. return projectListView
    return View;
});