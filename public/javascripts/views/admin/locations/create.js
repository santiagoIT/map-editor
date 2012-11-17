define([
    'jquery',
    'Underscore',
    'backbone',
    'require',
    'text!views/admin/locations/create.html',
    'models/locationModel'
],
    function ($, _, Backbone, require, html, LocationModel) {

        var View = Backbone.View.extend({
            events:{
                'click .navItem':"onNavigateTo",
                'click #btnSubmit':"onSubmit"
            },

            jqueryMap:{},

            initialize:function () {
                this.$el.html(html);
            },

            render:function () {

            },

            onSubmit : function (el) {
                var self = this;
                var $form = $(el.target).closest('form');
                var location = new LocationModel();
                location.set('name', $form.find('#name').val());
                location.set('description', $form.find('#description').val());
                location.save(null, {
                    success:function(model, response){
                        self.navigateToHelper('locations');
                    },
                    error : function(err){
                        throw(err);
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