define([
    'jquery',
    'Underscore',
    'backbone',
    'require',
    'text!views/admin/doctors/create.html',
    'models/doctorModel',
    'collections/doctors',
    'libs/jquery.iframe-transport/jquery.iframe-transport',
    'libs/jquery-plugins/jquery-to-json'
],
    function ($, _, Backbone, require, html, TheModel, services) {

        var View = Backbone.View.extend({
            collection:services,
            events:{
                'click #btnSave':"saveModel",
                'click .navItem' : "onNavigateTo"
            },

            initialize:function () {

            },

            render:function () {
                this.$el.html(html);
                return this;
            },

            saveModel:function () {
                var
                    newEntry = new TheModel(),
                    self = this;
                var data = $('#frmModel').toJSON();
                newEntry.set(data);
                newEntry.save({success:function(model, response, options){
                    self.collection.add(newEntry);

                    // go to maps view
                    require(['itworks.app'], function (app) {
                        app.getRouter().navigate('services', {trigger:true});
                    });
                }});

                return false;
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return View;
    });