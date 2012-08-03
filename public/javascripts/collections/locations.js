define([
    'Underscore',
    'backbone',
    'models/locationModel'
], function(_, Backbone, Map){

    var LocationCollection = Backbone.Collection.extend({

        model: Map,
        url : 'api/locations'
    });
    return new LocationCollection;
});