define([
    'jquery',
    'Underscore',
    'backbone',
    'text!views/client/navigator/searchModalFrame.html',
    'views/client/navigator/searchResults'
],
    function ($, _, Backbone, html, SearchResultsView) {

        var View = Backbone.View.extend({
            initialize:function (model, searchModel, locations) {

                this.model = model;
                this.locations = locations;
                this.searchModel = searchModel;
            },

            prepareSearchResults : function() {
                // results view
                this.searchResultsView = new SearchResultsView(this.model, this.searchModel, this.locations);
                var $resultsContainer = this.$el.find('.modal-body');
                $resultsContainer.append(this.searchResultsView.$el);
                this.addChildView(this.searchResultsView);

                // subscribe
                this.bindTo(this.searchModel, 'change:showResults', this.showModal);
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

            render:function () {

                this.$el.html(html);
                return this;
            }

        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return View;
    });