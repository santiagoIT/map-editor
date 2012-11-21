define([
    'Underscore',
    'backbone'
], function (_, Backbone) {
    var Model = Backbone.Model.extend({
        defaults:{
            // links
            links:null, // page subset
            results:null, // all results
            haveSearched : false,
            showResults : false,

            // paging
            page: 0,
            itemsPerPage: 5
        },

        initialize:function () {
        },

        getLinksAsJson:function () {
            var links = this.get('links');
            if (!links) {
                return [];
            }

            var arJson = _.map(links, function (l) {
                return l.toJSON();
            })
            return arJson;
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
            var pageCount = Math.floor(total/itemsPerPage);

            console.log('total: ', total, 'pageCount: ', pageCount);
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
              btnNextClass : btnNextClass
            };
        }
    });
    // You usually don't return a model instantiated
    return Model;
});