define([
    'jquery',
    'Underscore',
    'backbone'
],
    function ($, _, Backbone) {

        var View = Backbone.View.extend({
            events:{
                'click .btnPaginationNext': 'showNextPage',
                'click .btnPaginationPrev': 'showPrevPage',
                'click .btnPagination': 'showPage',
                'click .clickable' : 'onSearchResultClicked'
            },

            initialize:function (searchModel, html, renderOptions) {

                this.template = _.template(html);
                this.searchModel = searchModel;
                this.renderOptions = renderOptions;

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

                // pagination
                var page = this.searchModel.get('page');
                var itemsPerPage = this.searchModel.get('itemsPerPage');

                var subset = results.slice(page*itemsPerPage, page*itemsPerPage+itemsPerPage);

                this.searchModel.set('pageResults', subset);
            },

            onSearchResultClicked : function(event) {
                event.preventDefault();
                var
                    $el = $(event.target),
                    $row = $el.closest('.searchRow'),
                    id = $row.attr('data-id');
                // trigger event
               this.trigger('searchResultClicked', id);
            },

            render:function () {

                var options = {
                    search : this.searchModel.getPaginationViewModel()
                };
                if (this.renderOptions){
                    _.extend(options,this.renderOptions);
                }

                this.$el.html(this.template(options));

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