define([
    'Underscore',
    'backbone'
], function (_, Backbone) {
    var Model = Backbone.Model.extend({
        defaults:{
            // links
            pageResults:null, // page subset
            results:null, // all results
            haveSearched : false,
            showResults : false,

            // paging
            page: 0, // current page
            itemsPerPage: 10
        },

        initialize:function () {
        },

        setJsonResults : function(arJson) {
            // sort
            if (this.fnSort) {
                arJson = this.fnSort(arJson);
            }
            this.set('results', arJson);
        },

        getData:function () {
            var data = this.get('pageResults');
            if (!data) {
                return [];
            }
            return data;
        },

        showPage : function(page) {
            var
                currentPage = this.get('page'),
                pageCount = this.totalPages();
            if (page >= 0 && page <= pageCount-1 && page != currentPage){
                this.set('page', page);
            }
        },

        showNextPage : function() {
            var
                currentPage = this.get('page'),
                pageCount = this.totalPages();
            if (currentPage < pageCount-1){
                console.log('page set: ', currentPage+1);
                this.set('page', currentPage+1);
            }
        },

        showPreviousPage : function() {
            var
                currentPage = this.get('page');
            if (currentPage > 0){
                this.set('page', currentPage-1);
            }
        },

        totalPages: function() {
            var results = this.get('results');
            if (!results){
                return 0;
            }
            var total = results.length;
            var itemsPerPage = this.get('itemsPerPage');
            var pageCount = Math.ceil(total/itemsPerPage);

            return pageCount;
        },

        getPaginationViewModel : function() {

            var
                currentPage = this.get('page'),
                pageCount = this.totalPages(),
                btnNextClass = '',
                btnPreviousClass = '';
            if (currentPage >= pageCount -1){
                btnNextClass = 'disabled';
            }
            if (currentPage == 0){
                btnPreviousClass = 'disabled';
            }

            return {
                currentPage : currentPage,
                pageCount: pageCount,
                btnPreviousClass : btnPreviousClass,
                btnNextClass : btnNextClass,
                data: this.getData(),
                haveSearched : this.get('haveSearched')
            };
        }
    });
    // You usually don't return a model instantiated
    return Model;
});