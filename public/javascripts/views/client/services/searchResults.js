define([
    'jquery',
    'Underscore',
    'backbone',
    'text!views/client/services/searchResults.html'
],
    function ($, _, Backbone, html) {

        var View = Backbone.View.extend({
            events:{
                'click .btnPaginationNext': 'showNextPage',
                'click .btnPaginationPrev': 'showPrevPage',
                'click .btnPagination': 'showPage'
            },
            template:_.template(html),

            initialize:function (searchModel) {

                this.searchModel = searchModel;

                // subscribe
                this.bindTo(this.searchModel, 'change:pageResults', this.render);
                this.bindTo(this.searchModel, 'change:page', this.getResultsPage);
                this.bindTo(this.searchModel, 'change:results', this.getResultsPage);
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
            },

            render:function () {

                var data = {
                    search : this.searchModel.getPaginationViewModel()
                };
                this.$el.html(this.template(data));

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
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return View;
    });