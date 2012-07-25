define([
    'Underscore',
    'backbone',
    'models/mapModel'
], function(_, Backbone, Map){

    var MapsCollection = Backbone.Collection.extend({

        model: Map,
        url : 'api/maps'
    });
    return new MapsCollection;
});