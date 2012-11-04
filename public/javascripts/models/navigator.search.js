define([
    'Underscore',
    'backbone'
], function (_, Backbone) {
    var Model = Backbone.Model.extend({
        defaults:{
            // links
            links:null,
            haveSearched : false,
            showResults : false
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
        }
    });
    // You usually don't return a model instantiated
    return Model;
});