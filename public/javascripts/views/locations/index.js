define([
    'jquery',
    'Underscore',
    'backbone',
    'require',
    'text!views/locations/index.html',
    'collections/locations',
    'libs/jquery.iframe-transport/jquery.iframe-transport'
],
    function ($, _, Backbone, require, html, locations) {

        var LocationsView = Backbone.View.extend({
            collection:locations,
            idToDelete : null,
            events:{
                'click .navItem':"onNavigateTo",
                'click .delete' : "onAboutToDeleteLocation",
                'click #btnDeleteLocation' : "deleteLocation"
            },

            jqueryMap:{},

            initialize:function () {

                //this.$el.html(html);



                this.collection.on('all', this.render, this);

                this.collection.fetch();

            },

            render:function () {

                this.$el.html(_.template(html,{locations:this.collection.toJSON()}));
            },

            onAboutToDeleteLocation : function(el){
                this.idToDelete = $(el.target).attr('data-id');
                $('#deleteLocation').modal('show');
                return false;
            },

            deleteLocation : function(){
                $('#deleteLocation').modal('hide');
                var model = this.collection.get(this.idToDelete);
                if (model) {
                    model.destroy();
                }
                return false;
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return LocationsView;
    });