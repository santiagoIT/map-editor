define([
    'jquery',
    'Underscore',
    'backbone',
    'require',
    'text!views/admin/doctors/edit.html',
    'models/doctorModel',
    'libs/jquery.iframe-transport/jquery.iframe-transport',
    'libs/jquery-plugins/jquery-to-json'
],
    function ($, _, Backbone, require, html, TheModel) {

        var View = Backbone.View.extend({
            template:_.template(html),
            events:{
                'click #btnSave':"saveModel",
                'click .navItem' : "onNavigateTo"
            },

            initialize:function (id) {
                var self = this;
                this.model = new TheModel({_id:id});
                this.model.fetch({success:function(model, response){
                    self.render();
                }});
            },

            render:function () {
                var options = {
                    model:this.model.toJSON()
                };

                this.$el.html(this.template(options));
                return this;
            },

            saveModel:function () {

                var data = $('#frmModel').toJSON();
                this.model.set(data);

                this.model.save(null, {
                    success:function(){
                        require(['itworks.app'], function (app) {
                            app.getRouter().navigate('doctors', {trigger:true});
                        });
                    }
                });

                return false;
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return View;
    });