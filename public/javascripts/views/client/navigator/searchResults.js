define([
    'jquery',
    'Underscore',
    'backbone',
    'text!views/client/navigator/searchResults.html'
],
    function ($, _, Backbone, html) {

        var View = Backbone.View.extend({
            events:{
                'click .btnGoToLocation': 'goToLocation',
                'click .btnPaginationNext': 'showNextPage',
                'click .btnPaginationPrev': 'showPrevPage',
                'click .btnPagination': 'showPage'
            },
            template:_.template(html),

            initialize:function (model, searchModel, locations) {

                this.model = model;
                this.locations = locations;
                this.searchModel = searchModel;

                // subscribe
                this.bindTo(this.searchModel, 'change:pageResults', this.render);
                this.bindTo(this.searchModel, 'change:page', this.getResultsPage);
            },

            getResultsPage: function() {
                var page = this.searchModel.get('page');
                if (page < 0) {
                    this.render();
                    return;
                }

                // get all results
                var results = this.searchModel.get('results');

                //TODO: sort

                // pagination
                var page = this.searchModel.get('page');
                var itemsPerPage = this.searchModel.get('itemsPerPage');

                var subset = results.slice(page*itemsPerPage, page*itemsPerPage+itemsPerPage);

                this.searchModel.set('pageResults', subset);
                var alreadyShowing = this.searchModel.get('showResults');

                if (!alreadyShowing) {
                    this.searchModel.set('showResults', true);
                }
            },

            render:function () {

                var
                    journey = this.model.get('journey');
                var model = {
                    search : this.searchModel.getPaginationViewModel(),
                    journeyActive:journey ? true : false
                };
                this.$el.html(this.template(model));

                return this;
            },

            showNextPage : function(event) {
                event.preventDefault();

                var $el = $(event.target);
                if ($el.parent().hasClass('disabled')) {
                    return;
                }
                this.searchModel.showNextPage();
            },

            showPrevPage : function(event) {
                event.preventDefault();

                var $el = $(event.target);
                if ($el.parent().hasClass('disabled')) {
                       return;
                }
                this.searchModel.showPreviousPage();
            },

            showPage : function(event) {
                event.preventDefault();
                var
                    $el = $(event.target),
                    page = parseInt($el.text())-1;
                if ($el.parent().hasClass('active')) {
                    return;
                }

                this.searchModel.showPage(page);
            },

            goToLocation : function(el){
                var $btn = $(el.target);
                if ($btn.hasClass('disabled')){
                    return;
                }

                // hide modal
                var self = this;
                var $modal = this.$el.closest('.modal');
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