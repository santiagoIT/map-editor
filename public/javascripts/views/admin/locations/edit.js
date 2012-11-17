define([
    'jquery',
    'Underscore',
    'backbone',
    'require',
    'text!views/admin/locations/edit.html',
    'models/locationModel',
    'collections/maps',
    'libs/jquery-plugins/jquery-to-json'
],
    function ($, _, Backbone, require, html, Model, maps) {

        var View = Backbone.View.extend({
            events:{
                'click .navItem':"onNavigateTo",
                'click #btnSubmit':"onSubmit"
            },
            template :_.template(html),

            initialize:function (id) {
                this.model = new Model({_id:id});
                this.bindTo(this.model, 'all', this.render);
                this.model.fetch();

                this.bindTo(maps, 'all', this.render);
                maps.fetch();
            },

            render:function () {
                console.log(maps.toJSON());
                console.log(this.model.toJSON());
                this.$el.html(this.template({model: this.model.toJSON(), maps:maps.toJSON()}));
            },

            onSubmit : function (el) {
                var self = this;
                var data = $(el.target).closest('form').toJSON();

                this.model.set(data);
                this.model.save(null, {
                    success:function(){
                        require(['itworks.app'], function (app) {
                            app.getRouter().navigate('locations', {trigger:true});
                        });
                    }
                });

                return false;
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