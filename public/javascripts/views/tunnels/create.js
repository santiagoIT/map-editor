define([
    'jquery',
    'Underscore',
    'backbone',
    'require',
    'text!views/tunnels/create.html',
    'models/tunnelModel',
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

            jqueryMap:{},

            initialize:function () {
                this.bindTo(maps, 'all', this.render);
                maps.fetch();
            },

            render:function () {
                 this.$el.html(this.template({maps:maps.toJSON()}));
            },

            onSubmit : function (el) {
                var self = this;
                var $form = $(el.target).closest('form');
                var model = new Model();
                model.set($form.toJSON());
                model.save(null, {
                    success:function(model, response){
                        self.navigateToHelper('tunnels');
                    },
                    error : function(err){
                        throw(err);
                    }
                });
                return false;
            },

            navigateToHelper : function(route) {
                require(['itworks.app'], function (app) {
                    app.Router.navigate(route, {trigger:true});
                });
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return View;
    });