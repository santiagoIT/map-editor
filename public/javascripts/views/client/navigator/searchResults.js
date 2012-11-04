define([
    'jquery',
    'Underscore',
    'backbone',
    'text!views/client/navigator/searchResults.html'
],
    function ($, _, Backbone, html) {

        var View = Backbone.View.extend({
            events:{
                'click .btnGoToLocation': 'goToLocation'
            },
            template:_.template(html),

            initialize:function (model, searchModel, locations) {

                this.model = model;
                this.locations = locations;
                this.searchModel = searchModel;

                // subscribe
                this.bindTo(this.searchModel, 'change:links', this.render);
                this.bindTo(this.searchModel, 'change:showResults', this.showModal);
            },

            render:function () {
                var
                    journey = this.model.get('journey');
                var model = {
                    links:this.searchModel.getLinksAsJson(),
                    haveSearched:this.searchModel.get('haveSearched'),
                    journeyActive:journey ? true : false
                };
                this.$el.html(this.template(model));
            },

            showModal:function(model, newValue) {

                var self = this;
                if (newValue) {
                    // show modal
                    var $modal = this.$el.find('.modal');
                    $modal.modal('show');
                    $modal.on('hidden', function () {
                        self.searchModel.set('showResults', false);
                    });
                }
            },

            goToLocation : function(el){
                var $btn = $(el.target);
                if ($btn.hasClass('disabled')){
                    return;
                }

                // hide modal
                var self = this;
                var $modal = this.$el.find('.modal');
                $modal.modal('hide');
                $modal.on('hidden', function () {
                    var locationId = $btn.attr('data-loc-id');
                    var loc = self.locations.get(locationId);
                    self.model.navigateTo(loc);
                });

                return false;
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return View;
    });