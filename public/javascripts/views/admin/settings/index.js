define([
    'jquery',
    'Underscore',
    'backbone',
    'require',
    'text!views/admin/settings/index.html',
    'biz/kioskHelper',
    'libs/jquery-plugins/jquery-to-json'
],
    function ($, _, Backbone, require, html, kioskHelper) {

        var View = Backbone.View.extend({
            template:_.template(html),
            events:{
                'submit form':"onSave",
                'click .navItem':"onNavigateTo"
            },

            initialize:function () {
                this.viewModel = {
                    mapsShowHotspots : kioskHelper.getValueFromLocalStorage('mapsShowHotspots', "false"),
                    mapsShowClosestClickTarget : kioskHelper.getValueFromLocalStorage('mapsShowClosestClickTarget', "false"),
                    toIntroTimerAt : kioskHelper.getValueFromLocalStorage('toIntroTimerAt', "100")
                }

                console.log('settings', this.viewModel);
            },

            render:function () {
                this.$el.html(this.template(this.viewModel));
                return this;
            },

            onSave : function(event) {
                event.preventDefault();
                var data = $(event.target).closest('form').toJSON();
                if (data.mapsShowHotspots) {
                    data.mapsShowHotspots = "true";
                }
                else {
                    data.mapsShowHotspots = "false";
                }
                if (data.mapsShowClosestClickTarget) {
                    data.mapsShowClosestClickTarget = "true";
                }
                else{
                    data.mapsShowClosestClickTarget = "false";
                }

                kioskHelper.saveValueToLocalStorage('mapsShowHotspots', data.mapsShowHotspots);
                kioskHelper.saveValueToLocalStorage('mapsShowClosestClickTarget', data.mapsShowClosestClickTarget);
                kioskHelper.saveValueToLocalStorage('toIntroTimerAt', data.toIntroTimerAt);

                require(['itworks.app'], function (app) {
                    app.getRouter().navigate('', {trigger:true});
                });
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return View;
    });